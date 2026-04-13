import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './Dashboard.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MembrosScreen } from '../components/dashboard/membros/MembrosScreen.tsx';
import { CobrancasScreen } from '../components/dashboard/cobrancas/CobrancasScreen.tsx';

const MENUS = ['visao-geral', 'eventos', 'catalogo', 'membros', 'cobrancas'];

const defaultEvento = { id: null, nome: '', data: '', hora: '', local: '', descricao: '' };
const defaultCatalogo = { id: null, nome: '', categoria: '', valor: '', descricao: '', variacoes: '' };

const Dashboard = () => {
  const navigate = useNavigate();
  const [menuAtivo, setMenuAtivo] = useState(MENUS[0]);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [eventos, setEventos] = useState([]);
  const [catalogo, setCatalogo] = useState([]);
  const [totalPessoas, setTotalPessoas] = useState(0);
  const [totalCobrancas, setTotalCobrancas] = useState(0);
  const [buscaEventos, setBuscaEventos] = useState('');
  const [buscaCatalogo, setBuscaCatalogo] = useState('');
  const [filtroLocal, setFiltroLocal] = useState('todos');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [eventoForm, setEventoForm] = useState(defaultEvento);
  const [catalogoForm, setCatalogoForm] = useState(defaultCatalogo);
  const [mostrarModalEvento, setMostrarModalEvento] = useState(false);
  const [mostrarModalCatalogo, setMostrarModalCatalogo] = useState(false);
  const modalRef = useRef(null);

  const carregarDados = useCallback(async () => {
    setLoading(true);
    setError('');

    const [
      { data: sessao },
      { data: eventosData, error: eventosError },
      { data: catalogoData, error: catalogoError },
      { data: pessoasIds, error: pessoasError },
      { data: cobrancasIds, error: cobrancasCountError },
    ] = await Promise.all([
      supabase.auth.getSession(),
      supabase.from('eventos').select('id, nome, data, hora, local, descricao').order('data', { ascending: true }),
      supabase.from('catalogo').select('id, nome, categoria, valor, descricao, variacoes').order('id', { ascending: true }),
      // `count` + head:true pode devolver valor errado em alguns casos; o tamanho da lista de ids
      // corresponde ao que o utilizador pode ver (RLS) e à contagem real de linhas.
      supabase.from('pessoas').select('id'),
      supabase.from('cobrancas').select('id'),
    ]);

    if (!sessao?.session) {
      navigate('/login');
      return;
    }

    if (eventosError || catalogoError || pessoasError || cobrancasCountError) {
      setError('Falha ao carregar dados da dashboard. Verifique se as tabelas existem no Supabase.');
    }

    setEventos(eventosData ?? []);
    setCatalogo(catalogoData ?? []);
    setTotalPessoas(pessoasIds?.length ?? 0);
    setTotalCobrancas(cobrancasIds?.length ?? 0);
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  useEffect(() => {
    const handleClickFora = (event) => {
      if (!mostrarModalEvento && !mostrarModalCatalogo) return;
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setMostrarModalEvento(false);
        setMostrarModalCatalogo(false);
        setEventoForm(defaultEvento);
        setCatalogoForm(defaultCatalogo);
      }
    };
    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, [mostrarModalEvento, mostrarModalCatalogo]);

  const eventosProximos = useMemo(() => eventos.slice(0, 3), [eventos]);
  const locais = useMemo(() => [...new Set(eventos.map((e) => e.local).filter(Boolean))], [eventos]);
  const categorias = useMemo(() => [...new Set(catalogo.map((c) => c.categoria).filter(Boolean))], [catalogo]);

  const eventosFiltrados = useMemo(
    () =>
      eventos.filter((e) => {
        const txt = `${e.nome} ${e.local ?? ''} ${e.descricao ?? ''}`.toLowerCase();
        const bateBusca = txt.includes(buscaEventos.toLowerCase().trim());
        const bateLocal = filtroLocal === 'todos' || e.local === filtroLocal;
        return bateBusca && bateLocal;
      }),
    [eventos, buscaEventos, filtroLocal],
  );

  const catalogoFiltrado = useMemo(
    () =>
      catalogo.filter((item) => {
        const txt = `${item.nome} ${item.categoria ?? ''} ${item.descricao ?? ''}`.toLowerCase();
        const bateBusca = txt.includes(buscaCatalogo.toLowerCase().trim());
        const bateCategoria = filtroCategoria === 'todas' || item.categoria === filtroCategoria;
        return bateBusca && bateCategoria;
      }),
    [catalogo, buscaCatalogo, filtroCategoria],
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const salvarEvento = async (e) => {
    e.preventDefault();
    const payload = {
      nome: eventoForm.nome,
      data: eventoForm.data,
      hora: eventoForm.hora,
      local: eventoForm.local,
      descricao: eventoForm.descricao,
    };
    const { error: saveError } = eventoForm.id
      ? await supabase.from('eventos').update(payload).eq('id', eventoForm.id)
      : await supabase.from('eventos').insert(payload);
    if (saveError) {
      setError('Nao foi possivel salvar o evento.');
      return;
    }
    setEventoForm(defaultEvento);
    setMostrarModalEvento(false);
    carregarDados();
  };

  const salvarCatalogo = async (e) => {
    e.preventDefault();
    const payload = {
      nome: catalogoForm.nome,
      categoria: catalogoForm.categoria,
      valor: catalogoForm.valor,
      descricao: catalogoForm.descricao,
      variacoes: catalogoForm.variacoes,
    };
    const { error: saveError } = catalogoForm.id
      ? await supabase.from('catalogo').update(payload).eq('id', catalogoForm.id)
      : await supabase.from('catalogo').insert(payload);
    if (saveError) {
      setError('Nao foi possivel salvar o item do catalogo.');
      return;
    }
    setCatalogoForm(defaultCatalogo);
    setMostrarModalCatalogo(false);
    carregarDados();
  };

  const deletarRegistro = async (tabela, id) => {
    const { error: deleteError } = await supabase.from(tabela).delete().eq('id', id);
    if (deleteError) {
      setError(`Nao foi possivel excluir o registro: ${deleteError.message}`);
      return;
    }
    carregarDados();
  };

  const abrirEdicaoEvento = (evento) => {
    setEventoForm({ ...defaultEvento, ...evento });
    setMostrarModalEvento(true);
  };

  const abrirEdicaoCatalogo = (item) => {
    setCatalogoForm({ ...defaultCatalogo, ...item });
    setMostrarModalCatalogo(true);
  };

  const abrirAdicaoEvento = () => {
    setEventoForm(defaultEvento);
    setMostrarModalEvento(true);
  };

  const abrirAdicaoCatalogo = () => {
    setCatalogoForm(defaultCatalogo);
    setMostrarModalCatalogo(true);
  };

  if (loading) return <section className="dash-page"><p>Carregando dashboard...</p></section>;

  return (
    <section className="dash-page">
      <button
        className="dash-hamburger"
        type="button"
        aria-label="Abrir menu da dashboard"
        onClick={() => setSidebarAberta((prev) => !prev)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {sidebarAberta && <div className="dash-sidebar-backdrop" onClick={() => setSidebarAberta(false)} />}

      <aside className={`dash-sidebar ${sidebarAberta ? 'open' : ''}`}>
        <h2>Area Restrita</h2>
        <button
          className={`dash-menu ${menuAtivo === 'visao-geral' ? 'active' : ''}`}
          onClick={() => {
            setMenuAtivo('visao-geral');
            setSidebarAberta(false);
          }}
        >
          Visao geral
        </button>
        <button
          className={`dash-menu ${menuAtivo === 'eventos' ? 'active' : ''}`}
          onClick={() => {
            setMenuAtivo('eventos');
            setSidebarAberta(false);
          }}
        >
          Eventos
        </button>
        <button
          className={`dash-menu ${menuAtivo === 'catalogo' ? 'active' : ''}`}
          onClick={() => {
            setMenuAtivo('catalogo');
            setSidebarAberta(false);
          }}
        >
          Catalogo
        </button>
        <button
          className={`dash-menu ${menuAtivo === 'membros' ? 'active' : ''}`}
          onClick={() => {
            setMenuAtivo('membros');
            setSidebarAberta(false);
          }}
        >
          Membros
        </button>
        <button
          className={`dash-menu ${menuAtivo === 'cobrancas' ? 'active' : ''}`}
          onClick={() => {
            setMenuAtivo('cobrancas');
            setSidebarAberta(false);
          }}
        >
          Cobrancas
        </button>
        <button className="dash-logout" onClick={handleLogout}>
          Sair
        </button>
      </aside>

      <div className="dash-content">
        {error && <p className="dash-error">{error}</p>}

        {menuAtivo === 'visao-geral' && (
          <>
            <h1>Visao geral</h1>
            <div className="dash-grid-3">
              <article className="dash-card">
                <h3>Cobrancas</h3>
                <p className="dash-big">{totalCobrancas}</p>
              </article>
              <article className="dash-card">
                <h3>Itens no catalogo</h3>
                <p className="dash-big">{catalogo.length}</p>
              </article>
              <article className="dash-card">
                <h3>Membros</h3>
                <p className="dash-big">{totalPessoas}</p>
              </article>
            </div>
            <h2>Proximos eventos</h2>
            <div className="dash-grid-3">
              {eventosProximos.map((e) => (
                <article key={e.id} className="dash-card">
                  <h3>{e.nome}</h3>
                  <p>{e.data}</p>
                  <p>{e.local}</p>
                </article>
              ))}
            </div>
          </>
        )}

        {menuAtivo === 'eventos' && (
          <>
            <h1>Eventos</h1>
            <div className="dash-section-header">
              <div className="dash-filtros">
                <input placeholder="Pesquisar evento" value={buscaEventos} onChange={(e) => setBuscaEventos(e.target.value)} />
                <select value={filtroLocal} onChange={(e) => setFiltroLocal(e.target.value)}>
                  <option value="todos">Todos os locais</option>
                  {locais.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <button className="dash-add-button" onClick={abrirAdicaoEvento}>
                Adicionar evento
              </button>
            </div>

            <div className="dash-filtros-mobile">
              <input placeholder="Pesquisar evento" value={buscaEventos} onChange={(e) => setBuscaEventos(e.target.value)} />
              <select value={filtroLocal} onChange={(e) => setFiltroLocal(e.target.value)}>
                <option value="todos">Todos os locais</option>
                {locais.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div className="dash-grid-3">
              {eventosFiltrados.map((e) => (
                <article className="dash-card" key={e.id}>
                  <h3>{e.nome}</h3>
                  <p>
                    {e.data} - {e.hora}
                  </p>
                  <p>{e.local}</p>
                  <p>{e.descricao}</p>
                  <div className="dash-actions">
                    <button onClick={() => abrirEdicaoEvento(e)}>Editar</button>
                    <button onClick={() => deletarRegistro('eventos', e.id)}>Excluir</button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {menuAtivo === 'catalogo' && (
          <>
            <h1>Catalogo</h1>
            <div className="dash-section-header">
              <div className="dash-filtros">
                <input placeholder="Pesquisar item" value={buscaCatalogo} onChange={(e) => setBuscaCatalogo(e.target.value)} />
                <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
                  <option value="todas">Todas as categorias</option>
                  {categorias.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <button className="dash-add-button" onClick={abrirAdicaoCatalogo}>
                Adicionar item
              </button>
            </div>

            <div className="dash-filtros-mobile">
              <input placeholder="Pesquisar item" value={buscaCatalogo} onChange={(e) => setBuscaCatalogo(e.target.value)} />
              <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
                <option value="todas">Todas as categorias</option>
                {categorias.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="dash-grid-3">
              {catalogoFiltrado.map((item) => (
                <article className="dash-card" key={item.id}>
                  <h3>{item.nome}</h3>
                  <p>{item.categoria}</p>
                  <p>R$ {item.valor}</p>
                  <p>{item.descricao}</p>
                  <p>{item.variacoes}</p>
                  <div className="dash-actions">
                    <button onClick={() => abrirEdicaoCatalogo(item)}>Editar</button>
                    <button onClick={() => deletarRegistro('catalogo', item.id)}>Excluir</button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {menuAtivo === 'membros' && <MembrosScreen />}
        {menuAtivo === 'cobrancas' && <CobrancasScreen />}
      </div>

      {mostrarModalEvento && (
        <div className="dash-modal-overlay">
          <div className="dash-modal" ref={modalRef}>
            <h2>{eventoForm.id ? 'Editar evento' : 'Adicionar evento'}</h2>
            <form className="dash-form" onSubmit={salvarEvento}>
              <input
                placeholder="Nome"
                value={eventoForm.nome}
                onChange={(e) => setEventoForm({ ...eventoForm, nome: e.target.value })}
                required
              />
              <input type="date" value={eventoForm.data} onChange={(e) => setEventoForm({ ...eventoForm, data: e.target.value })} required />
              <input type="time" value={eventoForm.hora} onChange={(e) => setEventoForm({ ...eventoForm, hora: e.target.value })} required />
              <input
                placeholder="Local"
                value={eventoForm.local}
                onChange={(e) => setEventoForm({ ...eventoForm, local: e.target.value })}
                required
              />
              <input
                placeholder="Descricao"
                value={eventoForm.descricao}
                onChange={(e) => setEventoForm({ ...eventoForm, descricao: e.target.value })}
              />
              <button type="submit">Salvar evento</button>
            </form>
            <button className="dash-close" onClick={() => setMostrarModalEvento(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}

      {mostrarModalCatalogo && (
        <div className="dash-modal-overlay">
          <div className="dash-modal" ref={modalRef}>
            <h2>{catalogoForm.id ? 'Editar item do catalogo' : 'Adicionar item ao catalogo'}</h2>
            <form className="dash-form" onSubmit={salvarCatalogo}>
              <input
                placeholder="Nome"
                value={catalogoForm.nome}
                onChange={(e) => setCatalogoForm({ ...catalogoForm, nome: e.target.value })}
                required
              />
              <input
                placeholder="Categoria"
                value={catalogoForm.categoria}
                onChange={(e) => setCatalogoForm({ ...catalogoForm, categoria: e.target.value })}
                required
              />
              <input
                placeholder="Valor"
                value={catalogoForm.valor}
                onChange={(e) => setCatalogoForm({ ...catalogoForm, valor: e.target.value })}
                required
              />
              <input
                placeholder="Descricao"
                value={catalogoForm.descricao}
                onChange={(e) => setCatalogoForm({ ...catalogoForm, descricao: e.target.value })}
              />
              <input
                placeholder="Variacoes (separe por virgula)"
                value={catalogoForm.variacoes}
                onChange={(e) => setCatalogoForm({ ...catalogoForm, variacoes: e.target.value })}
              />
              <button type="submit">Salvar item</button>
            </form>
            <button className="dash-close" onClick={() => setMostrarModalCatalogo(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Dashboard;

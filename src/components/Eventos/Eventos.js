import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
export default function Eventos() {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        async function load() {
            setLoading(true);
            setError('');
            const { data, error } = await supabase
                .from('eventos')
                .select('id, titulo, descricao, data, local, imagem_url')
                .order('data', { ascending: true });
            if (error) setError(error.message);
            else setEventos(data ?? []);
            setLoading(false);
        }
        load();
    }, []);
    if (loading) return <p>Carregando eventos...</p>;
    if (error) return <p>Erro ao carregar: {error}</p>;
    return (
        <section>
            {eventos.map((e) => (
                <article key={e.id}>
                    <h3>{e.titulo}</h3>
                    <p>{e.local}</p>
                    <p>{new Date(e.data).toLocaleDateString()}</p>
                    <p>{e.descricao}</p>
                    {e.imagem_url && <img src={e.imagem_url} alt={e.titulo} />}
                </article>
            ))}
        </section>
    );
}

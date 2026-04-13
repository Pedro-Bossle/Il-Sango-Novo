import type { Cobranca } from '../../../types/database';
import { isCobrancaPendente, valorSaldoCobranca, valorTotalCobranca } from '../../../services/cobrancas';

type Props = {
  cobrancas: Cobranca[];
};

export function CobrancasReadOnlySummary({ cobrancas }: Props) {
  if (cobrancas.length === 0) {
    return (
      <section className="dash-form-section">
        <h2 className="dash-form-section__title">Cobranças</h2>
        <p className="dash-muted">Nenhuma cobrança associada. As cobranças são geridas no ecrã Cobranças.</p>
      </section>
    );
  }

  return (
    <section className="dash-form-section">
      <h2 className="dash-form-section__title">Cobranças (resumo)</h2>
      <p className="dash-muted">Apenas leitura. Para criar ou editar, use o menu Cobranças.</p>
      <div className="dash-table-scroll">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Valor</th>
              <th>Descrição</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {cobrancas.map((c) => {
              const pendente = isCobrancaPendente(c);
              const total = valorTotalCobranca(c);
              const saldo = valorSaldoCobranca(c);
              return (
                <tr key={c.id}>
                  <td>{c.vencimento || '—'}</td>
                  <td>
                    R$ {total.toFixed(2)}
                    {saldo > 0.001 && saldo < total - 0.001 && (
                      <span className="dash-muted"> (aberto R$ {saldo.toFixed(2)})</span>
                    )}
                  </td>
                  <td>{c.descricao || '—'}</td>
                  <td>
                    <span className={`dash-badge ${pendente ? 'dash-badge--devendo' : 'dash-badge--ok'}`}>
                      {pendente ? 'Devendo' : 'Em dia'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

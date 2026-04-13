import { useState } from 'react';
import {
  isObrigacaoTipo,
  progressoPagamentoObrigacao,
  valorPagoCobranca,
  valorSaldoCobranca,
  valorTotalCobranca,
  type CobrancaComMembro,
} from '../../../services/cobrancas';
import { RegistrarPagamentoModal } from './RegistrarPagamentoModal';
import { HistoricoPagamentosModal } from './HistoricoPagamentosModal';

type Props = {
  cobranca: CobrancaComMembro;
  onEdit: (c: CobrancaComMembro) => void;
  onDelete: (c: CobrancaComMembro) => void;
  onRefresh: () => void;
};

/** Vencimento vindo da BD como YYYY-MM-DD — evita desvio de dia com `new Date` em UTC. */
function formatarVencimentoBR(raw: string | null | undefined): string {
  if (raw == null || String(raw).trim() === '') return '—';
  const s = String(raw).trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function badgeTipo(t: string | null | undefined): { label: string; className: string } {
  if (t === 'mensalidade') return { label: 'Mensalidade', className: 'dash-badge-tipo dash-badge-tipo--mensalidade' };
  if (t === 'obrigacao') return { label: 'Obrigação', className: 'dash-badge-tipo dash-badge-tipo--obrigacao' };
  if (t === 'outros') return { label: 'Outros', className: 'dash-badge-tipo dash-badge-tipo--outros' };
  return { label: t?.trim() ? String(t) : '—', className: 'dash-badge-tipo' };
}

export function CobrancaRow({ cobranca, onEdit, onDelete, onRefresh }: Props) {
  const [registrarOpen, setRegistrarOpen] = useState(false);
  const [historicoOpen, setHistoricoOpen] = useState(false);

  const total = valorTotalCobranca(cobranca);
  const pago = valorPagoCobranca(cobranca);
  const saldo = valorSaldoCobranca(cobranca);
  const obrigacao = isObrigacaoTipo(cobranca);
  const pct = obrigacao ? progressoPagamentoObrigacao(cobranca) * 100 : 0;
  const tipoBadge = badgeTipo(cobranca.tipo);

  const dataCriacao = (() => {
    const raw = cobranca.created_at;
    if (!raw) return '—';
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  })();

  return (
    <>
      <tr>
        <td className="dash-cob-criacao">{dataCriacao}</td>
        <td>{formatarVencimentoBR(cobranca.vencimento)}</td>
        <td>{cobranca.membro_nome}</td>
        <td>
          <span className={tipoBadge.className}>{tipoBadge.label}</span>
        </td>
        <td className="dash-cob-valores">
          {obrigacao ? (
            <>
              <div className="dash-cob-valores__line">
                <span>Total</span> <strong>R$ {total.toFixed(2)}</strong>
              </div>
              <div className="dash-cob-valores__line">
                <span>Pago</span> <strong>R$ {pago.toFixed(2)}</strong>
              </div>
              <div className="dash-cob-valores__line">
                <span>Saldo</span> <strong>R$ {saldo.toFixed(2)}</strong>
              </div>
              <p className="dash-cob-progress-meta">
                R$ {pago.toFixed(2)} / R$ {total.toFixed(2)}
              </p>
              <div className="dash-cob-progress" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
                <div className="dash-cob-progress__fill" style={{ width: `${Math.min(100, pct)}%` }} />
              </div>
            </>
          ) : (
            <div className="dash-cob-valores__line">
              <strong>R$ {total.toFixed(2)}</strong>
            </div>
          )}
        </td>
        <td>{cobranca.descricao || '—'}</td>
        <td className="dash-cob-acoes">
          {obrigacao && (
            <>
              <button type="button" className="dash-btn-table" onClick={() => setRegistrarOpen(true)}>
                Registrar pagamento
              </button>
              <button type="button" className="dash-btn-table" onClick={() => setHistoricoOpen(true)}>
                Ver histórico
              </button>
            </>
          )}
          <button type="button" className="dash-btn-table" onClick={() => onEdit(cobranca)}>
            Editar
          </button>
          <button type="button" className="dash-btn-table dash-btn-table--danger" onClick={() => onDelete(cobranca)}>
            Excluir
          </button>
        </td>
      </tr>

      <RegistrarPagamentoModal
        open={registrarOpen}
        cobranca={cobranca}
        onClose={() => setRegistrarOpen(false)}
        onSaved={onRefresh}
      />
      <HistoricoPagamentosModal
        open={historicoOpen}
        cobranca={cobranca}
        onClose={() => setHistoricoOpen(false)}
      />
    </>
  );
}

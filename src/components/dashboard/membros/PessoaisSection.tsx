type Props = {
  nome: string;
  dataNascimento: string;
  contato: string;
  email: string;
  signo: string;
  obs: string;
  onChange: (field: 'nome' | 'dataNascimento' | 'contato' | 'email' | 'signo' | 'obs', value: string) => void;
};

export function PessoaisSection({ nome, dataNascimento, contato, email, signo, obs, onChange }: Props) {
  return (
    <section className="dash-form-section">
      <h2 className="dash-form-section__title">Dados pessoais</h2>
      <div className="dash-form-grid">
        <label className="dash-field">
          <span>Nome *</span>
          <input
            type="text"
            value={nome}
            onChange={(e) => onChange('nome', e.target.value)}
            required
            autoComplete="name"
          />
        </label>
        <label className="dash-field">
          <span>Data de nascimento</span>
          <input type="date" value={dataNascimento} onChange={(e) => onChange('dataNascimento', e.target.value)} />
        </label>
        <label className="dash-field">
          <span>Contato / Telefone</span>
          <input type="text" value={contato} onChange={(e) => onChange('contato', e.target.value)} autoComplete="tel" />
        </label>
        <label className="dash-field">
          <span>Email</span>
          <input type="email" value={email} onChange={(e) => onChange('email', e.target.value)} autoComplete="email" />
        </label>
        <label className="dash-field">
          <span>Signo</span>
          <input type="text" value={signo} onChange={(e) => onChange('signo', e.target.value)} />
        </label>
        <label className="dash-field dash-field--full">
          <span>Observações</span>
          <textarea value={obs} onChange={(e) => onChange('obs', e.target.value)} rows={3} />
        </label>
      </div>
    </section>
  );
}

import './ScrollTop.css';

const ScrollTop = ({ visible = false, onClick }) => {
  if (!visible) return null;

  return (
    <button type="button" className="scroll_top_button" onClick={onClick} aria-label="Voltar ao topo">
      ↑
    </button>
  );
};

export default ScrollTop;

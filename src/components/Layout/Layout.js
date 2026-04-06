import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Whatsapp from '../Whatsapp/Whatsapp';
import ScrollTop from '../ScrollTop/ScrollTop';

const Layout = ({ children, showScrollTop = false, onScrollTop }) => (
  <div>
    <Header />
    <main>{children}</main>
    <ScrollTop visible={showScrollTop} onClick={onScrollTop} />
    <Whatsapp showScrollTop={showScrollTop} />
    <Footer />
  </div>
);
export default Layout;

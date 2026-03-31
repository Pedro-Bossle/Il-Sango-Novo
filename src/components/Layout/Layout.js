import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const Layout = ({ children }) => (
  <div>
    <Header />
    <main>{children}</main>
    <Footer />
  </div>
);
export default Layout;

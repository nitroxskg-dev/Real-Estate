import Navigation from './Navigation';
import Footer from './Footer';
import { SmoothScrollProvider } from '../../contexts/SmoothScrollContext';

const Layout = ({ children }) => {
  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-midnight">
        <Navigation />
        <main>{children}</main>
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
};

export default Layout;

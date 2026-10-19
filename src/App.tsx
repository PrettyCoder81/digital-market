import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductList from './components/ProductList';
import CreateProduct from './components/CreateProduct';
import ProductDetail from './components/ProductDetail';
import AdminPanel from './components/AdminPanel';
import CodeDocs from './components/CodeDocs';
import Footer from './components/Footer';
import StatsSection from './components/StatsSection';
import HowItWorks from './components/HowItWorks';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6c5ce7',
      light: '#a29bfe',
      dark: '#4a3db5',
    },
    secondary: {
      main: '#00cec9',
      light: '#55efc4',
      dark: '#009688',
    },
    background: {
      default: '#0a0a1a',
      paper: '#12122a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b8b8d4',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Space Grotesk', sans-serif",
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '12px',
          fontWeight: 600,
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          backgroundImage: 'none',
        },
      },
    },
  },
});

type Page = 'home' | 'marketplace' | 'create' | 'product' | 'admin' | 'docs';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const navigateTo = (page: Page, productId?: number) => {
    setCurrentPage(page);
    if (productId !== undefined) {
      setSelectedProductId(productId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProduct = (id: number) => {
    navigateTo('product', id);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <HeroSection onNavigate={navigateTo} />
            <StatsSection />
            <HowItWorks />
            <ProductList onViewProduct={handleViewProduct} featured />
          </>
        );
      case 'marketplace':
        return <ProductList onViewProduct={handleViewProduct} />;
      case 'create':
        return <CreateProduct onCreated={() => navigateTo('marketplace')} />;
      case 'product':
        return (
          <ProductDetail
            productId={selectedProductId || 1}
            onBack={() => navigateTo('marketplace')}
          />
        );
      case 'admin':
        return <AdminPanel />;
      case 'docs':
        return <CodeDocs />;
      default:
        return <HeroSection onNavigate={navigateTo} />;
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="min-h-screen grid-bg" style={{ background: '#0a0a1a' }}>
        <Navbar currentPage={currentPage} onNavigate={navigateTo} />
        <main>{renderPage()}</main>
        {currentPage === 'home' && <Footer />}
      </div>
    </ThemeProvider>
  );
}

export default App;

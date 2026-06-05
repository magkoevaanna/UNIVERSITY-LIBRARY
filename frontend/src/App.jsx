import React, { useState, useEffect } from 'react';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Sidebar from './Components/Sidebar';
import Home from './pages/Home';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Catalog from './pages/Catalog';
import Profile from './pages/Profile';
import ReportsPage from './pages/ReportsPage'

function App() {
  const [isDark, setIsDark] = useState(true);
  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <div className="App">
      <BrowserRouter>
        <Header isDark={isDark} toggleTheme={toggleTheme} />
        <Sidebar isDark={isDark} toggleTheme={toggleTheme} />  
        
        <main style={{ minHeight: '80vh' }}>
          <Routes>
            <Route path="/" element={<Home isDark={isDark} />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/profile" element={<Profile isDark={isDark} />} />
            <Route path="/reports" element={<ReportsPage isDark={isDark} />} />
          </Routes>
        </main>
        
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;

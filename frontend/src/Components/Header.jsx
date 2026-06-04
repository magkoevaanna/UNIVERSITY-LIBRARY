import React from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../Components/BookCard';

const Header = ({ isDark, toggleTheme }) => {
  return (
    <nav className="navbar navbar-dark sticky-top shadow">
      <div className="container">
        <button className="navbar-toggler border-white shadow-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebar">
          <span className="navbar-toggler-icon" style={{filter: 'invert(1)'}}></span>
        </button>
        
        <a className="navbar-brand ms-2 fw-bold" href="/">UNIVERSITY LIBRARY</a>

        <div className="d-none d-lg-flex gap-4 ms-auto me-4 text-white small">
          <Link to="/" style={{cursor: 'pointer'}}>Главная</Link>
          <Link to="/catalog" style={{cursor: 'pointer'}}>Каталог</Link>
          <span style={{cursor: 'pointer'}}>Бронь</span>
        </div>
        

        <button className="btn btn-warning btn-sm fw-bold shadow-none" onClick={toggleTheme}>
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
};

export default Header;

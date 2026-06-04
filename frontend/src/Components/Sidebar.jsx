import React from 'react';
import Profile from '../pages/Profile'
import { Link } from 'react-router-dom';


const Sidebar = ({ isDark}) => {
  return (
    <div className="offcanvas offcanvas-start" tabIndex="-1" id="sidebar" data-bs-backdrop="false">
          <div className="offcanvas-header border-bottom">
            <h5 className="offcanvas-title fw-bold">Библиотечная система</h5>
            <button type="button" className="btn-close shadow-none" data-bs-dismiss="offcanvas" style={{filter: isDark ? 'invert(1)' : 'none'}}></button>
          </div>
          <div className="offcanvas-body p-0">
            <ul className="list-group list-group-flush">
              <Link to="/profile" className="text-decoration-none " style={{color: 'inherit'}} >👤 Личный кабинет</Link>
              <li className="list-group-item bg-transparent py-3">
                <a href="#" className="text-decoration-none" style={{color: 'inherit'}}>📚 Мои книги (Запрос 10)</a>
              </li>
              <li className="list-group-item bg-transparent py-3">
                <a href="#" className="text-decoration-none" style={{color: 'inherit'}}>📊 Статистика фонда (Запрос 3)</a>
              </li>
              <li className="list-group-item bg-transparent py-3">
                <a href="#" className="text-decoration-none fw-bold" style={{color: 'var(--purple-main)'}}>🛠️ Админ-панель</a>
              </li>
            </ul>
          </div>
        </div>
  );
};

export default Sidebar;

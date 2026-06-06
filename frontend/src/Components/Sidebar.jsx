import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isDark }) => {
  return (
    <div className="offcanvas offcanvas-start" tabIndex="-1" id="sidebar" data-bs-backdrop="false">
      <div className="offcanvas-header border-bottom">
        <h5 className="offcanvas-title fw-bold">Библиотечная система</h5>
        <button type="button" className="btn-close shadow-none" data-bs-dismiss="offcanvas" style={{filter: isDark ? 'invert(1)' : 'none'}}></button>
      </div>
      <div className="offcanvas-body p-0">
        <ul className="list-group list-group-flush">
          {/* Личный кабинет уже был настроен правильно */}
          <li className="list-group-item bg-transparent py-3">
            <Link to="/profile" className="text-decoration-none" style={{color: 'inherit'}}>👤 Личный кабинет</Link>
          </li>
          
          <li className="list-group-item bg-transparent py-3">
            <Link to="/my-books" className="text-decoration-none" style={{color: 'inherit'}}>📚 Мои книги (Запрос 10)</Link>
          </li>
          
          <li className="list-group-item bg-transparent py-3">
            <Link to="/stats" className="text-decoration-none" style={{color: 'inherit'}}>📊 Статистика фонда (Запрос 3)</Link>
          </li>
          
          {/* ИСПРАВЛЕНО: Теперь переходит на /reports через Link без перезагрузки страницы */}
          <li className="list-group-item bg-transparent py-3">
            <Link to="/reports" className="text-decoration-none fw-bold" style={{color: 'var(--purple-main)'}}>🛠️ Админ-панель</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

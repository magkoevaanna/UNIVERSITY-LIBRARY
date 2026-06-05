import React, { useState, useEffect } from 'react';

export default function Query11Accordion({ isOpen, onToggle }) {
  // Состояние для списка доступных книг из Swagger
  const [availabilityData, setAvailabilityData] = useState([]);
  
  // Состояние для поля ввода названия книги (по умолчанию пустое)
  const [searchTitle, setSearchTitle] = useState('');

  // Функция для загрузки данных с бэкенда
  const fetchAvailability = () => {
    if (!searchTitle.trim()) return;

    fetch(`http://localhost:5000/api/ReportsBook/availability?title=${encodeURIComponent(searchTitle.trim())}`)
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка при загрузке данных');
        return res.json();
      })
      .then((data) => setAvailabilityData(data || []))
      .catch((err) => console.error("Ошибка Запроса 11:", err));
  };

  // Перезапрашиваем данные при открытии аккордеона или изменении названия книги
  useEffect(() => {
    if (isOpen) {
      fetchAvailability();
    }
  }, [isOpen, searchTitle]);

  // Вычисляем общее число доступных экземпляров по всем абонементам на лету
  const totalAvailable = availabilityData.reduce((sum, item) => sum + (item.availableCount || 0), 0);

  return (
    <div className="card mb-3 overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--purple-main)' }}>
      
      {/* Шапка 11-го аккордеона */}
      <button
        className="btn text-white w-100 p-3 text-start d-flex justify-content-between align-items-start rounded-0"
        style={{ backgroundColor: 'var(--purple-main)', border: 'none' }}
        onClick={onToggle}
      >
        <div className="d-flex align-items-start gap-3">
          <span className="badge bg-light text-dark fw-bold mt-1">Запрос 11</span>
          <p className="mb-0 fs-6 text-wrap" style={{ lineHeight: '1.4' }}>
            Определить, есть ли данная книга в наличии на абонементах, и в каком количестве.
          </p>
        </div>
        <span className="ms-2 fs-5">{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Раскрывающийся контент аккордеона */}
      {isOpen && (
        <div className="p-3 border-top" style={{ borderColor: 'var(--purple-main) !important' }}>
          
          {/* Информационная сводка */}
          <div className="mb-3 fs-5">
            🔍 Результаты поиска: Всего найдено экземпляров:{' '}
            <strong style={{ color: totalAvailable > 0 ? 'var(--purple-main)' : '#dc3545' }}>
              {totalAvailable} шт.
            </strong>
          </div>

          {/* Внутренняя панель фильтрации по названию книги */}
          <div className="card mb-4 p-3 border-secondary" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-8">
                <label className="form-label small fw-bold text-muted">Введите название книги:</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Властелин колец, Война и мир..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Таблица наличия (соответствует схеме вашего Swagger JSON-response) */}
          {availabilityData.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover table-striped align-middle m-0" style={{ color: 'var(--text-color)' }}>
                <thead>
                  <tr className="table-dark">
                    <th style={{ backgroundColor: 'var(--purple-main)', color: 'white' }}>Издание книги</th>
                    <th>Пункт выдачи / Абонемент</th>
                    <th className="text-center" style={{ width: '180px' }}>Доступно (шт.)</th>
                    <th className="text-center" style={{ width: '120px' }}>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {availabilityData.map((item, index) => {
                    const count = item.availableCount || 0;
                    return (
                      <tr key={index}>
                        <td className="fw-bold text-wrap">{item.title}</td>
                        <td>
                          <span style={{ color: 'var(--purple-main)', fontWeight: '500' }}>
                            🏛️ {item.subscriptionName}
                          </span>
                        </td>
                        <td className="text-center fw-bold fs-5" style={{ color: count > 0 ? 'var(--purple-main)' : '#dc3545' }}>
                          {count}
                        </td>
                        <td className="text-center">
                          {count > 0 ? (
                            <span className="badge bg-success">В наличии</span>
                          ) : (
                            <span className="badge bg-danger">Нет копий</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-muted py-4 border rounded border-dashed" style={{ borderStyle: 'dashed' }}>
              {searchTitle.trim() 
                ? `Книги «${searchTitle}» на абонементах в данный момент нет в наличии.`
                : 'Введите название книги в поле выше для отображения остатков фонда.'}
            </div>
          )}

        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';

export default function Query9Accordion({ isOpen, onToggle }) {
  const [query9Data, setQuery9Data] = useState([]);
  const [pointId, setPointId] = useState('1'); // По умолчанию 1

  const fetchQuery9Data = () => {
    // Если поле пустое, передаем 0, чтобы сбросить фильтр до "всей библиотеки"
    const filterPoint = pointId || '0';
    fetch(`http://localhost:5000/api/ReportsBook/counts?pointId=${filterPoint}`)
      .then((res) => res.json())
      .then((data) => setQuery9Data(data || []))
      .catch((err) => console.error("Ошибка загрузки Запроса 9:", err));
  };

  useEffect(() => {
    if (isOpen) {
      fetchQuery9Data();
    }
  }, [isOpen, pointId]);

  return (
    <div className="card mb-3 overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--purple-main)' }}>
      <button
        className="btn text-white w-100 p-3 text-start d-flex justify-content-between align-items-start rounded-0"
        style={{ backgroundColor: 'var(--purple-main)', border: 'none' }}
        onClick={onToggle}
      >
        <div className="d-flex align-items-start gap-3">
          <span className="badge bg-light text-dark fw-bold mt-1">Запрос 9</span>
          <p className="mb-0 fs-6 text-wrap" style={{ lineHeight: '1.4' }}>
            Получить количество экземпляров книги для данного читального зала или абонента, во всей библиотеке, всех изданий.
          </p>
        </div>
        <span className="ms-2 fs-5">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="p-3 border-top" style={{ borderColor: 'var(--purple-main) !important' }}>
          
          {/* Фильтр по ID зала */}
          <div className="card mb-4 p-3 border-secondary" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <div className="row g-3 align-items-center">
              <div className="col-auto">
                <label className="form-label mb-0 fw-bold small text-muted">ID читального зала / абонента:</label>
              </div>
              <div className="col-md-2 col-6">
                <input
                  type="number"
                  className="form-control bg-dark text-light border-secondary text-center"
                  placeholder="Все (0)"
                  value={pointId}
                  onChange={(e) => setPointId(e.target.value)}
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Таблица книг */}
          {query9Data.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover table-striped align-middle m-0" style={{ color: 'var(--text-color)' }}>
                <thead>
                  <tr className="table-dark">
                    <th style={{ backgroundColor: 'var(--purple-main)', color: 'white' }}>Название книги</th>
                    <th>Автор</th>
                    <th>Пункт размещения фонда</th>
                    <th className="text-center" style={{ width: '180px' }}>Доступно копий (шт.)</th>
                  </tr>
                </thead>
                <tbody>
                  {query9Data.map((item, index) => (
                    <tr key={index}>
                      <td className="fw-bold text-wrap">{item.title}</td>
                      <td>{item.author}</td>
                      <td><span className="text-muted">🏛️ {item.distributionPoint}</span></td>
                      <td className="text-center fw-bold fs-5" style={{ color: 'var(--purple-main)' }}>
                        {item.copiesCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-muted py-3">Книг в выбранном пункте выдачи не найдено.</div>
          )}

        </div>
      )}
    </div>
  );
}

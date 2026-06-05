import React, { useState, useEffect } from 'react';

export default function Query7Accordion({ isOpen, onToggle }) {
  const [query7Data, setQuery7Data] = useState([]);
  const [pointId, setPointId] = useState('1');

  // Локальные фильтры для быстрого поиска книги в таблице
  const [searchFilters, setSearchFilters] = useState({
    title: '',
    author: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchQuery7Data = () => {
    const filterPointId = pointId || '0';

    fetch(`http://localhost:5000/api/ReportsBook/counts?pointId=${filterPointId}`)
      .then((res) => res.json())
      .then((data) => setQuery7Data(data || []))
      .catch((err) => console.error("Ошибка загрузки количества книг:", err));
  };

  useEffect(() => {
    if (isOpen) {
      fetchQuery7Data();
    }
  }, [isOpen, pointId]);

  // Фильтруем данные по названию или автору на клиенте
  const filteredData = query7Data.filter((item) => {
    return (
      (searchFilters.title === '' || (item.title && item.title.toLowerCase().includes(searchFilters.title.toLowerCase()))) &&
      (searchFilters.author === '' || (item.author && item.author.toLowerCase().includes(searchFilters.author.toLowerCase())))
    );
  });

  // Вычисляем суммарное количество экземпляров на основе отфильтрованных книг
  const totalCopies = filteredData.reduce((sum, item) => sum + (item.copiesCount || 0), 0);

  return (
    <div className="card mb-3 overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--purple-main)' }}>
      
      {/* Шапка аккордеона */}
      <button
        className="btn text-white w-100 p-3 text-start d-flex justify-content-between align-items-start rounded-0"
        style={{ backgroundColor: 'var(--purple-main)', border: 'none' }}
        onClick={onToggle}
      >
        <div className="d-flex align-items-start gap-3">
          <span className="badge bg-light text-dark fw-bold mt-1">Запрос 7</span>
          <p className="mb-0 fs-6 text-wrap" style={{ lineHeight: '1.4' }}>
            Получить количество экземпляров книги для данного читального зала или абонента, во всей библиотеке, всех изданий.
          </p>
        </div>
        <span className="ms-2 fs-5">{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Раскрывающийся контент */}
      {isOpen && (
        <div className="p-3 border-top" style={{ borderColor: 'var(--purple-main) !important' }}>
          
          {/* Аналитическая сводка */}
          <div className="mb-3 fs-5">
            📚 Доступный фонд экземпляров: <strong style={{ color: 'var(--purple-main)' }}>{totalCopies} шт.</strong>
            {pointId && pointId !== '0' ? ` (в пункте выдачи №${pointId})` : ' (по всей библиотеке)'}
          </div>

          {/* Панель фильтрации с инпутами внутри аккордеона */}
          <div className="card mb-4 p-3 border-secondary" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <h5 className="mb-3 fs-6 text-uppercase fw-bold text-muted">Параметры выборки и поиск книг</h5>
            <div className="row g-3 align-items-end">
              
              {/* ID пункта */}
              <div className="col-12 col-md-3">
                <label htmlFor="q7PointIdInput" className="form-label small fw-bold text-muted">ID зала / абонента:</label>
                <div className="d-flex gap-2">
                  <input
                    id="q7PointIdInput"
                    type="number"
                    className="form-control text-center bg-dark text-light border-secondary"
                    placeholder="Все (0)"
                    value={pointId}
                    onChange={(e) => setPointId(e.target.value)}
                    min="0"
                  />
                  <button className="btn text-white" style={{ backgroundColor: 'var(--purple-main)' }} onClick={fetchQuery7Data}>
                    🔄
                  </button>
                </div>
              </div>

              {/* Поиск по названию книги */}
              <div className="col-6 col-md-4">
                <label className="form-label small fw-bold text-muted">Название книги:</label>
                <input
                  type="text"
                  name="title"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Поиск по названию..."
                  value={searchFilters.title}
                  onChange={handleFilterChange}
                />
              </div>

              {/* Поиск по автору */}
              <div className="col-6 col-md-3">
                <label className="form-label small fw-bold text-muted">Автор:</label>
                <input
                  type="text"
                  name="author"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Поиск по автору..."
                  value={searchFilters.author}
                  onChange={handleFilterChange}
                />
              </div>

              {/* Сброс локального поиска */}
              <div className="col-12 col-md-2">
                <button 
                  className="btn btn-outline-secondary w-100"
                  onClick={() => setSearchFilters({ title: '', author: '' })}
                >
                  Сбросить поиск
                </button>
              </div>

            </div>
          </div>

          {/* Таблица наличия книг */}
          {filteredData.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover table-striped align-middle m-0" style={{ color: 'var(--text-color)' }}>
                <thead>
                  <tr className="table-dark">
                    <th style={{ backgroundColor: 'var(--purple-main)', color: 'white' }}>Название издания</th>
                    <th>Автор произведения</th>
                    <th>Текущее местонахождение</th>
                    <th className="text-center" style={{ width: '200px' }}>Количество книг (в наличии)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={index}>
                      <td className="fw-bold text-wrap">{item.title}</td>
                      <td>{item.author}</td>
                      <td>
                        <span className="badge bg-opacity-10 bg-secondary text-light border border-secondary px-2">
                          🏛️ {item.distributionPoint || `Пункт №${pointId}`}
                        </span>
                      </td>
                      <td className="text-center fw-bold fs-5" style={{ color: 'var(--purple-main)' }}>
                        {item.copiesCount || 0} шт.
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-muted py-4 border rounded border-dashed" style={{ borderStyle: 'dashed' }}>
              Книги, соответствующие заданным критериям поиска, не найдены.
            </div>
          )}

        </div>
      )}
    </div>
  );
}

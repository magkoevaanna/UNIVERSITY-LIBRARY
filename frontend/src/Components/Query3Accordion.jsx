import React, { useState, useEffect } from 'react';

export default function Query3Accordion({ isOpen, onToggle }) {
  const [query3Data, setQuery3Data] = useState([]);
  
  // Локальные фильтры для выполнения условий "в данном зале" и "для данного факультета"
  const [filters, setFilters] = useState({
    pointId: '',
    faculty: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchQuery3Data = () => {
    fetch('http://localhost:5000/api/ReportsBook/top20_3')
      .then((res) => res.json())
      .then((data) => setQuery3Data(data))
      .catch((err) => console.error("Ошибка загрузки топ-20 книг:", err));
  };

  // Подгружаем данные один раз при открытии аккордеона
  useEffect(() => {
    if (isOpen && query3Data.length === 0) {
      fetchQuery3Data();
    }
  }, [isOpen]);

  // Фильтруем данные, если бэкенд присылает расширенные свойства,
  // либо подготавливаемся к фильтрации на клиенте.
  const filteredData = query3Data.filter((item) => {
    return (
      (filters.pointId === '' || (item.pointId && String(item.pointId) === filters.pointId)) &&
      (filters.faculty === '' || (item.faculty && item.faculty.toLowerCase().includes(filters.faculty.toLowerCase())))
    );
  });

  return (
    <div className="card mb-3 overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--purple-main)' }}>
      <button
        className="btn text-white w-100 p-3 text-start d-flex justify-content-between align-items-start rounded-0"
        style={{ backgroundColor: 'var(--purple-main)', border: 'none' }}
        onClick={onToggle}
      >
        <div className="d-flex align-items-start gap-3">
          <span className="badge bg-light text-dark fw-bold mt-1">Запрос 3</span>
          <p className="mb-0 fs-6 text-wrap" style={{ lineHeight: '1.4' }}>
            Получить перечень двадцати наиболее часто заказываемых книг в данном читальном зале для данного факультета, для всего вуза.
          </p>
        </div>
        <span className="ms-2 fs-5">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="p-3 border-top" style={{ borderColor: 'var(--purple-main) !important' }}>
          
          <div className="mb-3 fs-5">
            🔥 Топ-20 самых востребованных книг:
          </div>

 

          {/* Таблица */}
          {filteredData.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover table-striped align-middle m-0" style={{ color: 'var(--text-color)' }}>
                <thead>
                  <tr className="table-dark">
                    <th style={{ backgroundColor: 'var(--purple-main)', color: 'white', width: '70px' }} className="text-center">Ранг</th>
                    <th>Название книги</th>
                    <th>Автор</th>
                    <th className="text-center" style={{ width: '150px' }}>Заказов (шт.)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => {
                    const rank = index + 1;
                    let rankBadgeClass = "bg-secondary text-white";
                    let rankStyle = {};
                    
                    if (rank === 1) {
                      rankBadgeClass = "bg-warning text-dark"; 
                      rankStyle = { fontWeight: 'bold' };
                    } else if (rank === 2) {
                      rankBadgeClass = "bg-light text-dark"; 
                    } else if (rank === 3) {
                      rankBadgeClass = "bg-danger text-white"; 
                    }

                    return (
                      <tr key={index} style={rank <= 3 ? rankStyle : {}}>
                        <td className="text-center">
                          <span className={`badge rounded-circle p-2 px-3 ${rankBadgeClass}`} style={{ fontSize: rank <= 3 ? '14px' : '12px' }}>
                            {rank}
                          </span>
                        </td>
                        <td className={rank === 1 ? "fw-bold text-wrap" : "text-wrap"}>
                          {item.title}
                        </td>
                        <td>{item.author}</td>
                        <td className="text-center fw-bold" style={{ color: 'var(--purple-main)', fontSize: '16px' }}>
                          {item.orderCount}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-muted py-3">
              Нет данных, соответствующих выбранным критериям.
            </div>
          )}

        </div>
      )}
    </div>
  );
}

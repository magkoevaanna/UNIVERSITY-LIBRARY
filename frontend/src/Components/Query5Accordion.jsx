import React, { useState, useEffect, useMemo } from 'react';

export default function Query5Accordion({ isOpen, onToggle }) {
  const [query5Data, setQuery5Data] = useState([]);

  const fetchQuery5Data = () => {
    // Точный URL из вашего Swagger-скриншота
    fetch('http://localhost:5000/api/ReaderLogs/points-analytics')
      .then((res) => res.json())
      .then((data) => setQuery5Data(data || []))
      .catch((err) => console.error("Ошибка загрузки статистики пунктов:", err));
  };

  // Подгружаем данные при открытии аккордеона
  useEffect(() => {
    if (isOpen && query5Data.length === 0) {
      fetchQuery5Data();
    }
  }, [isOpen]);

  // Точное вычисление лидеров/антилидеров (согласовано с C# DTO)
  const analytics = useMemo(() => {
    if (!query5Data || query5Data.length === 0) return null;

    // Внимание: используем точные C# имена полей с буквами "s" (activeReadersCount / overdueReadersCount)
    const sortedByReaders = [...query5Data].sort((a, b) => (b.activeReadersCount || 0) - (a.activeReadersCount || 0));
    const sortedByDebtors = [...query5Data].sort((a, b) => (b.overdueReadersCount || 0) - (a.overdueReadersCount || 0));
    const sortedByFines = [...query5Data].sort((a, b) => (b.totalUnpaidFines || 0) - (a.totalUnpaidFines || 0));

    return {
      mostReaders: sortedByReaders[0],
      leastReaders: sortedByReaders[sortedByReaders.length - 1],
      mostDebtors: sortedByDebtors[0],
      leastDebtors: sortedByDebtors[sortedByDebtors.length - 1],
      highestFine: sortedByFines[0]
    };
  }, [query5Data]);

  return (
    <div className="card mb-3 overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--purple-main)' }}>
      
      {/* Шапка аккордеона */}
      <button
        className="btn text-white w-100 p-3 text-start d-flex justify-content-between align-items-start rounded-0"
        style={{ backgroundColor: 'var(--purple-main)', border: 'none' }}
        onClick={onToggle}
      >
        <div className="d-flex align-items-start gap-3">
          <span className="badge bg-light text-dark fw-bold mt-1">Запрос 5</span>
          <p className="mb-0 fs-6 text-wrap" style={{ lineHeight: '1.4' }}>
            Определить пункт выдачи, на котором самое большое (маленькое) число читателей, читателей-задолжников, самая большая сумма задолженности.
          </p>
        </div>
        <span className="ms-2 fs-5">{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Раскрывающийся контент */}
      {isOpen && (
        <div className="p-3 border-top" style={{ borderColor: 'var(--purple-main) !important' }}>
          
          {query5Data.length > 0 && analytics ? (
            <>
              {/* --- КАРТОЧКИ-ИНДИКАТОРЫ --- */}
              <div className="row g-3 mb-4">
                
                {/* Карточка 1: Посещаемость */}
                <div className="col-md-4">
                  <div className="p-3 border rounded h-100" style={{ backgroundColor: 'rgba(111, 66, 193, 0.05)', borderColor: 'var(--purple-main)' }}>
                    <div className="small text-muted fw-bold text-uppercase">👥 Число читателей</div>
                    <hr className="my-2 border-secondary" />
                    <div className="small text-wrap">
                      Самое большое: <br />
                      <strong style={{ color: 'var(--purple-main)' }}>{analytics.mostReaders?.pointName}</strong> 
                      <span className="text-muted"> ({analytics.mostReaders?.activeReadersCount} чел.)</span>
                    </div>
                    <div className="small mt-2 text-wrap">
                      Самое маленькое: <br />
                      <strong className="text-muted">{analytics.leastReaders?.pointName}</strong> 
                      <span> ({analytics.leastReaders?.activeReadersCount} чел.)</span>
                    </div>
                  </div>
                </div>

                {/* Карточка 2: Задолжники */}
                <div className="col-md-4">
                  <div className="p-3 border rounded h-100" style={{ backgroundColor: 'rgba(220, 53, 69, 0.05)', borderColor: '#dc3545' }}>
                    <div className="small text-danger fw-bold text-uppercase">⚠️ Читатели-должники</div>
                    <hr className="my-2 border-secondary" />
                    <div className="small text-wrap">
                      Самое большое: <br />
                      <strong className="text-danger">{analytics.mostDebtors?.pointName}</strong> 
                      <span className="text-muted"> ({analytics.mostDebtors?.overdueReadersCount} чел.)</span>
                    </div>
                    <div className="small mt-2 text-wrap">
                      Самое маленькое: <br />
                      <strong className="text-success">{analytics.leastDebtors?.pointName}</strong> 
                      <span> ({analytics.leastDebtors?.overdueReadersCount} чел.)</span>
                    </div>
                  </div>
                </div>

                {/* Карточка 3: Финансовый долг */}
                <div className="col-md-4">
                  <div className="p-3 border rounded h-100" style={{ backgroundColor: 'rgba(255, 193, 7, 0.05)', borderColor: '#ffc107' }}>
                    <div className="small text-warning fw-bold text-uppercase">💰 Макс. сумма долга</div>
                    <hr className="my-2 border-secondary" />
                    <div className="small text-wrap mb-1">
                      Пункт с наибольшим долгом: <br />
                      <strong className="text-warning">{analytics.highestFine?.pointName}</strong>
                    </div>
                    <div className="fs-4 fw-bold text-warning">
                      {analytics.highestFine?.totalUnpaidFines} 
                    </div>
                  </div>
                </div>

              </div>

              {/* --- СВОДНАЯ СРАВНИТЕЛЬНАЯ ТАБЛИЦА --- */}
              <div className="table-responsive">
                <table className="table table-hover table-striped align-middle m-0" style={{ color: 'var(--text-color)' }}>
                  <thead>
                    <tr className="table-dark">
                      <th style={{ backgroundColor: 'var(--purple-main)', color: 'white' }}>Наименование пункта выдачи</th>
                      <th className="text-center">Всего читателей</th>
                      <th className="text-center">Читателей-должников</th>
                      <th className="text-end">Сумма штрафов (неоплаченных)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {query5Data.map((item, index) => (
                      <tr key={index}>
                        <td className="fw-bold">{item.pointName}</td>
                        <td className="text-center fw-bold" style={{ color: 'var(--purple-main)' }}>
                          {item.activeReadersCount}
                        </td>
                        <td className="text-center">
                          <span className={`badge ${item.overdueReadersCount > 0 ? 'bg-danger' : 'bg-secondary'}`}>
                            {item.overdueReadersCount} чел.
                          </span>
                        </td>
                        <td className={`text-end fw-bold ${item.totalUnpaidFines > 0 ? 'text-warning' : 'text-muted'}`}>
                          {item.totalUnpaidFines} 
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-center text-muted py-3">Аналитические данные пунктов выдачи отсутствуют.</div>
          )}

        </div>
      )}
    </div>
  );
}

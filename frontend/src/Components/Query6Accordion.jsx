import React, { useState, useEffect } from 'react';

export default function Query6Accordion({ isOpen, onToggle }) {
  const [query6Data, setQuery6Data] = useState([]);
  
  // Состояние для выбранного периода (по умолчанию 1 месяц)
  // Месяц = 1, Семестр = 6, Год = 12
  const [selectedPeriod, setSelectedPeriod] = useState(1);

  const fetchQuery6Data = (months) => {
    fetch(`http://localhost:5000/api/ReaderLogs/interlibrary-loans?months=${months}`)
      .then((res) => res.json())
      .then((data) => setQuery6Data(data || []))
      .catch((err) => console.error("Ошибка загрузки данных МБА:", err));
  };

  // Подгружаем данные при открытии аккордеона или смене периода
  useEffect(() => {
    if (isOpen) {
      fetchQuery6Data(selectedPeriod);
    }
  }, [isOpen, selectedPeriod]);

  // Функция для красивого перевода статусов МБА
  const getStatusBadge = (status) => {
    if (!status) return <span className="badge bg-secondary">—</span>;
    
    switch (status.toLowerCase()) {
      case 'received':
      case 'получено':
        return <span className="badge bg-success">📥 Получено</span>;
      case 'pending':
      case 'в ожидании':
        return <span className="badge bg-warning text-dark">⏳ В ожидании</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div className="card mb-3 overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--purple-main)' }}>
      
      {/* Шапка аккордеона */}
      <button
        className="btn text-white w-100 p-3 text-start d-flex justify-content-between align-items-start rounded-0"
        style={{ backgroundColor: 'var(--purple-main)', border: 'none' }}
        onClick={onToggle}
      >
        <div className="d-flex align-items-start gap-3">
          <span className="badge bg-light text-dark fw-bold mt-1">Запрос 6</span>
          <p className="mb-0 fs-6 text-wrap" style={{ lineHeight: '1.4' }}>
            Получить перечень и общее число книг, заказанных на межбиблиотечном абонементе (МБА) за последний месяц, семестр, год.
          </p>
        </div>
        <span className="ms-2 fs-5">{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Раскрывающийся контент */}
      {isOpen && (
        <div className="p-3 border-top" style={{ borderColor: 'var(--purple-main) !important' }}>
          
          {/* Общее количество и кнопки переключения периодов в одной строке */}
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
            <div className="fs-5">
              📚 Всего заказано книг: <strong style={{ color: 'var(--purple-main)' }}>{query6Data.length} шт.</strong>
            </div>

            {/* Bootstrap переключатель периодов */}
            <div className="btn-group" role="group" aria-label="Период отчета">
              <button
                type="button"
                className={`btn btn-sm ${selectedPeriod === 1 ? 'text-white' : 'btn-outline-secondary'}`}
                style={selectedPeriod === 1 ? { backgroundColor: 'var(--purple-main)' } : {}}
                onClick={() => setSelectedPeriod(1)}
              >
                Последний месяц
              </button>
              <button
                type="button"
                className={`btn btn-sm ${selectedPeriod === 6 ? 'text-white' : 'btn-outline-secondary'}`}
                style={selectedPeriod === 6 ? { backgroundColor: 'var(--purple-main)' } : {}}
                onClick={() => setSelectedPeriod(6)}
              >
                За семестр
              </button>
              <button
                type="button"
                className={`btn btn-sm ${selectedPeriod === 12 ? 'text-white' : 'btn-outline-secondary'}`}
                style={selectedPeriod === 12 ? { backgroundColor: 'var(--purple-main)' } : {}}
                onClick={() => setSelectedPeriod(12)}
              >
                За год
              </button>
            </div>
          </div>

          {/* Таблица результатов МБА */}
          {query6Data.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover table-striped align-middle m-0" style={{ color: 'var(--text-color)' }}>
                <thead>
                  <tr className="table-dark">
                    <th style={{ backgroundColor: 'var(--purple-main)', color: 'white', width: '80px' }} className="text-center">ID лога</th>
                    <th>Название заказанной книги</th>
                    <th>Библиотека-отправитель</th>
                    <th className="text-center">Дата запроса</th>
                    <th className="text-center" style={{ width: '140px' }}>Статус заказа</th>
                  </tr>
                </thead>
                <tbody>
                  {query6Data.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center text-muted small">
                        #{item.loanId || item.id || index + 1}
                      </td>
                      <td className="fw-bold text-wrap">
                        {item.bookTitle || item.title || 'Без названия'}
                      </td>
                      <td>
                        <span style={{ color: 'var(--purple-main)', fontWeight: '500' }}>
                          🏢 {item.externalLibraryName || item.libraryName || 'Не указана'}
                        </span>
                      </td>
                      <td className="text-center text-muted">
                        {item.requestDate || item.date 
                          ? new Date(item.requestDate || item.date).toLocaleDateString('ru-RU') 
                          : '—'
                        }
                      </td>
                      <td className="text-center">
                        {getStatusBadge(item.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-muted py-4 border rounded" style={{ borderStyle: 'dashed', borderColor: 'var(--purple-main)' }}>
              За выбранный период (месяцев: {selectedPeriod}) заказов по межбиблиотечному абонементу не обнаружено.
            </div>
          )}

        </div>
      )}
    </div>
  );
}

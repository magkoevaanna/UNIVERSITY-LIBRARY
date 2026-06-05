import React, { useState, useEffect } from 'react';

export default function Query4Accordion({ isOpen, onToggle }) {
  // Устанавливаем изначальную структуру объекта, чтобы не было ошибок "undefined"
  const [query4Data, setQuery4Data] = useState({ arrivedBooks: [], lostBooks: [] });
  
  // Состояния для отправки параметров на бэкенд
  const [q4PointId, setQ4PointId] = useState('1');
  const [q4Author, setQ4Author] = useState('');
  const [q4ReleaseYear, setQ4ReleaseYear] = useState('');
  const [q4ArrivalYear, setQ4ArrivalYear] = useState('');

  const fetchQuery4Data = () => {
    // Формируем URL с query-параметрами динамически
    const params = new URLSearchParams();
    if (q4PointId) params.append('pointId', q4PointId);
    if (q4Author) params.append('author', q4Author);
    if (q4ReleaseYear) params.append('releaseYear', q4ReleaseYear);
    if (q4ArrivalYear) params.append('arrivalYear', q4ArrivalYear);

    fetch(`http://localhost:5000/api/ReportsBook/movement?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        // Гарантируем корректность структуры, даже если бэкенд пришлет null
        setQuery4Data({
          arrivedBooks: data.arrivedBooks || [],
          lostBooks: data.lostBooks || []
        });
      })
      .catch((err) => console.error("Ошибка загрузки движения книг:", err));
  };

  // Вызываем обновление автоматически при изменении ID зала, автора или годов
  useEffect(() => {
    if (isOpen) {
      fetchQuery4Data();
    }
  }, [isOpen, q4PointId, q4Author, q4ReleaseYear, q4ArrivalYear]);

  return (
    <div className="card mb-3 overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--purple-main)' }}>
      
      {/* Шапка аккордеона */}
      <button
        className="btn text-white w-100 p-3 text-start d-flex justify-content-between align-items-start rounded-0"
        style={{ backgroundColor: 'var(--purple-main)', border: 'none' }}
        onClick={onToggle}
      >
        <div className="d-flex align-items-start gap-3">
          <span className="badge bg-light text-dark fw-bold mt-1">Запрос 4</span>
          <p className="mb-0 fs-6 text-wrap" style={{ lineHeight: '1.4' }}>
            Получить перечень и общее число книг, поступивших и утерянных за последний год, для данного читального зала, абонента или по всей библиотеке, по указанному автору, году выпуска, году поступления.
          </p>
        </div>
        <span className="ms-2 fs-5">{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Раскрывающийся контент */}
      {isOpen && (
        <div className="p-3 border-top" style={{ borderColor: 'var(--purple-main) !important' }}>
          
          {/* Сводные карточки-счетчики */}
          <div className="row g-3 mb-4 text-center">
            <div className="col-6">
              <div className="p-2 border rounded text-success fw-bold" style={{ backgroundColor: 'rgba(40, 167, 69, 0.05)', borderColor: '#28a745' }}>
                🟢 Поступило книг: {query4Data.arrivedBooks.length} шт.
              </div>
            </div>
            <div className="col-6">
              <div className="p-2 border rounded text-danger fw-bold" style={{ backgroundColor: 'rgba(220, 53, 69, 0.05)', borderColor: '#dc3545' }}>
                🔴 Утеряно книг: {query4Data.lostBooks.length} шт.
              </div>
            </div>
          </div>

          {/* Внутренняя панель фильтрации полей */}
          <div className="card mb-4 p-3 border-secondary" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <div className="row g-3 align-items-end">
              <div className="col-6 col-md-2">
                <label className="form-label small fw-bold text-muted">ID Зала:</label>
                <input type="number" className="form-control bg-dark text-light border-secondary text-center" placeholder="Все (0)" value={q4PointId} onChange={(e) => setQ4PointId(e.target.value)} />
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label small fw-bold text-muted">Автор:</label>
                <input type="text" className="form-control bg-dark text-light border-secondary" placeholder="Введите автора..." value={q4Author} onChange={(e) => setQ4Author(e.target.value)} />
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label small fw-bold text-muted">Год издания:</label>
                <input type="number" className="form-control bg-dark text-light border-secondary text-center" placeholder="1869" value={q4ReleaseYear} onChange={(e) => setQ4ReleaseYear(e.target.value)} />
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label small fw-bold text-muted">Год поступления:</label>
                <input type="number" className="form-control bg-dark text-light border-secondary text-center" placeholder="2025" value={q4ArrivalYear} onChange={(e) => setQ4ArrivalYear(e.target.value)} />
              </div>
              <div className="col-12 col-md-1">
                <button className="btn text-white w-100 hover-shadow transition" style={{ backgroundColor: 'var(--purple-main)' }} onClick={fetchQuery4Data}>
                  🔄
                </button>
              </div>
            </div>
          </div>

          {/* --- ТАБЛИЦА 1: ПОСТУПИВШИЕ КНИГИ --- */}
          <h5 className="mb-3 text-success border-start border-success ps-2 border-3 fs-6 fw-bold text-uppercase">Поступившие книги</h5>
          {query4Data.arrivedBooks.length > 0 ? (
            <div className="table-responsive mb-4">
              <table className="table table-hover table-striped align-middle m-0" style={{ color: 'var(--text-color)' }}>
                <thead>
                  <tr className="table-dark">
                    <th style={{ backgroundColor: 'var(--purple-main)', color: 'white' }}>Название книги</th>
                    <th>Автор</th>
                    <th className="text-center">Дата поступления</th>
                    <th>Пункт выдачи</th>
                  </tr>
                </thead>
                <tbody>
                  {query4Data.arrivedBooks.map((book, index) => (
                    <tr key={index}>
                      <td className="fw-bold text-wrap">{book.title}</td>
                      <td>{book.author}</td>
                      <td className="text-center text-muted">
                        {book.arrivalDate ? new Date(book.arrivalDate).toLocaleDateString('ru-RU') : '—'}
                      </td>
                      <td><span className="badge bg-opacity-10 bg-success text-success border border-success px-2">{book.location || `Зал №${q4PointId}`}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-muted py-3 mb-4 border rounded" style={{ borderStyle: 'dashed', borderColor: 'var(--purple-main)' }}>
              Записей о поступивших книгах по этим фильтрам нет.
            </div>
          )}

          {/* --- ТАБЛИЦА 2: УТЕРЯННЫЕ КНИГИ --- */}
          <h5 className="mb-3 text-danger border-start border-danger ps-2 border-3 fs-6 fw-bold text-uppercase">Утерянные книги</h5>
          {query4Data.lostBooks.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover table-striped align-middle m-0" style={{ color: 'var(--text-color)' }}>
                <thead>
                  <tr className="table-dark">
                    <th style={{ backgroundColor: '#dc3545', color: 'white' }}>Название книги</th>
                    <th>Автор</th>
                    <th className="text-center">Дата утери</th>
                    <th className="text-end">Величина штрафа</th>
                  </tr>
                </thead>
                <tbody>
                  {query4Data.lostBooks.map((book, index) => (
                    <tr key={index}>
                      <td className="fw-bold text-wrap text-danger-subtle">{book.title}</td>
                      <td>{book.author}</td>
                      <td className="text-center text-muted">
                        {book.lostDate ? new Date(book.lostDate).toLocaleDateString('ru-RU') : '—'}
                      </td>
                      <td className="text-end fw-bold text-warning">{book.fineAmount ? `${book.fineAmount}` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-muted py-3 border rounded" style={{ borderStyle: 'dashed', borderColor: '#dc3545' }}>
              Записей об утерянных книгах по этим фильтрам нет.
            </div>
          )}

        </div>
      )}
    </div>
  );
}

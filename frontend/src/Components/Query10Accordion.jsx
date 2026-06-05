import React, { useState, useEffect } from 'react';

export default function Query10Accordion({ isOpen, onToggle }) {
  const [holdersData, setHoldersData] = useState([]);
  
  const [bookTitle, setBookTitle] = useState('Властелин');

  const fetchHoldersData = () => {
    if (!bookTitle.trim()) return;

    fetch(`http://localhost:5000/api/ReaderLogs/book-holders?bookTitle=${encodeURIComponent(bookTitle.trim())}`)
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка сервера');
        return res.json();
      })
      .then((data) => setHoldersData(data || []))
      .catch((err) => console.error("Ошибка Запроса 10:", err));
  };

  useEffect(() => {
    if (isOpen) {
      fetchHoldersData();
    }
  }, [isOpen, bookTitle]);

  return (
    <div className="card mb-3 overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--purple-main)' }}>
      
      {/* Шапка 10-го аккордеона */}
      <button
        className="btn text-white w-100 p-3 text-start d-flex justify-content-between align-items-start rounded-0"
        style={{ backgroundColor: 'var(--purple-main)', border: 'none' }}
        onClick={onToggle}
      >
        <div className="d-flex align-items-start gap-3">
          <span className="badge bg-light text-dark fw-bold mt-1">Запрос 10</span>
          <p className="mb-0 fs-6 text-wrap" style={{ lineHeight: '1.4' }}>
            Получить перечень и общее число читателей, у которых на руках находится указанная книга (поиск держателей по названию).
          </p>
        </div>
        <span className="ms-2 fs-5">{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Раскрывающийся контент аккордеона */}
      {isOpen && (
        <div className="p-3 border-top" style={{ borderColor: 'var(--purple-main) !important' }}>
          
          {/* Статистическая сводка */}
          <div className="mb-3 fs-5">
            📖 Найдено читателей, удерживающих книгу «{bookTitle}»: <strong style={{ color: 'var(--purple-main)' }}>{holdersData.length} чел.</strong>
          </div>

          {/* Внутренняя панель фильтрации по названию книги */}
          <div className="card mb-4 p-3 border-secondary" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-8">
                <label className="form-label small fw-bold text-muted">Введите название книги (или его часть):</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Название книги..."
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Таблица со списком держателей (в точности по вашему Swagger JSON) */}
          {holdersData.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover table-striped align-middle m-0" style={{ color: 'var(--text-color)' }}>
                <thead>
                  <tr className="table-dark">
                    <th style={{ backgroundColor: 'var(--purple-main)', color: 'white', width: '120px' }}>№ Билета</th>
                    <th>ФИО Читателя</th>
                    <th className="text-center">Дата выдачи книги</th>
                    <th className="text-center">Крайний срок возврата</th>
                    <th className="text-center" style={{ width: '130px' }}>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {holdersData.map((holder, index) => {
                    // Проверяем, просрочен ли дедлайн возврата относительно текущей системной даты
                    const isOverdue = new Date(holder.returnDeadline) < new Date();

                    return (
                      <tr key={index}>
                        <td className="fw-bold" style={{ color: 'var(--purple-main)' }}>
                          {holder.cardNumber}
                        </td>
                        <td>{holder.readerName}</td>
                        <td className="text-center text-muted">
                          {new Date(holder.borrowDate).toLocaleDateString('ru-RU')}
                        </td>
                        <td className={`text-center fw-bold ${isOverdue ? 'text-danger' : 'text-muted'}`}>
                          {new Date(holder.returnDeadline).toLocaleDateString('ru-RU')}
                        </td>
                        <td className="text-center">
                          {isOverdue ? (
                            <span className="badge bg-danger">🛑 Просрочено</span>
                          ) : (
                            <span className="badge bg-success">✅ На руках</span>
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
              Ни один читатель сейчас не удерживает книгу с названием «{bookTitle}».
            </div>
          )}

        </div>
      )}
    </div>
  );
}

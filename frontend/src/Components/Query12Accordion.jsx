import React, { useState, useEffect, useMemo } from 'react';

export default function Query12Accordion({ isOpen, onToggle }) {
  const [holdersData, setHoldersData] = useState([]);
  const [bookTitle, setBookTitle] = useState('Властелин');

  const fetchHolders = () => {
    if (!bookTitle.trim()) return;

    fetch(`http://localhost:5000/api/ReaderLogs/book-holders?bookTitle=${encodeURIComponent(bookTitle.trim())}`)
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка при загрузке данных');
        return res.json();
      })
      .then((data) => setHoldersData(data || []))
      .catch((err) => console.error("Ошибка Запроса 12:", err));
  };

  useEffect(() => {
    if (isOpen) {
      fetchHolders();
    }
  }, [isOpen, bookTitle]);

  // Автоматически находим читателя, который должен сдать книгу РАНЬШЕ всех
  const earliestReturnReader = useMemo(() => {
    if (!holdersData || holdersData.length === 0) return null;

    // Сортируем массив по возрастанию даты дедлайна (самая ранняя дата будет первой)
    const sorted = [...holdersData].sort((a, b) => new Date(a.returnDeadline) - new Date(b.returnDeadline));
    return sorted[0];
  }, [holdersData]);

  return (
    <div className="card mb-3 overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--purple-main)' }}>
      
      {/* Шапка 12-го аккордеона */}
      <button
        className="btn text-white w-100 p-3 text-start d-flex justify-content-between align-items-start rounded-0"
        style={{ backgroundColor: 'var(--purple-main)', border: 'none' }}
        onClick={onToggle}
      >
        <div className="d-flex align-items-start gap-3">
          <span className="badge bg-light text-dark fw-bold mt-1">Запрос 12</span>
          <p className="mb-0 fs-6 text-wrap" style={{ lineHeight: '1.4' }}>
            Получить перечень читателей, у которых на руках некоторая книга, и читателя, который раньше всех должен её сдать.
          </p>
        </div>
        <span className="ms-2 fs-5">{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Раскрывающийся контент */}
      {isOpen && (
        <div className="p-3 border-top" style={{ borderColor: 'var(--purple-main) !important' }}>
          
          {/* --- КАРТОЧКА-ИНДИКАТОР: ТОТ, КТО ДОЛЖЕН СДАТЬ РАНЬШЕ ВСЕХ --- */}
          {earliestReturnReader && (
            <div className="card mb-4 p-3 border-danger" style={{ backgroundColor: 'rgba(220, 53, 69, 0.03)', borderLeft: '5px solid #dc3545' }}>
              <div className="fw-bold text-danger text-uppercase small mb-1">⏰ Сдать раньше всех должен:</div>
              <div className="fs-5 fw-bold">{earliestReturnReader.readerName}</div>
              <div className="small text-muted mt-1">
                Номер билета: <strong className="text-light">#{earliestReturnReader.cardNumber}</strong> | 
                Крайний срок: <strong className="text-warning">{new Date(earliestReturnReader.returnDeadline).toLocaleDateString('ru-RU')}</strong>
              </div>
            </div>
          )}

          {/* Внутреннее поле фильтрации по названию книги */}
          <div className="card mb-4 p-3 border-secondary" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-8">
                <label className="form-label small fw-bold text-muted">Введите точное или частичное название книги:</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Властелин, Война и мир..."
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                />
              </div>
              
            </div>
          </div>

          {/* Таблица читателей, у которых книга сейчас на руках */}
          <h5 className="mb-3 border-start border-3 border-purple-main ps-2 fs-6 fw-bold text-uppercase" style={{ borderColor: 'var(--purple-main) !important' }}>
            Список всех текущих держателей книги
          </h5>
          
          {holdersData.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover table-striped align-middle m-0" style={{ color: 'var(--text-color)' }}>
                <thead>
                  <tr className="table-dark">
                    <th style={{ backgroundColor: 'var(--purple-main)', color: 'white', width: '120px' }}>№ Билета</th>
                    <th>ФИО Читателя</th>
                    <th className="text-center">Дата выдачи книги</th>
                    <th className="text-center">Крайний срок сдачи</th>
                  </tr>
                </thead>
                <tbody>
                  {holdersData.map((holder, index) => {
                    // Подсвечиваем того самого «самого раннего» студента в общей таблице
                    const isEarliest = holder.cardNumber === earliestReturnReader?.cardNumber;

                    return (
                      <tr key={index} style={isEarliest ? { backgroundColor: 'rgba(255, 193, 7, 0.05)' } : {}}>
                        <td className="fw-bold" style={{ color: 'var(--purple-main)' }}>{holder.cardNumber}</td>
                        <td>
                          {holder.readerName}{' '}
                          {isEarliest && <span className="badge bg-warning text-dark ms-2">⚠️ Первый на сдачу</span>}
                        </td>
                        <td className="text-center text-muted">
                          {new Date(holder.borrowDate).toLocaleDateString('ru-RU')}
                        </td>
                        <td className={`text-center fw-bold ${isEarliest ? 'text-warning' : 'text-muted'}`}>
                          {new Date(holder.returnDeadline).toLocaleDateString('ru-RU')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-muted py-4 border rounded border-dashed" style={{ borderStyle: 'dashed' }}>
              Книгу «{bookTitle}» в данный момент никто не удерживает на руках.
            </div>
          )}

        </div>
      )}
    </div>
  );
}

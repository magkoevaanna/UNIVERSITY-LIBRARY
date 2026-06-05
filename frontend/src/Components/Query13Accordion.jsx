import React, { useState, useEffect } from 'react';

export default function Query13Accordion({ isOpen, onToggle }) {
  const [readersData, setReadersData] = useState([]);
  
  // Состояние для поля ввода фамилии читателя (по умолчанию Петров)
  const [lastName, setLastName] = useState('Петров');

  // Функция для загрузки данных с C# бэкенда
  const fetchReaderInfo = () => {
    if (!lastName.trim()) return;

    fetch(`http://localhost:5000/api/ReportsReader/search-by-name?lastName=${encodeURIComponent(lastName.trim())}`)
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка сервера при поиске читателя');
        return res.json();
      })
      .then((data) => setReadersData(data || []))
      .catch((err) => console.error("Ошибка Запроса 13:", err));
  };

  useEffect(() => {
    if (isOpen) {
      fetchReaderInfo();
    }
  }, [isOpen, lastName]);

  return (
    <div className="card mb-3 overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--purple-main)' }}>
      
      {/* Шапка 13-го аккордеона */}
      <button
        className="btn text-white w-100 p-3 text-start d-flex justify-content-between align-items-start rounded-0"
        style={{ backgroundColor: 'var(--purple-main)', border: 'none' }}
        onClick={onToggle}
      >
        <div className="d-flex align-items-start gap-3">
          <span className="badge bg-light text-dark fw-bold mt-1">Запрос 13</span>
          <p className="mb-0 fs-6 text-wrap" style={{ lineHeight: '1.4' }}>
            Выдать полную информацию о читателе по его фамилии — группу, курс, факультет, правонарушения, их количество, штрафы, утерянные книги.
          </p>
        </div>
        <span className="ms-2 fs-5">{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Раскрывающийся контент */}
      {isOpen && (
        <div className="p-3 border-top" style={{ borderColor: 'var(--purple-main) !important' }}>
          
          {/* Поле ввода для поиска по фамилии */}
          <div className="card mb-4 p-3 border-secondary" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-8">
                <label className="form-label small fw-bold text-muted">Введите фамилию читателя для поиска:</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Например: Петров, Иванов, Сидоров..."
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
        
            </div>
          </div>

          {/* Отображение результатов поиска */}
          {readersData.length > 0 ? (
            <div className="row g-4">
              {readersData.map((reader, index) => {
                const hasDebt = reader.activeFinesDebt > 0;
                const hasLostBooks = reader.lostBooksCount > 0;

                return (
                  <div className="col-12" key={index}>
                    {/* Заголовок с ФИО найденного человека */}
                    <h5 className="text-white border-start border-3 border-purple-main ps-2 mb-3 fs-5">
                      👤 {reader.fullName}
                    </h5>

                    {/* Сводные мини-карточки нарушений и данных */}
                    <div className="row g-3 mb-3 text-center">
                      <div className="col-6 col-md-3">
                        <div className="p-2 border rounded border-secondary bg-dark text-light small">
                          🏫 Факультет: <strong className="d-block text-wrap text-purple-main" style={{ color: 'var(--purple-main)' }}>{reader.faculty}</strong>
                        </div>
                      </div>
                      <div className="col-6 col-md-3">
                        <div className="p-2 border rounded border-secondary bg-dark text-light small">
                          📚 Группа / Курс: <strong className="d-block text-light">{reader.groupName} ({reader.course} курс)</strong>
                        </div>
                      </div>
                      <div className="col-6 col-md-3">
                        <div className={`p-2 border rounded small ${hasLostBooks ? 'border-danger text-danger bg-danger bg-opacity-10' : 'border-secondary text-muted'}`}>
                          📖 Утеряно книг: <strong className="d-block fs-6">{reader.lostBooksCount} шт.</strong>
                        </div>
                      </div>
                      <div className="col-6 col-md-3">
                        <div className={`p-2 border rounded small ${hasDebt ? 'border-warning text-warning bg-warning bg-opacity-10' : 'border-secondary text-muted'}`}>
                          💰 Долг по штрафам: <strong className="d-block fs-6">{reader.activeFinesDebt} </strong>
                        </div>
                      </div>
                    </div>

                    {/* Подробная техническая таблица с историей штрафов */}
                    <div className="table-responsive">
                      <table className="table table-hover table-bordered align-middle m-0" style={{ color: 'var(--text-color)', borderColor: '#2d264f' }}>
                        <thead>
                          <tr className="table-dark">
                            <th>Параметр досье</th>
                            <th>Значение в системе</th>
                            <th className="text-center" style={{ width: '150px' }}>Статус правонарушений</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="text-muted small">Общая сумма выписанных штрафов за всё время</td>
                            <td className="fw-bold">{reader.totalFines}</td>
                            <td rowSpan="3" className="text-center align-middle bg-dark bg-opacity-20">
                              {hasDebt || hasLostBooks ? (
                                <span className="badge bg-danger p-2 px-3 fs-7">⚠️ Есть нарушения</span>
                              ) : (
                                <span className="badge bg-success p-2 px-3 fs-7">🟢 </span>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-muted small">Потери материального фонда библиотеки</td>
                            <td className={hasLostBooks ? "text-danger fw-bold" : ""}>
                              {hasLostBooks ? `Зафиксировано утерь: ${reader.lostBooksCount} шт.` : "Нет утерянных книг"}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-muted small">Финансовый статус аккаунта студента</td>
                            <td className={hasDebt ? "text-warning fw-bold" : "text-success"}>
                              {hasDebt ? `Неоплаченный задолженный баланс: ${reader.activeFinesDebt} ` : "Все наложенные штрафы полностью оплачены"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-muted py-4 border rounded border-dashed" style={{ borderStyle: 'dashed' }}>
              {lastName.trim() 
                ? `Читатель с фамилией «${lastName}» в базе данных университета не найден.`
                : 'Введите фамилию студента (например, Петров) для вывода полного академического досье.'}
            </div>
          )}

        </div>
      )}
    </div>
  );
}

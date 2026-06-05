import React, { useState, useEffect } from 'react';

export default function Query2Accordion({ isOpen, onToggle }) {
  const [subscriberId, setSubscriberId] = useState('');
  const [query2Data, setQuery2Data] = useState([]);

  // Состояния для фильтрации должников
  const [filters, setFilters] = useState({
    faculty: '',
    department: '',
    course: '',
    groupName: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchQuery2Data = () => {
    const url = subscriberId 
      ? `http://localhost:5000/api/ReaderLogs/overdue${subscriberId}`
      : `http://localhost:5000/api/ReaderLogs/overdue`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setQuery2Data(data))
      .catch((err) => console.error("Ошибка загрузки отчета по должникам:", err));
  };

  useEffect(() => {
    fetchQuery2Data();
  }, [subscriberId]);

  const filteredData = query2Data.filter((item) => {
    return (
      (filters.faculty === '' || (item.faculty && item.faculty.toLowerCase().includes(filters.faculty.toLowerCase()))) &&
      (filters.department === '' || (item.department && item.department.toLowerCase().includes(filters.department.toLowerCase()))) &&
      (filters.course === '' || (item.course !== null && String(item.course) === filters.course)) &&
      (filters.groupName === '' || (item.groupName && item.groupName.toLowerCase().includes(filters.groupName.toLowerCase())))
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
          <span className="badge bg-light text-dark fw-bold mt-1">Запрос 2</span>
          <p className="mb-0 fs-6 text-wrap" style={{ lineHeight: '1.4' }}>
            Получить список и общее число всех читателей-задолжников со сроком более 10 дней на данном абоненте либо по всей библиотеке, по признаку принадлежности к кафедре, факультету, курсу, группе.
          </p>
        </div>
        <span className="ms-2 fs-5">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="p-3 border-top" style={{ borderColor: 'var(--purple-main) !important' }}>
          
          {/* Статистика задолжников */}
          <div className="mb-3 fs-5">
            Найдено должников (&gt;10 дней):{' '}
            <strong className="text-danger">{filteredData.length}</strong> (из {query2Data.length})
            {subscriberId ? ` (на абоненте №${subscriberId})` : ' (по всей библиотеке)'}
          </div>

          {/* Параметры выборки и фильтры */}
          <div className="card mb-4 p-3 border-secondary" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <h5 className="mb-3 fs-6 text-uppercase fw-bold">Параметры выборки и фильтры</h5>
            
            <div className="row g-3">
              {/* ID абонента */}
              <div className="col-md-4">
                <label htmlFor="subscriberInput" className="form-label small fw-bold">ID Абонента (пусто = вся библиотека):</label>
                <div className="d-flex gap-2">
                  <input
                    id="subscriberInput"
                    type="number"
                    className="form-control text-center bg-dark text-light border-secondary"
                    placeholder="Все"
                    value={subscriberId}
                    onChange={(e) => setSubscriberId(e.target.value)}
                    min="1"
                  />
                  <button className="btn text-white" style={{ backgroundColor: 'var(--purple-main)' }} onClick={fetchQuery2Data}>
                    🔄
                  </button>
                </div>
              </div>

              {/* Фильтр: Факультет */}
              <div className="col-md-4">
                <label className="form-label small fw-bold">Факультет:</label>
                <input
                  type="text"
                  name="faculty"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Поиск по факультету..."
                  value={filters.faculty}
                  onChange={handleFilterChange}
                />
              </div>

              {/* Фильтр: Кафедра */}
              <div className="col-md-4">
                <label className="form-label small fw-bold">Кафедра:</label>
                <input
                  type="text"
                  name="department"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Поиск по кафедре..."
                  value={filters.department}
                  onChange={handleFilterChange}
                />
              </div>

              {/* Фильтр: Курс */}
              <div className="col-md-4">
                <label className="form-label small fw-bold">Курс:</label>
                <input
                  type="number"
                  name="course"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Например: 3"
                  value={filters.course}
                  onChange={handleFilterChange}
                  min="1"
                  max="6"
                />
              </div>

              {/* Фильтр: Группа */}
              <div className="col-md-4">
                <label className="form-label small fw-bold">Группа:</label>
                <input
                  type="text"
                  name="groupName"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Например: ИТ-41"
                  value={filters.groupName}
                  onChange={handleFilterChange}
                />
              </div>

              {/* Кнопка сброса */}
              <div className="col-md-4 d-flex align-items-end">
                <button 
                  className="btn btn-outline-secondary w-100"
                  onClick={() => setFilters({ faculty: '', department: '', course: '', groupName: '' })}
                >
                  Сбросить фильтры
                </button>
              </div>
            </div>
          </div>

          {/* Таблица задолжников */}
          {filteredData.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover table-striped align-middle m-0" style={{ color: 'var(--text-color)' }}>
                <thead>
                  <tr className="table-dark">
                    <th style={{ backgroundColor: '#dc3545', color: 'white' }}>№ Карты</th>
                    <th>ФИО Должника</th>
                    <th>Факультет</th>
                    <th>Кафедра</th>
                    <th>Курс</th>
                    <th>Группа</th>
                    <th className="text-center text-warning">Дней просрочки</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={index}>
                      <td className="fw-bold text-danger">{item.cardNumber}</td>
                      <td>{item.fullName}</td>
                      <td>{item.faculty || '—'}</td>
                      <td>{item.department || '—'}</td>
                      <td>{item.course !== null ? item.course : '—'}</td>
                      <td>{item.groupName || '—'}</td>
                      <td className="text-center fw-bold text-warning">
                        {item.daysOverdue || '10+'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-muted py-3">
              Нет задолжников, соответствующих выбранным критериям
            </div>
          )}

        </div>
      )}
    </div>
  );
}

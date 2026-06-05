import React, { useState, useEffect } from 'react';

export default function Query1Accordion({ isOpen, onToggle }) {
  const [pointId, setPointId] = useState('1');
  const [query1Data, setQuery1Data] = useState([]);

  // Состояния для фильтров
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

  const fetchReportData = () => {
    if (!pointId) return;
    fetch(`http://localhost:5000/api/ReportsReader/by-point/${pointId}`)
      .then((res) => res.json())
      .then((data) => setQuery1Data(data))
      .catch((err) => console.error("Ошибка загрузки отчета:", err));
  };

  useEffect(() => {
    fetchReportData();
  }, [pointId]);

  const filteredData = query1Data.filter((item) => {
    return (
      (filters.faculty === '' || (item.faculty && item.faculty.toLowerCase().includes(filters.faculty.toLowerCase()))) &&
      (filters.department === '' || (item.department && item.department.toLowerCase().includes(filters.department.toLowerCase()))) &&
      (filters.course === '' || (item.course !== null && String(item.course) === filters.course)) &&
      (filters.groupName === '' || (item.groupName && item.groupName.toLowerCase().includes(filters.groupName.toLowerCase())))
    );
  });

  return (
    <div className="card mb-3 overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--purple-main)' }}>
      
      {/* Шапка аккордеона */}
      <button
        className="btn text-white w-100 p-3 text-start d-flex justify-content-between align-items-start rounded-0"
        style={{ backgroundColor: 'var(--purple-main)', border: 'none' }}
        onClick={onToggle}
      >
        <div className="d-flex align-items-start gap-3">
          <span className="badge bg-light text-dark fw-bold mt-1">Запрос 1</span>
          <p className="mb-0 fs-6 text-wrap" style={{ lineHeight: '1.4' }}>
            Получить перечень и общее число читателей для данного читального зала или абонента, 
            либо по всей библиотеке, по признаку принадлежности к кафедре, факультету, курсу, группе.
          </p>
        </div>
        <span className="ms-2 fs-5">{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Раскрывающийся контент */}
      {isOpen && (
        <div className="p-3 border-top" style={{ borderColor: 'var(--purple-main) !important' }}>
          
          <div className="mb-3 fs-5">
            Найдено читателей: <strong style={{ color: 'var(--purple-main)' }}>{filteredData.length}</strong> (из {query1Data.length})
          </div>

          {/* Панель параметров и фильтров */}
          <div className="card mb-4 p-3" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--purple-main)' }}>
            <h5 className="mb-3 fs-6 text-uppercase fw-bold">Параметры выборки и фильтры</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <label htmlFor="pointIdInput" className="form-label small fw-bold">ID зала / абонента:</label>
                <input
                  id="pointIdInput"
                  type="number"
                  className="form-control bg-dark text-light border-secondary"
                  value={pointId}
                  onChange={(e) => setPointId(e.target.value)}
                  min="1"
                />
              </div>
              
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

          {/* Таблица */}
          {filteredData.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover table-striped align-middle m-0" style={{ color: 'var(--text-color)' }}>
                <thead>
                  <tr className="table-dark">
                    <th style={{ backgroundColor: 'var(--purple-main)', color: 'white' }}>№ Карты</th>
                    <th>ФИО Читателя</th>
                    <th>Факультет</th>
                    <th>Кафедра</th>
                    <th>Курс</th>
                    <th>Группа</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={index}>
                      <td className="fw-bold" style={{ color: 'var(--purple-main)' }}>{item.cardNumber}</td>
                      <td>{item.fullName}</td>
                      <td>{item.faculty}</td>
                      <td>{item.department}</td>
                      <td>{item.course !== null ? item.course : '—'}</td>
                      <td>{item.groupName !== null ? item.groupName : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-muted py-3">
              Нет данных, соответствующих выбранным критериям
            </div>
          )}
        </div>
      )}
    </div>
  );
}

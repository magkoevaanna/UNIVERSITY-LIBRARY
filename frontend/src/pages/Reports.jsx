import React, { useState } from 'react';

export default function Reports() {
  const [reportType, setReportType] = useState('');
  
  // Состояния для полей ввода (параметров)
  const [pointId, setPointId] = useState('');
  const [months, setMonths] = useState('1');
  const [lastName, setLastName] = useState('');

  // Состояния для запроса и данных
  const [reportData, setReportData] = useState(null); // null, чтобы разделять "пусто" и "массив"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Очистка полей при смене типа отчета
  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
    setReportData(null);
    setError(null);
    setPointId('');
    setMonths('1');
    setLastName('');
  };

  const handleFetchReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setReportData(null);

    try {
      let url = 'http://localhost:5000/api/ReportsReader';

      // Настройка URL в зависимости от выбранного отчета
      switch (reportType) {
        case 'by-point':
          if (!pointId) throw new Error('Введите ID точки выдачи');
          url += `/by-point/${pointId}`; // Передается в пути
          break;

        case 'suspended':
          url += '/suspended';
          break;

        case 'movement':
          // Если pointId не введен, отправляем 0, как в дефолтных параметрах C#
          const pId = pointId || 0; 
          url += `/movement?pointId=${pId}&months=${months}`;
          break;

        case 'search-by-name':
          if (!lastName.trim()) throw new Error('Введите фамилию читателя');
          url += `/search-by-name?lastName=${encodeURIComponent(lastName)}`;
          break;

        default:
          throw new Error('Выберите корректный тип отчета');
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }
      
      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Страница отчетов</h2>
      
      <form onSubmit={handleFetchReport} style={{ marginBottom: '30px', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end' }}>
        
        {/* Селект выбора отчета */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Тип отчета:</label>
          <select value={reportType} onChange={handleReportTypeChange} style={{ padding: '8px', minWidth: '320px' }}>
            <option value="">-- Выберите отчет --</option>
            <option value="by-point">Запрос 1: Читатели по точке выдачи</option>
            <option value="suspended">Запрос 8: Читатели, приостановившие пользование</option>
            <option value="movement">Запрос (б/н): Движение фонда / Литература</option>
            <option value="search-by-name">Запрос 13: Поиск читателя по фамилии</option>
          </select>
        </div>

        {/* Динамические параметры */}
        {/* Поле Point ID (нужно для ЗАПРОСА 1 и для Движения фонда) */}
        {(reportType === 'by-point' || reportType === 'movement') && (
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>ID точки выдачи:</label>
            <input 
              type="number" 
              value={pointId} 
              onChange={(e) => setPointId(e.target.value)} 
              placeholder={reportType === 'movement' ? "0 (Все точки)" : "Например: 1"}
              style={{ padding: '8px', width: '130px' }}
              min="0"
            />
          </div>
        )}

        {/* Поле количества месяцев (нужно для Движения фонда) */}
        {reportType === 'movement' && (
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Период (в месяцах):</label>
            <input 
              type="number" 
              value={months} 
              onChange={(e) => setMonths(e.target.value)} 
              style={{ padding: '8px', width: '100px' }}
              min="1"
            />
          </div>
        )}

        {/* Поле Фамилия (нужно для ЗАПРОСА 13) */}
        {reportType === 'search-by-name' && (
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Фамилия читателя:</label>
            <input 
              type="text" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              placeholder="Иванов"
              style={{ padding: '8px', width: '200px' }}
            />
          </div>
        )}

        {/* Кнопка */}
        <button 
          type="submit" 
          disabled={!reportType || loading}
          style={{ padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {loading ? 'Загрузка...' : 'Сформировать'}
        </button>
      </form>

      {/* Ошибки */}
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>⚠️ Ошибка: {error}</div>}

      {/* Рендеринг таблиц результатов на основе выбранного отчета */}
      {reportData && (
        <div style={{ marginTop: '20px' }}>
          <h3>Результаты отчета</h3>
          
          {/* ТАБЛИЦА ДЛЯ ЗАПРОСА 1 (by-point) */}
          {reportType === 'by-point' && Array.isArray(reportData) && (
            <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f2f2f2' }}>
                <tr>
                  <th>Факультет</th><th>Кафедра</th><th>Курс</th><th>Группа</th><th>Номер билета</th><th>ФИО</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.faculty}</td><td>{item.department}</td><td>{item.course || '-'}</td>
                    <td>{item.groupName || '-'}</td><td>{item.cardNumber}</td><td>{item.fullName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* ТАБЛИЦА ДЛЯ ЗАПРОСА 8 (suspended) */}
          {reportType === 'suspended' && Array.isArray(reportData) && (
            <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead style={{ background: '#f2f2f2' }}>
                <tr>
                  <th>Факультет</th>
                  <th>Кафедра</th>
                  <th>Категория читателя</th>
                  <th>ФИО читателя</th>
                  <th>Приостановлен до</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((item, idx) => (
                  <tr key={idx}>
                    {/* Свойства пишутся с маленькой буквы, так как ASP.NET Core по умолчанию сериализует в camelCase */}
                    <td>{item.faculty}</td>
                    <td>{item.department}</td>
                    <td>{item.category}</td>
                    <td>{item.fullName}</td>
                    <td>{item.suspendedUntil ? new Date(item.suspendedUntil).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}


          {/* ОТОБРАЖЕНИЕ ДЛЯ ОТЧЕТА "MOVEMENT" (Объект, не массив) */}
          {reportType === 'movement' && typeof reportData === 'object' && !Array.isArray(reportData) && (
            <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '4px', background: '#fafafa' }}>
              <p><strong>Получено книг за период:</strong> {reportData.receivedCount ?? reportData.received_count ?? 0} шт.</p>
              <p><strong>Списано / Выдано книг:</strong> {reportData.issuedCount ?? reportData.issued_count ?? 0} шт.</p>
              <p><strong>Общий баланс изменений:</strong> {reportData.totalBalance ?? reportData.total_balance ?? 0} шт.</p>
            </div>
          )}

          {/* ТАБЛИЦА ДЛЯ ЗАПРОСА 13 (search-by-name) */}
          {/* ТАБЛИЦА ДЛЯ ЗАПРОСА 13 (search-by-name) */}
          {reportType === 'search-by-name' && Array.isArray(reportData) && (
            <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead style={{ background: '#f2f2f2' }}>
                <tr>
                  <th>ФИО читателя</th>
                  <th>Факультет</th>
                  <th>Курс</th>
                  <th>Группа</th>
                  <th>Утеряно книг</th>
                  <th>Всего штрафов</th>
                  <th>Долг по штрафам</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 'bold' }}>{item.fullName}</td>
                    <td>{item.faculty}</td>
                    <td style={{ textAlign: 'center' }}>{item.course || '-'}</td>
                    <td>{item.groupName || '-'}</td>
                    <td style={{ textAlign: 'center', color: item.lostBooksCount > 0 ? 'red' : 'inherit' }}>
                      {item.lostBooksCount} шт.
                    </td>
                    <td>{item.totalFines?.toFixed(2)} ₽</td>
                    <td style={{ fontWeight: 'bold', color: item.activeFinesDebt > 0 ? '#dc3545' : 'green' }}>
                      {item.activeFinesDebt?.toFixed(2)} ₽
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}


          {/* Если массив пришел пустой */}
          {Array.isArray(reportData) && reportData.length === 0 && (
            <p style={{ color: '#666' }}>Данные по этому запросу отсутствуют.</p>
          )}
        </div>
      )}
    </div>
  );
}

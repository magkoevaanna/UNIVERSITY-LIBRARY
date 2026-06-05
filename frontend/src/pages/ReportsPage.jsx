import React, { useState } from 'react';
import Query1Accordion from '../Components/Query1Accordion'; 
import Query2Accordion from '../Components/Query2Accordion'; 
import Query3Accordion from '../Components/Query3Accordion'; 
import Query4Accordion from '../Components/Query4Accordion'; 
import Query5Accordion from '../Components/Query5Accordion'; 
import Query6Accordion from '../Components/Query6Accordion'; 
import Query9Accordion from '../Components/Query9Accordion'; // Подключаем Запрос 9
import Query10Accordion from '../Components/Query10Accordion';
import Query11Accordion from '../Components/Query11Accordion';
import Query12Accordion from '../Components/Query12Accordion';
import Query13Accordion from '../Components/Query13Accordion';



export default function ReportsPage() {
  const [openSections, setOpenSections] = useState({
    query1: false,
    query2: false,
    query3: false,
    query4: false,
    query5: false,
    query6: false,
    query9: false,
    query10: false,
    query11: false,
    query12: false,
    query13: false
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Отчеты системы и статистика</h2>

      <Query1Accordion isOpen={openSections.query1} onToggle={() => toggleSection('query1')} />
      <Query2Accordion isOpen={openSections.query2} onToggle={() => toggleSection('query2')} />
      <Query3Accordion isOpen={openSections.query3} onToggle={() => toggleSection('query3')} />
      <Query4Accordion isOpen={openSections.query4} onToggle={() => toggleSection('query4')} />
      <Query5Accordion isOpen={openSections.query5} onToggle={() => toggleSection('query5')} />
      <Query6Accordion isOpen={openSections.query6} onToggle={() => toggleSection('query6')} />
      <Query9Accordion isOpen={openSections.query9} onToggle={() => toggleSection('query9')} />
      <Query10Accordion isOpen={openSections.query10} onToggle={() => toggleSection('query10')} />
      <Query11Accordion isOpen={openSections.query11} onToggle={() => toggleSection('query11')} />
      <Query12Accordion isOpen={openSections.query12} onToggle={() => toggleSection('query12')} />
      <Query13Accordion isOpen={openSections.query13} onToggle={() => toggleSection('query13')} />
    </div>
  );

}
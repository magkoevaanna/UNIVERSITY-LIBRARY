import React, { useState, useEffect } from 'react';
import BookCard from '../Components/BookCard';

const Profile = () => {
    
  return (
    <div className="container">
      <div className="card mb-3">
        <div className="row g-0">
          <div className="col-md-4">
            <img src="../../public/covers/gray.jpg" className="img-fluid rounded-start h-1000" alt="Фото профиля"/>
          </div>
          <div className="col-md-6">
            <div className="card-body">
              <h5 className="card-title">Заголовок карточки</h5>
              <p className="card-text">Это более широкая карточка с вспомогательным текстом ниже в качестве естественного перехода к дополнительному контенту. Этот контент немного длиннее.</p>
              <p className="card-text"><small className="text-body-secondary">Последнее обновление 3 мин. назад</small></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

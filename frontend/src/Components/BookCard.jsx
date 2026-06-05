import React from 'react';

const BookCard = ({ title, author, image, id }) => {
  const handleBooking = () => {
    alert(`Вы забронировали книгу: ${title} (ID: ${id})`);
  };

  return (
    <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden text-light" 
         style={{ backgroundColor: '#2d1b4e' }}> 
      <div 
        className="position-relative w-100 d-flex align-items-center justify-content-center" 
        style={{ aspectRatio: '2 / 3', overflow: 'hidden', backgroundColor: '#130924' }} 
      >
        {image ? (
          <img 
            src={image} 
            className="w-100 h-100" 
            alt={title}
            style={{ objectFit: 'contain', padding: '16px' }}
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = '/covers/gray.jpg'; 
            }}
          />
        ) : (
          <div className="text-center p-3">
            <span className="text-muted small fw-medium">Нет обложки</span>
          </div>
        )}
      </div>

      <div className="card-body p-3 d-flex flex-column justify-content-between">
        <div className="mb-3">
          <h6 className="card-title fw-bold text-white mb-1 text-truncate" title={title}>
            {title || `Книга без названия`}
          </h6>
          <p className="card-text text-white-50 small text-truncate mb-0">
            {author || "Автор неизвестен"}
          </p>
        </div>
        
        <button 
          className="btn btn-primary w-100 py-2 fw-medium border-0 rounded-2 text-white" 
          style={{ backgroundColor: '#824fe0', transition: 'background 0.2s' }}
          onClick={handleBooking}
        >
          Забронировать
        </button>
      </div>
    </div>
  );
};

export default BookCard;

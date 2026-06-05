import React, { useState, useEffect } from 'react';
import BookCard from '../Components/BookCard';

const Catalog = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/ReportsBook/top20') 
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error("Ошибка сети:", err));
  }, []);


  const filteredBooks = books.filter(book => {
    const titleMatch = book.title?.toLowerCase().includes(search.toLowerCase());
    const authorMatch = book.author?.toLowerCase().includes(search.toLowerCase());
    return titleMatch || authorMatch; 
  });

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card p-3 shadow-sm border-0 mb-4" style={{backgroundColor: 'var(--card-bg)'}}>
            <h5>Поиск по каталогу</h5>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Введите название книги или автора..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="col-12">
          <div className="row row-cols-2 row-cols-md-4 row-cols-lg-5 g-4 mb-5">
            {filteredBooks.map((book, index) => (
              <div className="col" key={book.bookId || index}>
                <BookCard 
                  title={book.title} 
                  author={book.author} 
                  image={`/covers/${book.bookId}.jpg`} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;

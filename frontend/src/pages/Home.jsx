// import React from 'react';
import BookCard from '../Components/BookCard';

import React, { useState, useEffect } from 'react';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/ReportsBook/top20') 
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.slice(0, 6));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка при загрузке книг:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-5">Загрузка популярных книг...</div>;

  return (
    <div className="container mt-4">
      <h2>Популярное</h2>
      <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 g-4 mt-2">
        {books.map((book) => (
          <div className="col" key={book.isbn}> 
            <BookCard 
              id={book.id}
              title={book.title} 
              author={book.author} 
              image={`/covers/${book.isbn}.jpg`} 
            />
          </div>
        ))}
      </div>

      </div>
  );
};

export default Home;

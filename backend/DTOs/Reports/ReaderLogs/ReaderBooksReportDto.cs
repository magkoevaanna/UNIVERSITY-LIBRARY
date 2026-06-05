using System;
using System.Collections.Generic;

namespace UniversityLibrary.Backend.DTOs.Reports.ReaderLogs;

// Модель для одной книги
public class ReaderBookItemDto
{
    public string Title { get; set; } = null!;
    public string Author { get; set; } = null!;
    public DateTime ActionDate { get; set; }
}

// Главный класс отчета, объединяющий книги на руках и историю
public class ReaderBooksReportDto
{
    public List<ReaderBookItemDto> BooksOnHands { get; set; } = new();
    public List<ReaderBookItemDto> OrderHistory { get; set; } = new();
}

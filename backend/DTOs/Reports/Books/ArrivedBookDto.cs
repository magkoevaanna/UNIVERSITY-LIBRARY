using System;
using System.Collections.Generic;

namespace UniversityLibrary.Backend.DTOs.Reports.Books;

// Модель для поступившей книги
public class ArrivedBookDto
{
    public string Title { get; set; } = null!;
    public string Author { get; set; } = null!;
    public DateTime ArrivalDate { get; set; }
    public string Location { get; set; } = null!;
}

// Модель для утерянной книги
public class LostBookDto
{
    public string Title { get; set; } = null!;
    public string Author { get; set; } = null!;
    public DateTime LostDate { get; set; }
    public decimal FineAmount { get; set; }
}

// Главный класс отчета, объединяющий оба списка
public class BookMovementReportDto
{
    public List<ArrivedBookDto> ArrivedBooks { get; set; } = new();
    public List<LostBookDto> LostBooks { get; set; } = new();
}

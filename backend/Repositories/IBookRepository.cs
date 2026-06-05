using UniversityLibrary.Backend.DTOs.Reports.Books;

namespace UniversityLibrary.Backend.Repositories;

public interface IBookRepository
{
    List<TopBookReportDto> GetTopTwentyBooks();
    BookMovementReportDto GetBookMovementReport(int pointId, string? author, int? releaseYear, int? arrivalYear);
    List<BookCountReportDto> GetBookCountsReport(int pointId);
    List<BookAvailabilityReportDto> GetBookAvailability(string title);
}

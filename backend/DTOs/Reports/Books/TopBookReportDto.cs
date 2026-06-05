namespace UniversityLibrary.Backend.DTOs.Reports.Books;

public class TopBookReportDto
{
    public string BookId { get; set; } = "";
    public string Title { get; set; } = "";
    public string Author { get; set; } = "";
    public int OrderCount { get; set; }
}

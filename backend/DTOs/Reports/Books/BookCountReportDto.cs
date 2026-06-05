namespace UniversityLibrary.Backend.DTOs.Reports.Books;

public class BookCountReportDto
{
    public string Title { get; set; } = null!;
    public string Author { get; set; } = null!;
    public string DistributionPoint { get; set; } = null!;
    public int CopiesCount { get; set; }
}

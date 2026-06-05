namespace UniversityLibrary.Backend.DTOs.Reports.Books;

public class BookAvailabilityReportDto
{
    public string Title { get; set; } = null!;
    public string SubscriptionName { get; set; } = null!;
    public int AvailableCount { get; set; }
}

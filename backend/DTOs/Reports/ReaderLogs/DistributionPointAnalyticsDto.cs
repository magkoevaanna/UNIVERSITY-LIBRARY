namespace UniversityLibrary.Backend.DTOs.Reports.ReaderLogs;

public class DistributionPointAnalyticsDto
{
    public string PointName { get; set; } = null!;
    public decimal TotalUnpaidFines { get; set; }
    public int ActiveReadersCount { get; set; }
    public int OverdueReadersCount { get; set; }
}

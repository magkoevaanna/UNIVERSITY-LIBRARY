namespace UniversityLibrary.Backend.DTOs.Reports.ReaderLogs;

public class OverdueReaderReportDto
{
    public string Faculty { get; set; } = null!;
    public string Department { get; set; } = null!;
    public int? Course { get; set; }
    public string? GroupName { get; set; }
    public string Category { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string BookTitle { get; set; } = null!;
    public int DaysOverdue { get; set; }
}

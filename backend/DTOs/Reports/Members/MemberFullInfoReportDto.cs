namespace UniversityLibrary.Backend.DTOs.Reports.Members;

public class MemberFullInfoReportDto
{
    public string FullName { get; set; } = null!;
    public string Faculty { get; set; } = null!;
    public int? Course { get; set; }
    public string? GroupName { get; set; }
    public int LostBooksCount { get; set; }
    public decimal TotalFines { get; set; }
    public decimal ActiveFinesDebt { get; set; }
}

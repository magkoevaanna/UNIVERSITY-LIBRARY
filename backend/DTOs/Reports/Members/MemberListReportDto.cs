namespace UniversityLibrary.Backend.DTOs.Reports.Members;

public class MemberListReportDto
{
    public string Faculty { get; set; } = null!;
    public string Department { get; set; } = null!;
    public int? Course { get; set; }
    public string? GroupName { get; set; }
    public int CardNumber { get; set; }
    public string FullName { get; set; } = null!;
}

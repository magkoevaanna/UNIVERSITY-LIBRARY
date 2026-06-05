using System;

namespace UniversityLibrary.Backend.DTOs.Reports.Members;

public class SuspendedMemberReportDto
{
    public string Faculty { get; set; } = null!;
    public string Department { get; set; } = null!;
    public string Category { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public DateTime SuspendedUntil { get; set; }
}

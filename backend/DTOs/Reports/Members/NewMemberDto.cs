using System;
using System.Collections.Generic;

namespace UniversityLibrary.Backend.DTOs.Reports.Members;


public class NewMemberDto
{
    public string Faculty { get; set; } = null!;
    public int? Course { get; set; }
    public string Category { get; set; } = null!;
    public int CardNumber { get; set; }
    public string FullName { get; set; } = null!;
    public DateTime RegistrationDate { get; set; }
}

public class LeftMemberCountDto
{
    public string Faculty { get; set; } = null!;
    public int Count { get; set; }
}

public class LibraryMovementReportDto
{
    public List<NewMemberDto> NewMembers { get; set; } = new();
    public List<LeftMemberCountDto> LeftMembersByFaculty { get; set; } = new();
}

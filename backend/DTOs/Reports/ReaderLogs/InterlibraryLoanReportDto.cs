using System;

namespace UniversityLibrary.Backend.DTOs.Reports.ReaderLogs;

public class InterlibraryLoanReportDto
{
    public int LoanId { get; set; }
    public string BookTitle { get; set; } = null!;
    public string ExternalLibraryName { get; set; } = null!;
    public DateTime RequestDate { get; set; }
    public string Status { get; set; } = null!;
}

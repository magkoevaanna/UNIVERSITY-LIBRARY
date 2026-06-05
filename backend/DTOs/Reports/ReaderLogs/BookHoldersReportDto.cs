using System;

namespace UniversityLibrary.Backend.DTOs.Reports.ReaderLogs;

public class BookHoldersReportDto
{
    public string ReaderName { get; set; } = null!;
    public int CardNumber { get; set; }
    public DateTime BorrowDate { get; set; }
    public DateTime ReturnDeadline { get; set; }
}

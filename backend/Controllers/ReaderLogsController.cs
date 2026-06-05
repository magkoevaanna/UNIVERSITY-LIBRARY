using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using UniversityLibrary.Backend.Repositories;
using UniversityLibrary.Backend.DTOs.Reports.ReaderLogs;

namespace UniversityLibrary.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReaderLogsController : ControllerBase
{
    private readonly IReaderLogRepository _logRepository;

    public ReaderLogsController(IReaderLogRepository logRepository)
    {
        _logRepository = logRepository;
    }

    [HttpGet("overdue")]// 2
    public List<OverdueReaderReportDto> GetOverdue([FromQuery] int pointId = 0, [FromQuery] bool onlyLongTerm = false)
    {
        return _logRepository.GetOverdueReaders(pointId, onlyLongTerm);
    }

    [HttpGet("points-analytics")] // 5
    public List<DistributionPointAnalyticsDto> GetPointsAnalytics()
    {
        return _logRepository.GetPointsAnalytics();
    }

    [HttpGet("interlibrary-loans")]// 6
    public List<InterlibraryLoanReportDto> GetInterlibraryLoans([FromQuery] int months = 1)
    {
        return _logRepository.GetInterlibraryLoans(months);
    }

    [HttpGet("reader-books")]// 9
    public ReaderBooksReportDto GetReaderBooks([FromQuery] int cardNumber, [FromQuery] int months = 1)
    {
        return _logRepository.GetReaderBooksReport(cardNumber, months);
    }

    [HttpGet("book-holders")]// 10
    public List<BookHoldersReportDto> GetBookHolders([FromQuery] string bookTitle)
    {
        return _logRepository.GetBookHolders(bookTitle);
    }
}

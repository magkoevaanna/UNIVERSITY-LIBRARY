using Microsoft.AspNetCore.Mvc;
using UniversityLibrary.Backend.Repositories;
using UniversityLibrary.Backend.DTOs.Reports.Books;

namespace UniversityLibrary.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsBookController : ControllerBase
{
    private readonly IBookRepository _bookRepository;

    public ReportsBookController(IBookRepository bookRepository)
    {
        _bookRepository = bookRepository;
    }

    [HttpGet("movement")]
    public BookMovementReportDto GetBookMovement(
        [FromQuery] int pointId = 0, 
        [FromQuery] string? author = null, 
        [FromQuery] int? releaseYear = null, 
        [FromQuery] int? arrivalYear = null)
    {
        return _bookRepository.GetBookMovementReport(pointId, author, releaseYear, arrivalYear);
    }
    [HttpGet("top20")]
    public IActionResult GetTop20()
    {
        var result = _bookRepository.GetTopTwentyBooks();
        return Ok(result);
    }

    [HttpGet("counts")] // 7
    public List<BookCountReportDto> GetBookCounts([FromQuery] int pointId = 0)
    {
        return _bookRepository.GetBookCountsReport(pointId);
    }


    [HttpGet("availability")] // 11
    public List<BookAvailabilityReportDto> GetAvailability([FromQuery] string title)
    {
        return _bookRepository.GetBookAvailability(title);
    }


}

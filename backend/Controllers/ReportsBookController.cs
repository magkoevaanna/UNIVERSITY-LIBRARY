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

    [HttpGet("movement")] // 4
    public BookMovementReportDto GetBookMovement(
        [FromQuery] int pointId = 0, 
        [FromQuery] string? author = null, 
        [FromQuery] int? releaseYear = null, 
        [FromQuery] int? arrivalYear = null)
    {
        int? filterPointId = pointId == 0 ? null : pointId;

        string? filterAuthor = string.IsNullOrWhiteSpace(author) ? null : author.Trim();

        return _bookRepository.GetBookMovement(filterPointId, filterAuthor, releaseYear, arrivalYear);
    }



    [HttpGet("top20")]// 3
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

using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using UniversityLibrary.Backend.Repositories;
using UniversityLibrary.Backend.DTOs.Reports.Members;

namespace UniversityLibrary.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsReaderController : ControllerBase
{
    private readonly IMemberRepository _memberRepository;

    public ReportsReaderController(IMemberRepository memberRepository)
    {
        _memberRepository = memberRepository;
    }

    [HttpGet("by-point/{pointId}")] // ЗАПРОС 1
    public List<MemberListReportDto> GetMembersByPoint(int pointId)
    {
        return _memberRepository.GetMembersByDistributionPoint(pointId);
    }



    [HttpGet("suspended")]// ЗАПРОС 8
    public List<SuspendedMemberReportDto> GetSuspendedMembers()
    {
        return _memberRepository.GetSuspendedMembersReport();
    }



    [HttpGet("movement")]
    public LibraryMovementReportDto GetMovementReport([FromQuery] int pointId = 0, [FromQuery] int months = 1)
    {
        return _memberRepository.GetLibraryMovementReport(pointId, months);
    }



    [HttpGet("search-by-name")] // ЗАПРОС 13
    public List<MemberFullInfoReportDto> SearchByName([FromQuery] string lastName)
    {
        return _memberRepository.GetMemberFullInfoByLastName(lastName);
    }


}

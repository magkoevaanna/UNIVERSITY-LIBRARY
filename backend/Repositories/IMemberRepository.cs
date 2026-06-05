using System.Collections.Generic;
using UniversityLibrary.Backend.DTOs.Reports.Members;

namespace UniversityLibrary.Backend.Repositories;

public interface IMemberRepository
{
    List<MemberListReportDto> GetMembersByDistributionPoint(int pointId);
    List<SuspendedMemberReportDto> GetSuspendedMembersReport();
    public LibraryMovementReportDto GetLibraryMovementReport(int pointId, int months);

    List<MemberFullInfoReportDto> GetMemberFullInfoByLastName(string lastName);
}

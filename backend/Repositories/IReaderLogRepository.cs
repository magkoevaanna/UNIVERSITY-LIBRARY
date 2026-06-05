using System.Collections.Generic;
using UniversityLibrary.Backend.DTOs.Reports.ReaderLogs;

namespace UniversityLibrary.Backend.Repositories;

public interface IReaderLogRepository
{
    List<OverdueReaderReportDto> GetOverdueReaders(int pointId, bool onlyLongTerm);
    List<DistributionPointAnalyticsDto> GetPointsAnalytics();
    List<InterlibraryLoanReportDto> GetInterlibraryLoans(int months);
    ReaderBooksReportDto GetReaderBooksReport(int cardNumber, int months);
    List<BookHoldersReportDto> GetBookHolders(string bookTitle);
}

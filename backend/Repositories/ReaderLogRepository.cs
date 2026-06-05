using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using UniversityLibrary.Backend.DTOs.Reports.ReaderLogs;

namespace UniversityLibrary.Backend.Repositories;

public class ReaderLogRepository : IReaderLogRepository
{
    private string ConnectionString;

    public ReaderLogRepository(string ConnectionString)
    {
        this.ConnectionString = ConnectionString;
    }

    public List<OverdueReaderReportDto> GetOverdueReaders(int pointId, bool onlyLongTerm)
    {
        var resultList = new List<OverdueReaderReportDto>();

        string query = @"
            SELECT 
                lm.faculty, lm.department, lm.course, lm.group_name, rc.name AS category,
                lm.full_name, b.title AS book_title,
                DATEDIFF('2026-06-02', rl.action_date) - rc.max_days AS days_overdue
            FROM reader_logs rl
            JOIN library_members lm ON rl.member_card_number = lm.card_number
            JOIN reader_categories rc ON lm.reader_category_id = rc.category_id
            JOIN book_inventories bi ON rl.book_inventory_id = bi.inventory_id
            JOIN books b ON bi.book_id = b.book_id
            WHERE rl.action_status = 'borrowed'
              AND NOT EXISTS (
                  SELECT 1 FROM reader_logs rl_sub 
                  WHERE rl_sub.book_inventory_id = rl.book_inventory_id 
                    AND rl_sub.member_card_number = rl.member_card_number
                    AND rl_sub.action_status IN ('returned', 'lost') AND rl_sub.action_date >= rl.action_date
              )
              AND DATEDIFF('2026-06-02', rl.action_date) > rc.max_days";

        if (pointId > 0)
        {
            query += " AND bi.distribution_point_id = @PointId";
        }

        if (onlyLongTerm)
        {
            query += " AND DATEDIFF('2026-06-02', rl.action_date) > (rc.max_days + 10)";
        }

        query += " ORDER BY lm.faculty, rc.name;";

        using (var connection = new MySqlConnection(this.ConnectionString))
        {
            using (var command = new MySqlCommand(query, connection))
            {
                if (pointId > 0)
                {
                    command.Parameters.AddWithValue("@PointId", pointId);
                }

                connection.Open();

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        resultList.Add(new OverdueReaderReportDto
                        {
                            Faculty = reader["faculty"].ToString()!,
                            Department = reader["department"].ToString()!,
                            Course = reader["course"] == DBNull.Value ? null : Convert.ToInt32(reader["course"]),
                            GroupName = reader["group_name"] == DBNull.Value ? null : reader["group_name"].ToString(),
                            Category = reader["category"].ToString()!,
                            FullName = reader["full_name"].ToString()!,
                            BookTitle = reader["book_title"].ToString()!,
                            DaysOverdue = Convert.ToInt32(reader["days_overdue"])
                        });
                    }
                }
            }
        }

        return resultList;
    }



    public List<DistributionPointAnalyticsDto> GetPointsAnalytics()
    {
        var analyticsList = new List<DistributionPointAnalyticsDto>();

        string query = @"
            SELECT 
                dp.name AS point_name,
                SUM(CASE WHEN rl.is_fine_paid = FALSE THEN IFNULL(rl.fine_amount, 0) ELSE 0 END) AS total_unpaid_fines,
                COUNT(DISTINCT rl.member_card_number) AS active_readers_count,
                COUNT(DISTINCT CASE WHEN DATEDIFF('2026-06-02', rl.action_date) > rc.max_days AND rl.action_status = 'borrowed' THEN rl.member_card_number END) AS overdue_readers_count
            FROM distribution_points dp
            LEFT JOIN book_inventories bi ON dp.distribution_point_id = bi.distribution_point_id
            LEFT JOIN reader_logs rl ON bi.inventory_id = rl.book_inventory_id
            LEFT JOIN library_members lm ON rl.member_card_number = lm.card_number
            LEFT JOIN reader_categories rc ON lm.reader_category_id = rc.category_id
            GROUP BY dp.distribution_point_id, dp.name
            ORDER BY total_unpaid_fines DESC;"; 

        using (var connection = new MySqlConnection(this.ConnectionString))
        {
            using (var command = new MySqlCommand(query, connection))
            {
                connection.Open();

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        analyticsList.Add(new DistributionPointAnalyticsDto
                        {
                            PointName = reader["point_name"].ToString()!,
                            TotalUnpaidFines = Convert.ToDecimal(reader["total_unpaid_fines"]),
                            ActiveReadersCount = Convert.ToInt32(reader["active_readers_count"]),
                            OverdueReadersCount = Convert.ToInt32(reader["overdue_readers_count"])
                        });
                    }
                }
            }
        }

        return analyticsList;
    }



    public List<InterlibraryLoanReportDto> GetInterlibraryLoans(int months)
    {
        var loansList = new List<InterlibraryLoanReportDto>();

        string query = @"
            SELECT il.loan_id, COALESCE(b.title, il.raw_title) AS book_title, il.external_library_name, il.request_date, il.status
            FROM interlibrary_loans il
            LEFT JOIN books b ON il.book_id = b.book_id
            WHERE il.request_date >= DATE_SUB('2026-06-02', INTERVAL @Months MONTH);";

        using (var connection = new MySqlConnection(this.ConnectionString))
        {
            using (var command = new MySqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@Months", months);
                connection.Open();

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        loansList.Add(new InterlibraryLoanReportDto
                        {
                            LoanId = Convert.ToInt32(reader["loan_id"]),
                            BookTitle = reader["book_title"].ToString()!,
                            ExternalLibraryName = reader["external_library_name"].ToString()!,
                            RequestDate = Convert.ToDateTime(reader["request_date"]),
                            Status = reader["status"].ToString()!
                        });
                    }
                }
            }
        }

        return loansList;
    }




    public ReaderBooksReportDto GetReaderBooksReport(int cardNumber, int months)
    {
        var report = new ReaderBooksReportDto();

        string queryOnHands = @"
            SELECT b.title, b.author, rl.action_date
            FROM reader_logs rl
            JOIN book_inventories bi ON rl.book_inventory_id = bi.inventory_id
            JOIN books b ON bi.book_id = b.book_id
            WHERE rl.member_card_number = @CardNumber AND rl.action_status = 'borrowed'
            AND NOT EXISTS (
                SELECT 1 FROM reader_logs rl_sub 
                WHERE rl_sub.book_inventory_id = rl.book_inventory_id 
                    AND rl_sub.member_card_number = rl.member_card_number
                    AND rl_sub.action_status IN ('returned', 'lost') AND rl_sub.action_date >= rl.action_date
            );";


        string queryHistory = @"
            SELECT b.title, b.author, rl.action_date
            FROM reader_logs rl
            JOIN book_inventories bi ON rl.book_inventory_id = bi.inventory_id
            JOIN books b ON bi.book_id = b.book_id
            WHERE rl.member_card_number = @CardNumber 
            AND rl.action_status = 'borrowed'
            AND rl.action_date >= DATE_SUB('2026-06-02', INTERVAL @Months MONTH)
            ORDER BY rl.action_date DESC;";

        using (var connection = new MySqlConnection(this.ConnectionString))
        {
            connection.Open();

            using (var cmdOnHands = new MySqlCommand(queryOnHands, connection))
            {
                cmdOnHands.Parameters.AddWithValue("@CardNumber", cardNumber);
                using (var reader = cmdOnHands.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        report.BooksOnHands.Add(new ReaderBookItemDto {
                            Title = reader["title"].ToString()!,
                            Author = reader["author"].ToString()!,
                            ActionDate = Convert.ToDateTime(reader["action_date"])
                        });
                    }
                }
            }


            using (var cmdHistory = new MySqlCommand(queryHistory, connection))
            {
                cmdHistory.Parameters.AddWithValue("@CardNumber", cardNumber);
                cmdHistory.Parameters.AddWithValue("@Months", months);
                using (var reader = cmdHistory.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        report.OrderHistory.Add(new ReaderBookItemDto {
                            Title = reader["title"].ToString()!,
                            Author = reader["author"].ToString()!,
                            ActionDate = Convert.ToDateTime(reader["action_date"])
                        });
                    }
                }
            }
        }

        return report;
    }




    public List<BookHoldersReportDto> GetBookHolders(string bookTitle)
    {
        var holdersList = new List<BookHoldersReportDto>();

        string query = @"
            SELECT lm.full_name AS reader_name, lm.card_number, rl.action_date AS borrow_date,
                DATE_ADD(rl.action_date, INTERVAL rc.max_days DAY) AS return_deadline
            FROM reader_logs rl
            JOIN library_members lm ON rl.member_card_number = lm.card_number
            JOIN reader_categories rc ON lm.reader_category_id = rc.category_id
            JOIN book_inventories bi ON rl.book_inventory_id = bi.inventory_id
            JOIN books b ON bi.book_id = b.book_id
            WHERE b.title LIKE @BookTitle AND rl.action_status = 'borrowed'
            AND NOT EXISTS (
                SELECT 1 FROM reader_logs rl_sub 
                WHERE rl_sub.book_inventory_id = rl.book_inventory_id 
                    AND rl_sub.member_card_number = rl.member_card_number
                    AND rl_sub.action_status IN ('returned', 'lost') AND rl_sub.action_date >= rl.action_date
            )
            ORDER BY return_deadline ASC;";

        using (var connection = new MySqlConnection(this.ConnectionString))
        {
            using (var command = new MySqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@BookTitle", "%" + bookTitle + "%");
                connection.Open();

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        holdersList.Add(new BookHoldersReportDto
                        {
                            ReaderName = reader["reader_name"].ToString()!,
                            CardNumber = Convert.ToInt32(reader["card_number"]),
                            BorrowDate = Convert.ToDateTime(reader["borrow_date"]),
                            ReturnDeadline = Convert.ToDateTime(reader["return_deadline"])
                        });
                    }
                }
            }
        }

        return holdersList;
    }


}

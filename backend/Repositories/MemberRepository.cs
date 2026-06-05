using MySql.Data.MySqlClient; 
using System;
using System.Collections.Generic;
using UniversityLibrary.Backend.DTOs.Reports.Members;

namespace UniversityLibrary.Backend.Repositories;

public class MemberRepository : IMemberRepository
{
    private string ConnectionString;

    public MemberRepository(string ConnectionString)
    {
        this.ConnectionString = ConnectionString;
    }

    public List<MemberListReportDto> GetMembersByDistributionPoint(int pointId)
    {
        var reportList = new List<MemberListReportDto>();

        string query = @"
            SELECT 
                lm.faculty, 
                lm.department, 
                lm.course, 
                lm.group_name,
                lm.card_number, 
                lm.full_name
            FROM library_members lm
            WHERE lm.card_number IN (
                SELECT DISTINCT rl.member_card_number 
                FROM reader_logs rl
                JOIN book_inventories bi ON rl.book_inventory_id = bi.inventory_id
                WHERE bi.distribution_point_id = @PointId
            )
            ORDER BY lm.faculty, lm.department, lm.course, lm.group_name;";

        using (var connection = new MySqlConnection(this.ConnectionString))
        {
            using (var command = new MySqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@PointId", pointId);
                connection.Open();

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var dto = new MemberListReportDto
                        {
                            Faculty = reader["faculty"].ToString()!,
                            Department = reader["department"].ToString()!,
                            Course = reader["course"] == DBNull.Value ? null : Convert.ToInt32(reader["course"]),
                            GroupName = reader["group_name"] == DBNull.Value ? null : reader["group_name"].ToString(),
                            CardNumber = Convert.ToInt32(reader["card_number"]),
                            FullName = reader["full_name"].ToString()!
                        };

                        reportList.Add(dto);
                    }
                }
            }
        }

        return reportList;
    }



    public List<SuspendedMemberReportDto> GetSuspendedMembersReport()
    {
        var suspendedList = new List<SuspendedMemberReportDto>();


        string query = @"
            SELECT 
                lm.faculty, lm.department, rc.name AS category,
                lm.full_name, lm.suspended_until
            FROM library_members lm
            JOIN reader_categories rc ON lm.reader_category_id = rc.category_id
            WHERE lm.is_suspended = TRUE 
            AND lm.suspended_until > DATE_ADD('2026-06-02', INTERVAL 2 MONTH)
            ORDER BY lm.faculty, rc.name;";

        using (var connection = new MySqlConnection(this.ConnectionString))
        {
            using (var command = new MySqlCommand(query, connection))
            {
                connection.Open();

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var dto = new SuspendedMemberReportDto
                        {
                            Faculty = reader["faculty"].ToString()!,
                            Department = reader["department"].ToString()!,
                            Category = reader["category"].ToString()!,
                            FullName = reader["full_name"].ToString()!,
                            SuspendedUntil = Convert.ToDateTime(reader["suspended_until"])
                        };

                        suspendedList.Add(dto);
                    }
                }
            }
        }

        return suspendedList;
    }



    public LibraryMovementReportDto GetLibraryMovementReport(int pointId, int months)
    {
        var report = new LibraryMovementReportDto();

        string queryNew = @"
            SELECT DISTINCT lm.faculty, lm.course, rc.name AS category, lm.card_number, lm.full_name, lm.registration_date
            FROM library_members lm
            JOIN reader_categories rc ON lm.reader_category_id = rc.category_id
            LEFT JOIN reader_logs rl ON lm.card_number = rl.member_card_number
            LEFT JOIN book_inventories bi ON rl.book_inventory_id = bi.inventory_id
            WHERE lm.registration_date >= DATE_SUB('2026-06-02', INTERVAL @Months MONTH)";
        
        if (pointId > 0) { queryNew += " AND bi.distribution_point_id = @PointId"; }

        string queryLeft = @"
            SELECT lm.faculty, COUNT(DISTINCT lm.card_number) AS left_count
            FROM library_members lm
            LEFT JOIN reader_logs rl ON lm.card_number = rl.member_card_number
            LEFT JOIN book_inventories bi ON rl.book_inventory_id = bi.inventory_id
            WHERE lm.exit_date >= DATE_SUB('2026-06-02', INTERVAL @Months MONTH)";
            
        if (pointId > 0) { queryLeft += " AND bi.distribution_point_id = @PointId"; }
        queryLeft += " GROUP BY lm.faculty;";

        using (var connection = new MySqlConnection(this.ConnectionString))
        {
            connection.Open();

            // Читаем новых
            using (var cmdNew = new MySqlCommand(queryNew, connection))
            {
                cmdNew.Parameters.AddWithValue("@Months", months);
                if (pointId > 0) cmdNew.Parameters.AddWithValue("@PointId", pointId);
                using (var reader = cmdNew.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        report.NewMembers.Add(new NewMemberDto {
                            Faculty = reader["faculty"].ToString()!,
                            Course = reader["course"] == DBNull.Value ? null : Convert.ToInt32(reader["course"]),
                            Category = reader["category"].ToString()!,
                            CardNumber = Convert.ToInt32(reader["card_number"]),
                            FullName = reader["full_name"].ToString()!,
                            RegistrationDate = Convert.ToDateTime(reader["registration_date"])
                        });
                    }
                }
            }

            using (var cmdLeft = new MySqlCommand(queryLeft, connection))
            {
                cmdLeft.Parameters.AddWithValue("@Months", months);
                if (pointId > 0) cmdLeft.Parameters.AddWithValue("@PointId", pointId);
                using (var reader = cmdLeft.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        report.LeftMembersByFaculty.Add(new LeftMemberCountDto {
                            Faculty = reader["faculty"].ToString()!,
                            Count = Convert.ToInt32(reader["left_count"])
                        });
                    }
                }
            }
        }
        return report;
    }




    public List<MemberFullInfoReportDto> GetMemberFullInfoByLastName(string lastName)
    {
        var resultList = new List<MemberFullInfoReportDto>();

        string query = @"
            SELECT 
                lm.full_name, lm.faculty, lm.course, lm.group_name,
                COUNT(CASE WHEN rl.action_status = 'lost' THEN 1 END) AS lost_books,
                SUM(IFNULL(rl.fine_amount, 0)) AS total_fines,
                SUM(CASE WHEN rl.is_fine_paid = FALSE THEN IFNULL(rl.fine_amount, 0) ELSE 0 END) AS fines_debt
            FROM library_members lm
            LEFT JOIN reader_logs rl ON lm.card_number = rl.member_card_number
            WHERE lm.full_name LIKE @LastName
            GROUP BY lm.card_number, lm.full_name, lm.faculty, lm.course, lm.group_name;";

        using (var connection = new MySqlConnection(this.ConnectionString))
        {
            using (var command = new MySqlCommand(query, connection))
            {

                command.Parameters.AddWithValue("@LastName", lastName + "%");
                connection.Open();

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var dto = new MemberFullInfoReportDto
                        {
                            FullName = reader["full_name"].ToString()!,
                            Faculty = reader["faculty"].ToString()!,
                            Course = reader["course"] == DBNull.Value ? null : Convert.ToInt32(reader["course"]),
                            GroupName = reader["group_name"] == DBNull.Value ? null : reader["group_name"].ToString(),
                            LostBooksCount = Convert.ToInt32(reader["lost_books"]),
                            TotalFines = Convert.ToDecimal(reader["total_fines"]),
                            ActiveFinesDebt = Convert.ToDecimal(reader["fines_debt"])
                        };

                        resultList.Add(dto);
                    }
                }
            }
        }

        return resultList;
    }


}

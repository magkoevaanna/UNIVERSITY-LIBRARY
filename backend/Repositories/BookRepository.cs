using MySql.Data.MySqlClient;
using UniversityLibrary.Backend.DTOs.Reports.Books;

namespace UniversityLibrary.Backend.Repositories;

public class BookRepository : IBookRepository
{
    private readonly string ConnectionString;

    public BookRepository(string connectionString)
    {
        ConnectionString = connectionString;
    }

    public List<TopBookReportDto> GetTopTwentyBooks()
    {
        var topBooks = new List<TopBookReportDto>();

        string query = @"
            SELECT b.isbn, b.title, b.author, COUNT(*) AS order_count
            FROM reader_logs rl
            JOIN book_inventories bi ON rl.book_inventory_id = bi.inventory_id
            JOIN books b ON bi.book_id = b.book_id
            WHERE rl.action_status IN ('reserved', 'borrowed')
            GROUP BY b.book_id, b.title, b.author
            ORDER BY order_count DESC
            LIMIT 20;";

        using (var connection = new MySqlConnection(ConnectionString))
        {
            using (var command = new MySqlCommand(query, connection))
            {
                connection.Open();

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var dto = new TopBookReportDto
                        {
                            BookId = reader["isbn"].ToString()!,
                            Title = reader["title"].ToString()!,
                            Author = reader["author"].ToString()!,
                            OrderCount = Convert.ToInt32(reader["order_count"])
                        };
                        topBooks.Add(dto);
                    }
                }
            }
        }

        return topBooks;
    }


    public BookMovementReportDto GetBookMovementReport(int pointId, string? author, int? releaseYear, int? arrivalYear)
    {
        var report = new BookMovementReportDto();

        string queryArrived = @"
            SELECT b.title, b.author, bi.arrival_date, dp.name AS location, b.release_year
            FROM book_inventories bi
            JOIN books b ON bi.book_id = b.book_id
            JOIN distribution_points dp ON bi.distribution_point_id = dp.distribution_point_id
            WHERE bi.arrival_date >= DATE_SUB('2026-06-02', INTERVAL 1 YEAR) ";

        if (pointId > 0) queryArrived += " AND bi.distribution_point_id = @PointId ";
        if (!string.IsNullOrEmpty(author)) queryArrived += " AND b.author LIKE @Author ";
        if (releaseYear > 0) queryArrived += " AND b.release_year = @ReleaseYear ";
        if (arrivalYear > 0) queryArrived += " AND YEAR(bi.arrival_date) = @ArrivalYear ";

        string queryLost = @"
            SELECT b.title, b.author, rl.action_date AS lost_date, rl.fine_amount
            FROM reader_logs rl
            JOIN book_inventories bi ON rl.book_inventory_id = bi.inventory_id
            JOIN books b ON bi.book_id = b.book_id
            WHERE rl.action_status = 'lost' AND rl.action_date >= DATE_SUB('2026-06-02', INTERVAL 1 YEAR) ";

        if (pointId > 0) queryLost += " AND bi.distribution_point_id = @PointId ";
        if (!string.IsNullOrEmpty(author)) queryLost += " AND b.author LIKE @Author ";
        if (releaseYear > 0) queryLost += " AND b.release_year = @ReleaseYear ";
        if (arrivalYear > 0) queryLost += " AND YEAR(bi.arrival_date) = @ArrivalYear ";

        using (var connection = new MySqlConnection(this.ConnectionString))
        {
            connection.Open();

            using (var cmd = new MySqlCommand(queryArrived, connection))
            {
                if (pointId > 0) cmd.Parameters.AddWithValue("@PointId", pointId);
                if (!string.IsNullOrEmpty(author)) cmd.Parameters.AddWithValue("@Author", author + "%");
                if (releaseYear > 0) cmd.Parameters.AddWithValue("@ReleaseYear", releaseYear);
                if (arrivalYear > 0) cmd.Parameters.AddWithValue("@ArrivalYear", arrivalYear);

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        report.ArrivedBooks.Add(new ArrivedBookDto {
                            Title = reader["title"].ToString()!,
                            Author = reader["author"].ToString()!,
                            ArrivalDate = Convert.ToDateTime(reader["arrival_date"]),
                            Location = reader["location"].ToString()!
                        });
                    }
                }
            }

            using (var cmd = new MySqlCommand(queryLost, connection))
            {
                if (pointId > 0) cmd.Parameters.AddWithValue("@PointId", pointId);
                if (!string.IsNullOrEmpty(author)) cmd.Parameters.AddWithValue("@Author", author + "%");
                if (releaseYear > 0) cmd.Parameters.AddWithValue("@ReleaseYear", releaseYear);
                if (arrivalYear > 0) cmd.Parameters.AddWithValue("@ArrivalYear", arrivalYear);

                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        report.LostBooks.Add(new LostBookDto {
                            Title = reader["title"].ToString()!,
                            Author = reader["author"].ToString()!,
                            LostDate = Convert.ToDateTime(reader["lost_date"]),
                            FineAmount = reader["fine_amount"] == DBNull.Value ? 0 : Convert.ToDecimal(reader["fine_amount"])
                        });
                    }
                }
            }
        }
        return report;
    }



    public List<BookCountReportDto> GetBookCountsReport(int pointId)
    {
        var countList = new List<BookCountReportDto>();

        string query = @"
            SELECT b.title, b.author, dp.name AS distribution_point, COUNT(bi.inventory_id) AS copies_count
            FROM book_inventories bi
            JOIN books b ON bi.book_id = b.book_id
            JOIN distribution_points dp ON bi.distribution_point_id = dp.distribution_point_id
            WHERE bi.status != 'lost' ";

        if (pointId > 0)
        {
            query += " AND bi.distribution_point_id = @PointId ";
        }

        query += " GROUP BY b.book_id, b.title, b.author, dp.distribution_point_id, dp.name;";

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
                        countList.Add(new BookCountReportDto
                        {
                            Title = reader["title"].ToString()!,
                            Author = reader["author"].ToString()!,
                            DistributionPoint = reader["distribution_point"].ToString()!,
                            CopiesCount = Convert.ToInt32(reader["copies_count"])
                        });
                    }
                }
            }
        }

        return countList;
    }




    public List<BookAvailabilityReportDto> GetBookAvailability(string title)
    {
        var resultList = new List<BookAvailabilityReportDto>();


        string query = @"
            SELECT b.title, dp.name AS subscription_name, COUNT(*) AS available_count
            FROM book_inventories bi
            JOIN books b ON bi.book_id = b.book_id
            JOIN distribution_points dp ON bi.distribution_point_id = dp.distribution_point_id
            WHERE b.title LIKE @Title 
            AND bi.status = 'available' 
            AND dp.type = 'subscription'
            GROUP BY b.title, dp.name;";

        using (var connection = new MySqlConnection(this.ConnectionString))
        {
            using (var command = new MySqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@Title", "%" + title + "%");
                connection.Open();

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        resultList.Add(new BookAvailabilityReportDto
                        {
                            Title = reader["title"].ToString()!,
                            SubscriptionName = reader["subscription_name"].ToString()!,
                            AvailableCount = Convert.ToInt32(reader["available_count"])
                        });
                    }
                }
            }
        }

        return resultList;
    }

}

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


    public BookMovementReportDto GetBookMovement(int? pointId, string? author, int? releaseYear, int? arrivalYear)
{
    var report = new BookMovementReportDto();

    // 1. ЗАПРОС ДЛЯ ПОСТУПИВШИХ КНИГ (Тут всё верно — bi.arrival_date)
    string queryArrived = @"
        SELECT b.title, b.author, bi.arrival_date, dp.name AS location
        FROM book_inventories bi
        JOIN books b ON bi.book_id = b.book_id
        JOIN distribution_points dp ON bi.distribution_point_id = dp.distribution_point_id
        WHERE bi.arrival_date >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
          AND (@PointId IS NULL OR bi.distribution_point_id = @PointId)
          AND (@Author IS NULL OR b.author LIKE CONCAT('%', @Author, '%'))
          AND (@ReleaseYear IS NULL OR b.publishing_year = @ReleaseYear) 
          AND (@ArrivalYear IS NULL OR YEAR(bi.arrival_date) = @ArrivalYear);";

    // 2. ЗАПРОС ДЛЯ УТЕРЯННЫХ КНИГ (Заменили rl.log_date на rl.action_date)
    string queryLost = @"
        SELECT b.title, b.author, rl.action_date AS lost_date, IFNULL(rl.fine_amount, 0) AS fine_amount
        FROM reader_logs rl
        JOIN book_inventories bi ON rl.book_inventory_id = bi.inventory_id
        JOIN books b ON bi.book_id = b.book_id
        WHERE rl.action_status = 'lost'
          AND rl.action_date >= DATE_SUB(NOW(), INTERVAL 1 YEAR) -- ИСПРАВЛЕНО НА action_date
          AND (@PointId IS NULL OR bi.distribution_point_id = @PointId)
          AND (@Author IS NULL OR b.author LIKE CONCAT('%', @Author, '%'))
          AND (@ReleaseYear IS NULL OR b.publishing_year = @ReleaseYear)
          AND (@ArrivalYear IS NULL OR YEAR(bi.arrival_date) = @ArrivalYear);";

    using (var connection = new MySqlConnection(ConnectionString))
    {
        connection.Open();

        // Читаем поступившие
        using (var command = new MySqlCommand(queryArrived, connection))
        {
            command.Parameters.AddWithValue("@PointId", (object?)pointId ?? DBNull.Value);
            command.Parameters.AddWithValue("@Author", string.IsNullOrEmpty(author) ? DBNull.Value : author);
            command.Parameters.AddWithValue("@ReleaseYear", (object?)releaseYear ?? DBNull.Value);
            command.Parameters.AddWithValue("@ArrivalYear", (object?)arrivalYear ?? DBNull.Value);

            using (var reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    report.ArrivedBooks.Add(new ArrivedBookDto
                    {
                        Title = reader["title"].ToString()!,
                        Author = reader["author"].ToString()!,
                        ArrivalDate = Convert.ToDateTime(reader["arrival_date"]),
                        Location = reader["location"].ToString()!
                    });
                }
            }
        }

        // Читаем утерянные
        using (var command = new MySqlCommand(queryLost, connection))
        {
            command.Parameters.AddWithValue("@PointId", (object?)pointId ?? DBNull.Value);
            command.Parameters.AddWithValue("@Author", string.IsNullOrEmpty(author) ? DBNull.Value : author);
            command.Parameters.AddWithValue("@ReleaseYear", (object?)releaseYear ?? DBNull.Value);
            command.Parameters.AddWithValue("@ArrivalYear", (object?)arrivalYear ?? DBNull.Value);

            using (var reader = command.ExecuteReader())
            {
                while (reader.Read())
                {
                    report.LostBooks.Add(new LostBookDto
                    {
                        Title = reader["title"].ToString()!,
                        Author = reader["author"].ToString()!,
                        LostDate = Convert.ToDateTime(reader["lost_date"]),
                        FineAmount = Convert.ToDecimal(reader["fine_amount"])
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

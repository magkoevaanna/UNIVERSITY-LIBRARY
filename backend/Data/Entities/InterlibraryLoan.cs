using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversityLibrary.Backend.Data.Entities;

[Table("interlibrary_loans")]
public class InterlibraryLoan
{
    [Key]
    [Column("loan_id")]
    public int LoanId { get; set; }

    [Column("book_id")]
    public int? BookId { get; set; }

    [ForeignKey(nameof(BookId))]
    public Book? Book { get; set; }

    [MaxLength(255)]
    [Column("raw_title")]
    public string? RawTitle { get; set; }

    [MaxLength(255)]
    [Column("raw_author")]
    public string? RawAuthor { get; set; }

    [Column("requesting_member_card_number")]
    public int RequestingMemberCardNumber { get; set; }

    [ForeignKey(nameof(RequestingMemberCardNumber))]
    public LibraryMember LibraryMember { get; set; } = null!;

    [Required]
    [MaxLength(255)]
    [Column("external_library_name")]
    public string ExternalLibraryName { get; set; } = null!;

    [Required]
    [MaxLength(50)]
    [Column("status")]
    public string Status { get; set; } = "pending"; // 'pending', 'approved', 'received', 'returned', 'rejected'

    [Column("request_date")]
    public DateTime RequestDate { get; set; }
}

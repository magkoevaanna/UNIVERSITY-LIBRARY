using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversityLibrary.Backend.Data.Entities;

[Table("reader_logs")]
public class ReaderLog
{
    [Key]
    [Column("log_id")]
    public int LogId { get; set; }

    [Column("book_inventory_id")]
    public int BookInventoryId { get; set; }

    [ForeignKey(nameof(BookInventoryId))]
    public BookInventory BookInventory { get; set; } = null!;

    [Column("member_card_number")]
    public int MemberCardNumber { get; set; }

    [ForeignKey(nameof(MemberCardNumber))]
    public LibraryMember LibraryMember { get; set; } = null!;

    [Required]
    [MaxLength(50)]
    [Column("action_status")]
    public string ActionStatus { get; set; } = "reserved"; // 'reserved', 'borrowed', 'returned', 'cancelled', 'lost'

    [Column("action_date")]
    public DateTime ActionDate { get; set; }

    [Column("fine_amount")]
    public decimal FineAmount { get; set; }

    [Column("is_fine_paid")]
    public bool IsFinePaid { get; set; }
}

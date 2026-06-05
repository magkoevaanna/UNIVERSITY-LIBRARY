using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversityLibrary.Backend.Data.Entities;

[Table("book_inventories")]
public class BookInventory
{
    [Key]
    [Column("inventory_id")]
    public int InventoryId { get; set; }

    [Column("book_id")]
    public int BookId { get; set; }

    [ForeignKey(nameof(BookId))]
    public Book Book { get; set; } = null!;

    [Column("distribution_point_id")]
    public int DistributionPointId { get; set; }

    [ForeignKey(nameof(DistributionPointId))]
    public DistributionPoint DistributionPoint { get; set; } = null!;

    [Column("arrival_date")]
    public DateTime ArrivalDate { get; set; }

    [Required]
    [MaxLength(50)]
    [Column("status")]
    public string Status { get; set; } = "available"; // 'available', 'borrowed', 'reserved', 'lost'

    public ICollection<ReaderLog> ReaderLogs { get; set; } = new List<ReaderLog>();
}

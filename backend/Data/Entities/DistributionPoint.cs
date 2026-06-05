using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversityLibrary.Backend.Data.Entities;

[Table("distribution_points")]
public class DistributionPoint
{
    [Key]
    [Column("distribution_point_id")]
    public int DistributionPointId { get; set; }

    [Required]
    [MaxLength(255)]
    [Column("name")]
    public string Name { get; set; } = null!;

    [Required]
    [MaxLength(50)]
    [Column("type")]
    public string Type { get; set; } = null!; // 'reading_room' или 'subscription'

    public ICollection<BookInventory> Inventories { get; set; } = new List<BookInventory>();
}

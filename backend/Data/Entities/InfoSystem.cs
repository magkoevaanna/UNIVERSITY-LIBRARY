using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversityLibrary.Backend.Data.Entities;

[Table("info_systems")]
public class InfoSystem
{
    [Key]
    [Column("system_id")]
    public int SystemId { get; set; }

    [Required]
    [MaxLength(255)]
    [Column("system_name")]
    public string SystemName { get; set; } = null!;

    [Required]
    [MaxLength(500)]
    [Column("access_url")]
    public string AccessUrl { get; set; } = null!;

    [Column("description")]
    public string? Description { get; set; }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversityLibrary.Backend.Data.Entities;

[Table("reader_categories")]
public class ReaderCategory
{
    [Key]
    [Column("category_id")]
    public int CategoryId { get; set; }

    [Required]
    [MaxLength(100)]
    [Column("name")]
    public string Name { get; set; } = null!;

    [Column("max_books")]
    public int MaxBooks { get; set; }

    [Column("max_days")]
    public int MaxDays { get; set; }

    [Column("can_take_home")]
    public bool CanTakeHome { get; set; }

    // Навигационное свойство
    public ICollection<LibraryMember> LibraryMembers { get; set; } = new List<LibraryMember>();
}

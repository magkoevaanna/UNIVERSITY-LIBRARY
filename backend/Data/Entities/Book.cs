using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversityLibrary.Backend.Data.Entities;

[Table("books")]
public class Book
{
    [Key]
    [Column("book_id")]
    public int BookId { get; set; }

    [Required]
    [MaxLength(50)]
    [Column("isbn")]
    public string Isbn { get; set; } = null!;

    [Required]
    [MaxLength(255)]
    [Column("title")]
    public string Title { get; set; } = null!;

    [Required]
    [MaxLength(255)]
    [Column("author")]
    public string Author { get; set; } = null!;

    [Column("publishing_year")]
    public int PublishingYear { get; set; }

    [MaxLength(500)]
    [Column("image_url")]
    public string? ImageUrl { get; set; }

    public ICollection<BookInventory> Inventories { get; set; } = new List<BookInventory>();
    public ICollection<Genre> Genres { get; set; } = new List<Genre>();
}

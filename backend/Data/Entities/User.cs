using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversityLibrary.Backend.Data.Entities;

[Table("users")]
public class User
{
    [Key]
    [Column("user_id")]
    public int UserId { get; set; }

    [Required]
    [MaxLength(255)]
    [Column("email")]
    public string Email { get; set; } = null!;

    [Required]
    [MaxLength(255)]
    [Column("password_hash")]
    public string PasswordHash { get; set; } = null!;

    [Column("library_member_card_number")]
    public int LibraryMemberCardNumber { get; set; }

    [ForeignKey(nameof(LibraryMemberCardNumber))]
    public LibraryMember LibraryMember { get; set; } = null!;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }
}

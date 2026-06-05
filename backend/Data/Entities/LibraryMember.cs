using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UniversityLibrary.Backend.Data.Entities;

[Table("library_members")]
public class LibraryMember
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    [Column("card_number")]
    public int CardNumber { get; set; }

    [Required]
    [MaxLength(255)]
    [Column("full_name")]
    public string FullName { get; set; } = null!;

    [Column("reader_category_id")]
    public int ReaderCategoryId { get; set; }

    [ForeignKey(nameof(ReaderCategoryId))]
    public ReaderCategory ReaderCategory { get; set; } = null!;

    [Required]
    [MaxLength(150)]
    [Column("faculty")]
    public string Faculty { get; set; } = null!;

    [Required]
    [MaxLength(150)]
    [Column("department")]
    public string Department { get; set; } = null!;

    [Column("course")]
    public int? Course { get; set; }

    [MaxLength(50)]
    [Column("group_name")]
    public string? GroupName { get; set; }

    [Column("is_suspended")]
    public bool IsSuspended { get; set; }

    [Column("suspended_until")]
    public DateTime? SuspendedUntil { get; set; }

    [Column("registration_date")]
    public DateTime RegistrationDate { get; set; }

    [Column("exit_date")]
    public DateTime? ExitDate { get; set; }

    public ICollection<ReaderLog> ReaderLogs { get; set; } = new List<ReaderLog>();
    public ICollection<InterlibraryLoan> InterlibraryLoans { get; set; } = new List<InterlibraryLoan>();
}

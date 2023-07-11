using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ContactsAPI.Models
{
    [Index(nameof(Email),IsUnique = true)]
    public class Contact
    {
        [Key]
        public int Id { get; set; }

        [StringLength(50)]
        public string? Name { get; set; }

        [StringLength(50)]
        public string? Surname { get; set; }

        [StringLength(80)]
        public string Email { get; set; }

        // 8-20 znaków
        // min 1 specjalny
        // min 2 cyfry
        // min 1 wielka
        [StringLength(100)]
        public string? Password { get; set; }
        [StringLength(50)]
        public string? Category { get; set; }

        [StringLength(20)]
        public string? PhoneNumber { get; set; }

        [DataType(DataType.Date)]
        [Column(TypeName = "Date")]
        public DateTime? BirthDate { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    [Table("Radnik")]
    public class Radnik
    {
        [Key]
        public int ID { get; set; }
        [Required]
        public int Jmbg { get; set; }
        [Required]
        [MaxLength(50)]
        public string Ime { get; set; }
        [Required]
        [MaxLength(50)]
        public string Prezime { get; set; }
        [Required]
        [MaxLength(50)]
        public string Senioritet { get; set; }
        [Required]
        [MaxLength(50)]
        public string Email { get; set; }

        [JsonIgnore]
        public List<Spoj>? RadnikTask { get; set; }
    }
}
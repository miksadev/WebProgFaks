using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models
{
    public class Task
    {
        [Key]
        public int ID { get; set; }
        [Required]
        [MaxLength(50)]
        public string Naziv { get; set; }
        [Required]
        [MaxLength(50)]
        public string Opis { get; set; }
        [Required]
        [Range(1, 3)]
        public int Tip { get; set; }

        [JsonIgnore]
        public List<Spoj>? TaskRadnik { get; set; }
    }
}
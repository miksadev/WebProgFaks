using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Models
{
    public class Spoj
    {
        [Key]
        public int ID { get; set; }

        [JsonIgnore]
        public Radnik Radnik { get; set; }

        public Task Task { get; set; }

    }
}
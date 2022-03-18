using Microsoft.EntityFrameworkCore;

namespace Models
{
    public class ProgramerskaFirmaContext : DbContext
    {
        public DbSet<Firma> Firme { get; set; }
        public DbSet<Radnik> Radnici { get; set; }
        public DbSet<Task> Taskovi { get; set; }
        public DbSet<Spoj> RadniciTaskovi { get; set; }

        public ProgramerskaFirmaContext(DbContextOptions options) : base(options)
        {

        }
    }
}
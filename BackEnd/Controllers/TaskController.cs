using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Models;
using Microsoft.EntityFrameworkCore;
namespace Projektic.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TaskController : ControllerBase
    {
        public ProgramerskaFirmaContext Context { get; set; }

        public TaskController(ProgramerskaFirmaContext context)
        {
            Context = context;
        }


        [Route("Task/{id}")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiTask(int id)
        {

            var task = Context.Taskovi.Where(p => p.ID == id).FirstOrDefault();
            return Ok(task);

        }

        [Route("PreuzmiTaskove")]
        [HttpGet]

        public async Task<ActionResult> Taskovi()
        {
            return Ok(await Context.Taskovi.Select(p => new { ID = p.ID, Naziv = p.Naziv }).ToListAsync());
        }


        [Route("DodajTask")]
        [HttpPost]
        public async Task<ActionResult> DodajTask([FromBody] Models.Task task)
        {
            if (string.IsNullOrWhiteSpace(task.Naziv) || task.Naziv.Length > 50)
            {
                return BadRequest("Pogresno uneseno naziv");
            }
            if (string.IsNullOrWhiteSpace(task.Opis) || task.Opis.Length > 50)
            {
                return BadRequest("Pogresno uneseno opis");
            }
            try
            {
                Context.Taskovi.Add(task);
                await Context.SaveChangesAsync();
                return Ok($"Task je dodat! ID je: {task.ID}");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("ObrisiTask/{id}")]
        [HttpDelete]

        public async Task<ActionResult> Izbrisi(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Los task id");
            }

            try
            {
                var task = await Context.Taskovi.FindAsync(id);
                var naziv = task.Naziv;
                Context.Taskovi.Remove(task);

                await Context.SaveChangesAsync();

                return Ok($"Uspesno izbrisan task: {naziv}");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("ObrisiTaskRadniku/{jmbg}/{idTaska}")]
        [HttpDelete]

        public async Task<ActionResult> IzbrisiTaskRadniku(int jmbg, int idTaska)
        {
            if (idTaska <= 0)
            {
                return BadRequest("Los task id");
            }
            var radnik = await Context.Radnici.Where(p => p.Jmbg == jmbg).FirstOrDefaultAsync();
            var imaVec = await Context.RadniciTaskovi.Where(p => (p.Radnik.ID == radnik.ID && p.Task.ID == idTaska)).FirstOrDefaultAsync();
            if (imaVec == null)
            {
                return BadRequest("Ne postoji task sa tim parametrima");
            }
            try
            {
                // var task = await Context.RadniciTaskovi.FindAsync(id);
                Context.RadniciTaskovi.Remove(imaVec);

                await Context.SaveChangesAsync();

                return Ok("Uspesno izbrisan task");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("DodajTaskRadniku/{jmbg}/{idTaska}")]
        [HttpPost]

        public async Task<ActionResult> DodajTaskRadniku(int jmbg, int idTaska)
        {
            if (jmbg <= 0)
            {
                return BadRequest("Pogresan jmbg");
            }
            var radnik = await Context.Radnici.Where(p => p.Jmbg == jmbg).FirstOrDefaultAsync();
            var imaVec = await Context.RadniciTaskovi.Where(p => (p.Radnik.ID == radnik.ID && p.Task.ID == idTaska)).FirstOrDefaultAsync();
            if (imaVec != null)
            {
                return BadRequest("Ne mozete dodati isti task dva puta istom korisniku");
            }
            try
            {
                var task = await Context.Taskovi.Where(p => p.ID == idTaska).FirstOrDefaultAsync();

                Spoj s = new Spoj
                {
                    Radnik = radnik,
                    Task = task,
                };

                Context.RadniciTaskovi.Add(s);
                await Context.SaveChangesAsync();

                var podaciORadniku = await Context.RadniciTaskovi
                .Include(p => p.Radnik)
                .Include(p => p.Task)
                // .Include(p => p.IspitniRok)
                .Where(p => p.Radnik.Jmbg == jmbg)
                .Select(p => new
                {
                    Jmbg = p.Radnik.Jmbg,
                    Ime = p.Radnik.Ime,
                    Prezime = p.Radnik.Prezime,
                    Task = p.Task.Naziv,
                    Opis = p.Task.Opis,
                }).ToListAsync();

                return Ok(podaciORadniku);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("PromeniTask/{id}/{ime}/{opis}/{tip}")]
        [HttpPut]
        public async Task<ActionResult> PromenitiRadnika(int id, string ime, string opis, int tip)
        {
            var task = Context.Taskovi.Where(p => p.ID == id).FirstOrDefault();
            if (task == null)
            {
                return BadRequest("Ne postoji task sa tim ID-om");
            }
            try
            {
                task.Naziv = ime;
                task.Opis = opis;
                task.Tip = tip;
                await Context.SaveChangesAsync();
                return Ok(task);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("RadniciTaskovi/{firma}")]
        [HttpGet]
        public async Task<ActionResult> Preuzmi(string firma)
        {
            try
            {
                var firmaJedna = await Context.Firme.Include(b => b.Radnici).FirstOrDefaultAsync(g => g.Ime == firma);
                var radnici = Context.Radnici
                    .Include(p => p.RadnikTask)/*.Where(p => p.ID == 12345}))*/
                    .ThenInclude(p => p.Task);

                var student = await radnici.ToListAsync();

                return Ok
                (
                    student.Select(p =>
                    new
                    {
                        Jmbg = p.Jmbg,
                        Ime = p.Ime,
                        Prezime = p.Prezime,
                        Email = p.Email,
                        Senioritet = p.Senioritet,
                        Taskovi = p.RadnikTask
                            .Select(q =>
                            new
                            {
                                id = q.Task.ID,
                                Task = q.Task.Naziv,
                                Opis = q.Task.Opis,
                                Tip = q.Task.Tip
                            })
                    }).ToList()
                );
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
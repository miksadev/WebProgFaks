using Microsoft.AspNetCore.Mvc;
using Models;
using Microsoft.EntityFrameworkCore;
namespace Projektic.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RadnikController : ControllerBase
    {
        public ProgramerskaFirmaContext Context { get; set; }

        public RadnikController(ProgramerskaFirmaContext context)
        {
            Context = context;
        }


        [Route("Radnici")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiRadnike()
        {

            // var radnik = await Context.Radnici.Where(p => p.Jmbg == 17954).ToListAsync();
            var radnik = await Context.Radnici.ToListAsync();
            return Ok(radnik);

        }


        [Route("Radnik/{jmbg}")]
        [HttpGet]
        public async Task<ActionResult> PreuzmiRadnika(int jmbg)
        {

            // var radnik = await Context.Radnici.Where(p => p.Jmbg == jmbg).ToListAsync();
            var radnik = Context.Radnici.Where(p => p.Jmbg == jmbg).FirstOrDefault();
            return Ok(radnik);

        }

        // [Route("Radnici")]
        // [HttpGet]
        // public async Task<ActionResult> Preuzmi([FromQuery] int[] rokIDs)
        // {
        //     var radnici = Context.Radnici
        //      .Include(p => p.RadnikPredmet)
        //      .ThenInclude(p => p.IspitniRok)
        //      .Include(p => p.RadnikPredmet)
        //      .ThenInclude(p => p.Predmet);


        //     var student = await radnici.Where(p => p.Jmbg == 17954).ToListAsync();
        //     return Ok(radnici.Select(p =>

        //     new
        //     {
        //         Jmbg = p.Jmbg,
        //         Ime = p.Ime,
        //         Prezime = p.Prezime,
        //         Predmeti = p.RadnikPredmet.Where(q => rokIDs.Contains(q.IspitniRok.ID)).Select(q => new
        //         {
        //             Predmet = q.Predmet.Naziv,
        //             GodinaPredmeta = q.Predmet.Godina,
        //             IspitniRok = q.IspitniRok.Naziv,
        //             Ocena = q.Ocena
        //         }).ToList()
        //     }));

        // }


        [Route("DodatiRadnika")]
        [HttpPost]
        public async Task<ActionResult> DodajRadnika([FromBody] DTONoviRadnik radnik)
        {
            var firma = Context.Firme.Where(p => p.Ime == radnik.FirmaIme).Include(p => p.Radnici).FirstOrDefault();
            if (radnik.Jmbg == 0 || radnik.Jmbg < 0)
            {
                return BadRequest("Pogresan Jmbg");
            }
            if (string.IsNullOrWhiteSpace(radnik.Ime) || radnik.Ime.Length > 50)
            {
                return BadRequest("Pogresno uneseno ime");
            }
            if (string.IsNullOrWhiteSpace(radnik.Prezime) || radnik.Prezime.Length > 50)
            {
                return BadRequest("Pogresno uneseno prezime");
            }
            if (firma == null)
            {
                return BadRequest("Ne postoji firma");
            }
            try
            {
                var r = new Radnik()
                {
                    Jmbg = radnik.Jmbg,
                    Ime = radnik.Ime,
                    Prezime = radnik.Prezime,
                    Senioritet = radnik.Senioritet,
                    Email = radnik.Email
                };
                Context.Radnici.Add(r);
                firma.Radnici.Add(r);
                await Context.SaveChangesAsync();
                return Ok(r);
            }
            catch (Exception e)
            {
                return BadRequest("Los radnik");
            }
        }

        [Route("PromenitiRadnika/{jmbg}/{ime}/{prezime}/{senioritet}/{email}")]
        [HttpPut]
        public async Task<ActionResult> PromenitiRadnika(int jmbg, string ime, string prezime, string senioritet, string email)
        {
            var radnik = Context.Radnici.Where(p => p.Jmbg == jmbg).FirstOrDefault();
            if (radnik == null)
            {
                return BadRequest("Ne postoji radnik sa tim jmbgom");
            }
            try
            {
                radnik.Ime = ime;
                radnik.Prezime = prezime;
                radnik.Senioritet = senioritet;
                radnik.Email = email;
                await Context.SaveChangesAsync();
                return Ok(radnik);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [Route("PromenaFromBody")]
        [HttpPut]
        public async Task<ActionResult> PromeniBody([FromBody] Radnik radnik)
        {
            if (radnik.ID <= 0)
            {
                return BadRequest("los indeks");
            }
            //Ostale provere

            try
            {
                Context.Radnici.Update(radnik);
                await Context.SaveChangesAsync();
                return Ok($"radnik sa ID: {radnik.ID} je uspesno izmenjen!");
            }
            catch (System.Exception)
            {

                throw;
            }
        }

        [Route("IzbrisatiRadnika/{jmbg}")]
        [HttpDelete]

        public async Task<ActionResult> Izbrisi(int jmbg)
        {

            if (jmbg <= 0)
            {
                return BadRequest("los jmbg");
            }
            //Ostale provere

            try
            {
                var radnik = Context.Radnici.Where(p => p.Jmbg == jmbg).FirstOrDefault();
                var jmbgProsli = radnik.Jmbg;
                Context.Radnici.Remove(radnik);

                await Context.SaveChangesAsync();

                return Ok($"Uspesno izbrisan radnik sa indeksom: {jmbgProsli}");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
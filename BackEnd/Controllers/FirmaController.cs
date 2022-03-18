using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Models;
using Microsoft.EntityFrameworkCore;
namespace Projektic.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FirmaController : ControllerBase
    {
        public ProgramerskaFirmaContext Context { get; set; }

        public FirmaController(ProgramerskaFirmaContext context)
        {
            Context = context;
        }


        [Route("SveFirme")]
        [HttpGet]
        public async Task<List<Firma>> SveFirme()
        {
            return await Context.Firme.Include(p => p.Radnici).ToListAsync();
        }

        [Route("Dodaj")]
        [HttpPost]
        public async Task<ActionResult> NovaFirma([FromBody] Firma firma)
        {
            var firma_naziv = Context.Firme.Where(p => p.Ime == firma.Ime).FirstOrDefault();

            if (firma_naziv != null)
            {
                return BadRequest("Vec postoji firma sa ovim imenom");
            }

            try
            {
                Context.Firme.Add(firma);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno dodata nova firma sa indeksom: {firma.ID}");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("Obrisi/{naziv}")]
        [HttpDelete]
        public async Task<ActionResult> ObrisiFirmu(string naziv)
        {
            var firma = await Context.Firme.Include(b => b.Radnici).FirstOrDefaultAsync(g => g.Ime == naziv);
            if (firma == null)
            {
                return BadRequest("Ne postoji firma sa ovim imenom");
            }
            try
            {
                if (firma.Radnici != null)
                    while (firma.Radnici.Count != 0)
                    {
                        Context.Radnici.Remove(firma.Radnici[0]);
                        firma.Radnici.RemoveAt(0);
                        await Context.SaveChangesAsync();
                    }
                Context.Remove(firma);
                await Context.SaveChangesAsync();
                return Ok($"Uspesno obrisana firma: {naziv}");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
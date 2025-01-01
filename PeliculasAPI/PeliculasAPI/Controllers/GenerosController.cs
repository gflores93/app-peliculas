using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using PeliculasAPI.Entidades;

namespace PeliculasAPI.Controllers
{
    [Route("api/generos")]
    [ApiController]
    public class GenerosController : ControllerBase
    {
        private readonly IRepositorio repositorio;
        private readonly IOutputCacheStore outputCacheStore;
        private readonly ServicioTransient transient1;
        private readonly ServicioTransient transient2;
        private readonly ServicioScoped scoped1;
        private readonly ServicioScoped scoped2;
        private readonly ServicioSingleton singleton;
        private readonly IConfiguration configuration;
        private const string cacheTag = "generos";

        public GenerosController(IRepositorio repositorio,
            IOutputCacheStore outputCacheStore,
            ServicioTransient transient1,
            ServicioTransient transient2,
            ServicioScoped scoped1,
            ServicioScoped scoped2,
            ServicioSingleton singleton,
            IConfiguration configuration)
        {
            this.repositorio = repositorio;
            this.outputCacheStore = outputCacheStore;
            this.transient1 = transient1;
            this.transient2 = transient2;
            this.scoped1 = scoped1;
            this.scoped2 = scoped2;
            this.singleton = singleton;
            this.configuration = configuration;
        }

        [HttpGet("ejemplo-proveedor-configuracion")]
        public string GetEjemploProveedorConfiguracion ()
        {
            return configuration.GetValue<string>("CadenaDeConexion")!;
        }

        [HttpGet("servicios-tiempos-de-vida")]
        public IActionResult GetServicioTiemposDeVida()
        {
            return Ok(new
            {
                Transients = new { transient1 = transient1.ObtenerId, transient2 = transient2.ObtenerId},
                Scoped = new { scoped1 = scoped1.ObtenerId, scoped2 = scoped2.ObtenerId },
                Singleton = new { singleton = singleton.ObtenerId },
            });
        }

        [HttpGet]
        [OutputCache(Tags = [cacheTag])]
        public ActionResult<List<Genero>> Get()
        {
            var generos = repositorio.ObtenerTodosLosGeneros();

            if (generos is null)
            {
                return NotFound();
            }
            return generos;
        }

        [HttpGet("{id}")]
        [OutputCache(Tags = [cacheTag])]
        public async Task<ActionResult<Genero>> Get(int id)
        {
            var genero = await repositorio.ObtenerPorId(id);

            if (genero is null)
            {
                return NotFound();
            }
            return genero;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Genero genero)
        {
            var yaExisteUnGeneroConDichoNombre = repositorio.Existe(genero.Nombre);

            if (yaExisteUnGeneroConDichoNombre)
            {
                return BadRequest($"Ya existe un genero con el nombre {genero.Nombre}");
            }

            repositorio.Crear(genero);
            await outputCacheStore.EvictByTagAsync(cacheTag, default); // limpieza de cache del tag generos
            return Ok();

        }

        [HttpPut]
        public void Put() { }

        [HttpDelete]
        public void Delete() { }

    }
}

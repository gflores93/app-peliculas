using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;
using PeliculasAPI.Utilidades;

namespace PeliculasAPI.Controllers
{
    [Route("api/generos")]
    [ApiController]
    public class GenerosController : ControllerBase
    {
        private readonly IOutputCacheStore _outputCacheStore;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private const string cacheTag = "generos";

        public GenerosController(
            IOutputCacheStore outputCacheStore,
            ApplicationDbContext context,
            IMapper mapper
        )
        {
            _outputCacheStore = outputCacheStore;
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        [OutputCache(Tags = [cacheTag])]
        public async Task<ActionResult<List<GeneroDTO>>> Get([FromQuery] PaginacionDTO paginacion)
        {
            var queryable = _context.Generos;
            await this.HttpContext.InsertarParametrosPaginacionEnCabecera(queryable); // extension method for HttpContext
            return await queryable
                .OrderBy(g => g.Nombre)
                .Paginar(paginacion) // extension method for IQueryable<T> 
                .ProjectTo<GeneroDTO>(_mapper.ConfigurationProvider) // only relevant properties used in query
                .ToListAsync();
        }

        [HttpGet("{id:int}", Name = "ObtenerGeneroPorId")]
        [OutputCache(Tags = [cacheTag])]
        public async Task<ActionResult<GeneroDTO>> Get(int id)
        {
            var genero = await _context.Generos
                .ProjectTo<GeneroDTO>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (genero == null)
            {
                return NotFound(new { Error = $"Id: {id} not found" });
            }
            return genero;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] GeneroCreacionDTO generoCreacionDTO)
        {
            //var genero = new Genero { Nombre = generoCreacionDTO.Nombre };
            var genero = _mapper.Map<Genero>(generoCreacionDTO);

            _context.Add(genero);
            await _context.SaveChangesAsync();
            await _outputCacheStore.EvictByTagAsync(cacheTag, default); // limpieza de cache del tag generos

            return CreatedAtRoute("ObtenerGeneroPorId", new { id = genero.Id }, genero);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromBody] GeneroCreacionDTO generoCreacionDTO)
        {
            var generoExiste = await _context.Generos.AnyAsync(g => g.Id == id);

            if(!generoExiste)
            {
                return NotFound(new { Error = $"Id: {id} not found" });
            }

            var genero = _mapper.Map<Genero>(generoCreacionDTO);
            genero.Id = id;

            _context.Update(genero);
            await _context.SaveChangesAsync();
            await _outputCacheStore.EvictByTagAsync(cacheTag, default); // limpieza de cache del tag generos

            return NoContent();


        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var registrosBorrados = await _context.Generos.Where(g => g.Id == id).ExecuteDeleteAsync();

            if (registrosBorrados == 0)
            {
                return NotFound();
            }

            await _outputCacheStore.EvictByTagAsync(cacheTag, default); // limpieza de cache del tag generos
            return NoContent();
        }

    }
}

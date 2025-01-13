using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;

namespace PeliculasAPI.Controllers
{
    [Route("api/generos")]
    [ApiController]
    public class GenerosController : CustomBaseController
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IOutputCacheStore _outputCacheStore;
        private const string cacheTag = "generos";

        public GenerosController(
            ApplicationDbContext context,
            IOutputCacheStore outputCacheStore,
            IMapper mapper)
            : base(context, mapper)
        {
            _context = context;
            _mapper = mapper;
            _outputCacheStore = outputCacheStore;
        }

        [HttpGet]
        [OutputCache(Tags = [cacheTag])]
        public async Task<List<GeneroDTO>> Get([FromQuery] PaginacionDTO paginacion)
        {
            return await base.Get<Genero, GeneroDTO>(paginacion, ordenarPor: g => g.Nombre);
        }

        [HttpGet("{id:int}", Name = "ObtenerGeneroPorId")]
        [OutputCache(Tags = [cacheTag])]
        public async Task<ActionResult<GeneroDTO>> Get([FromRoute] int id)
        {
            return await base.Get<Genero, GeneroDTO>(id);
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
        public async Task<IActionResult> Put([FromRoute] int id, [FromBody] GeneroCreacionDTO generoCreacionDTO)
        {
            var generoExiste = await _context.Generos.AnyAsync(g => g.Id == id);

            if (!generoExiste)
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
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var registrosBorrados = await _context.Generos.Where(g => g.Id == id).ExecuteDeleteAsync();

            if (registrosBorrados == 0)
            {
                return NotFound(new { Error = $"Id: {id} not found" });
            }

            await _outputCacheStore.EvictByTagAsync(cacheTag, default); // limpieza de cache del tag generos
            return NoContent();
        }

    }
}

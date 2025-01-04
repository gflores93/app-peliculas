using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;

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
        public async Task<ActionResult<List<GeneroDTO>>> Get()
        {
            // ProjectTo realizar el query sólo con las propiedades de GeneroDTO
            // así evitamos consultar todas las columnas de la tabla cuando el DTO no contiene todas esas propiedades
            return await _context.Generos.ProjectTo<GeneroDTO>(_mapper.ConfigurationProvider).ToListAsync();
        }

        [HttpGet("{id}", Name = "ObtenerGeneroPorId")]
        [OutputCache(Tags = [cacheTag])]
        public async Task<ActionResult<GeneroDTO>> Get(int id)
        {
            var genero = await _context.Generos.FindAsync(id);
            if (genero == null)
            {
                return NotFound();
            }
            return _mapper.Map<GeneroDTO>(genero);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] GeneroCreacionDTO generoCreacionDTO)
        {
            //var genero = new Genero { Nombre = generoCreacionDTO.Nombre };
            var genero = _mapper.Map<Genero>(generoCreacionDTO);
            _context.Add(genero);
            await _context.SaveChangesAsync();
            return CreatedAtRoute("ObtenerGeneroPorId", new { id = genero.Id }, genero);

        }

        [HttpPut]
        public void Put()
        {
            throw new NotImplementedException();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var genero = await _context.Generos.FindAsync(id);
            if (genero == null)
            {
                return NotFound();
            }
            _context.Generos.Remove(genero);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}

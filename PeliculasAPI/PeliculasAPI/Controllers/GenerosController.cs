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

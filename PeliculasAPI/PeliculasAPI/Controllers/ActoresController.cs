using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;
using PeliculasAPI.Servicios;
using PeliculasAPI.Utilidades;

namespace PeliculasAPI.Controllers
{
    [Route("api/actores")]
    [ApiController]
    public class ActoresController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IOutputCacheStore _outputCacheStore;
        private readonly IAlmacenadorArchivos _almacenadorArchivos;
        private const string cacheTag = "actores";
        private readonly string contenedor = "actores";


        public ActoresController(ApplicationDbContext context,
            IMapper mapper, 
            IOutputCacheStore outputCacheStore,
            IAlmacenadorArchivos almacenadorArchivos)
        {
            _context = context;
            _mapper = mapper;
            _outputCacheStore = outputCacheStore;
            _almacenadorArchivos = almacenadorArchivos;
        }

        [HttpGet]
        [OutputCache(Tags = [cacheTag])]
        public async Task<List<ActorDTO>> Get([FromQuery] PaginacionDTO paginacion)
        {
            var queryable = _context.Actores;
            await HttpContext.InsertarParametrosPaginacionEnCabecera(queryable);
            return await queryable
                .OrderBy(a => a.Nombre)
                .Paginar(paginacion)
                .ProjectTo<ActorDTO>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }


        [HttpGet("{id:int}", Name = "ObtenerActorPorId")]
        [OutputCache(Tags = [cacheTag])]
        public async Task<ActionResult<ActorDTO>> Get([FromRoute] int id)
        {
            var actor = await _context.Actores
                .ProjectTo<ActorDTO>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (actor is null)
            {
                return NotFound(new { Error = $"Id: {id} not found" });
            }
            return actor;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromForm] ActorCreacionDTO actorCreacionDTO)
        {
            var actor = _mapper.Map<Actor>(actorCreacionDTO);

            if (actorCreacionDTO.Foto is not null)
            {
                var url = await _almacenadorArchivos.Almacenar(contenedor, actorCreacionDTO.Foto);
                actor.Foto = url;
            }

            _context.Add(actor);
            await _context.SaveChangesAsync();
            await _outputCacheStore.EvictByTagAsync(cacheTag, default);

            return CreatedAtRoute("ObtenerActorPorId", new { id = actor.Id }, actor);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put([FromRoute] int id, [FromForm] ActorCreacionDTO actorCreacionDTO)
        {
            var actor = await _context.Actores.FirstOrDefaultAsync(a => a.Id == id);

            if (actor is null)
            {
                return NotFound(new { Error = $"Id: {id} not found" });
            }

            // Foto mapping is ignored in AutoMapper
            actor = _mapper.Map(actorCreacionDTO, actor);

            // undefined in FE if data type is string, as no new img was selected
            if (actorCreacionDTO.Foto is not null)
            {
                actor.Foto = await _almacenadorArchivos.Editar(actor.Foto, contenedor, actorCreacionDTO.Foto);
            }

            await _context.SaveChangesAsync();
            await _outputCacheStore.EvictByTagAsync(cacheTag, default);

            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var registrosBorrados = await _context.Actores.Where(a => a.Id == id).ExecuteDeleteAsync();

            if (registrosBorrados == 0)
            {
                return NotFound(new { Error = $"Id: {id} not found" });
            }

            await _outputCacheStore.EvictByTagAsync(cacheTag, default);
            return NoContent();
        }

    }
}

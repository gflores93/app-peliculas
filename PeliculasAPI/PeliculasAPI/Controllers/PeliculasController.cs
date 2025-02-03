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
    [Route("api/peliculas")]
    [ApiController]
    public class PeliculasController : CustomBaseController
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IOutputCacheStore _outputCacheStore;
        private readonly IAlmacenadorArchivos _almacenadorArchivos;
        private const string cacheTag = "peliculas";
        private readonly string contenedor = "peliculas";

        public PeliculasController(
            ApplicationDbContext context,
            IMapper mapper,
            IOutputCacheStore outputCacheStore,
            IAlmacenadorArchivos almacenadorArchivos)
            : base(context, mapper, outputCacheStore, cacheTag)
        {
            _context = context;
            _mapper = mapper;
            _outputCacheStore = outputCacheStore;
            _almacenadorArchivos = almacenadorArchivos;
        }

        [HttpGet("landing")]
        [OutputCache(Tags = [cacheTag])]
        public async Task<ActionResult<LandingPageDTO>> Get()
        {
            var top = 6;
            var hoy = DateTime.Now;

            var proximosEstrenos = await _context.Peliculas
                .Where(p => p.FechaLanzamiento > hoy)
                .OrderBy(p => p.FechaLanzamiento)
                .Take(top)
                .ProjectTo<PeliculaDTO>(_mapper.ConfigurationProvider)
                .ToListAsync();

            var enCines = await _context.Peliculas
                .Where(p => p.PeliculasCines.Select(pc => pc.PeliculaId).Contains(p.Id))
                .OrderBy(p => p.FechaLanzamiento)
                .Take(top)
                .ProjectTo<PeliculaDTO>(_mapper.ConfigurationProvider)
                .ToListAsync();

            var resultado = new LandingPageDTO();
            resultado.ProximosEstrenos = proximosEstrenos;
            resultado.EnCines = enCines;

            return resultado;
        }

        [HttpGet("{id:int}", Name = "ObtenerPeliculaPorId")]
        [OutputCache(Tags = [cacheTag])]
        public async Task<ActionResult<PeliculaDetallesDTO>> Get([FromRoute] int id)
        {
            var pelicula = await _context.Peliculas
                                 .ProjectTo<PeliculaDetallesDTO>(_mapper.ConfigurationProvider)
                                 .FirstOrDefaultAsync(p => p.Id == id);

            if (pelicula == null)
            {
                return NotFound(new { Error = $"Id: {id} not found" });
            }

            return pelicula;
        }

        [HttpGet("filtrar")]
        public async Task<ActionResult<List<PeliculaDTO>>> Filtrar([FromQuery] PeliculasFiltrarDTO peliculasFiltrarDTO)
        {
            var peliculasQueryable = _context.Peliculas.AsQueryable();

            if (!string.IsNullOrWhiteSpace(peliculasFiltrarDTO.Titulo))
            {
                peliculasQueryable = peliculasQueryable
                    .Where(p => p.Titulo.Contains(peliculasFiltrarDTO.Titulo));
            }

            if (peliculasFiltrarDTO.EnCines)
            {
                peliculasQueryable = peliculasQueryable
                    .Where(p => p.PeliculasCines.Select(pc => pc.PeliculaId).Contains(p.Id));
            }

            if (peliculasFiltrarDTO.ProximosEstrenos)
            {
                var hoy = DateTime.Today;
                peliculasQueryable = peliculasQueryable
                    .Where(p => p.FechaLanzamiento > hoy);
            }

            if (peliculasFiltrarDTO.GeneroId != 0)
            {
                peliculasQueryable = peliculasQueryable
                    .Where(p => p.PeliculasGeneros.Select(pg => pg.GeneroId).Contains(peliculasFiltrarDTO.GeneroId));
            }

            await HttpContext.InsertarParametrosPaginacionEnCabecera(peliculasQueryable);
            var peliculas = await peliculasQueryable.Paginar(peliculasFiltrarDTO.Paginacion)
                .ProjectTo<PeliculaDTO>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return peliculas;

        }


        [HttpGet("PostGet")]
        public async Task<ActionResult<PeliculasPostGetDTO>> PostGet()
        {
            var cines = await _context.Cines.ProjectTo<CineDTO>(_mapper.ConfigurationProvider).ToListAsync();
            var generos = await _context.Generos.ProjectTo<GeneroDTO>(_mapper.ConfigurationProvider).ToListAsync();

            return new PeliculasPostGetDTO
            {
                Cines = cines,
                Generos = generos
            };

        }

        [HttpPost]
        public async Task<IActionResult> Post([FromForm] PeliculaCreacionDTO peliculaCreacionDTO)
        {
            var pelicula = _mapper.Map<Pelicula>(peliculaCreacionDTO);
            if (peliculaCreacionDTO.Poster is not null)
            {
                var url = await _almacenadorArchivos.Almacenar(contenedor, peliculaCreacionDTO.Poster);
                pelicula.Poster = url;
            }

            AsignarOrdenActores(pelicula);
            _context.Add(pelicula);
            await _context.SaveChangesAsync();
            await _outputCacheStore.EvictByTagAsync(cacheTag, default);
            var peliculaDTO = _mapper.Map<PeliculaDTO>(pelicula);
            return CreatedAtRoute("ObtenerPeliculaPorId", new { id = pelicula.Id }, peliculaDTO);
        }

        [HttpGet("PutGet/{id:int}")]
        public async Task<ActionResult<PeliculasPutGetDTO>> PutGet([FromRoute] int id)
        {
            var pelicula = await _context.Peliculas
                                .ProjectTo<PeliculaDetallesDTO>(_mapper.ConfigurationProvider)
                                .FirstOrDefaultAsync(x => x.Id == id);

            if (pelicula == null)
            {
                return NotFound(new { Error = $"Id: {id} not found" });
            }

            var generosSeleccionadosIds = pelicula.Generos.Select(g => g.Id).ToList();
            var generosNoSeleccionados = await _context.Generos
                                               .Where(g => !generosSeleccionadosIds.Contains(g.Id))
                                               .ProjectTo<GeneroDTO>(_mapper.ConfigurationProvider)
                                               .ToListAsync();

            var cinesSeleccionadosIds = pelicula.Cines.Select(c => c.Id).ToList();
            var cinesNoSeleccionados = await _context.Cines
                                            .Where(c => !cinesSeleccionadosIds.Contains(c.Id))
                                            .ProjectTo<CineDTO>(_mapper.ConfigurationProvider)
                                            .ToListAsync();

            var respuesta = new PeliculasPutGetDTO();
            respuesta.Pelicula = pelicula;
            respuesta.GenerosSeleccionados = pelicula.Generos;
            respuesta.GenerosNoSeleccionados = generosNoSeleccionados;
            respuesta.CinesSeleccionados = pelicula.Cines;
            respuesta.CinesNoSeleccionados = cinesNoSeleccionados;
            respuesta.Actores = pelicula.Actores;

            return respuesta;
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put([FromRoute] int id, [FromForm] PeliculaCreacionDTO peliculaCreacionDTO)
        {
            var pelicula = await _context.Peliculas
                                 .Include(p => p.PeliculasGeneros)
                                 .Include(p => p.PeliculasCines)
                                 .Include(p => p.PeliculasActores)
                                 .FirstOrDefaultAsync(p => p.Id == id);

            if (pelicula == null)
            {
                return NotFound(new { Error = $"Id: {id} not found" });
            }

            // Al guardar se haría el cambio en Peliculas, PeliculasGeneros, PeliculasCines y PeliculasActores
            pelicula = _mapper.Map(peliculaCreacionDTO, pelicula);

            if (peliculaCreacionDTO.Poster is not null)
            {
                pelicula.Poster = await _almacenadorArchivos.Editar(pelicula.Poster, contenedor, peliculaCreacionDTO.Poster);
            }

            AsignarOrdenActores(pelicula);

            //_context.Update(pelicula); // not needed as _context already tracks changes of the tables
            await _context.SaveChangesAsync();
            await _outputCacheStore.EvictByTagAsync(cacheTag, default);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            return await base.Delete<Pelicula>(id);
        }

        private void AsignarOrdenActores(Pelicula pelicula)
        {
            // should have been assigned in the mapper PeliculaCreacionDTO to Pelicula
            if (pelicula.PeliculasActores is not null)
            {
                for (int i = 0; i < pelicula.PeliculasActores.Count(); i++)
                {
                    pelicula.PeliculasActores[i].Orden = i;
                }
            }
        }
    }
}

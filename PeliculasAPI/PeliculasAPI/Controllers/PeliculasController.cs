using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;
using PeliculasAPI.Servicios;

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

        [HttpGet("{id:int}", Name = "ObtenerPeliculaPorId")]
        public IActionResult Get(int id)
        {
            throw new NotImplementedException();
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

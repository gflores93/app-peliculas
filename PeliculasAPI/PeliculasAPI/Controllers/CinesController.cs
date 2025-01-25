using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;

namespace PeliculasAPI.Controllers
{
    [Route("api/cines")]
    [ApiController]
    public class CinesController : CustomBaseController
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IOutputCacheStore _outputCacheStore;
        private const string cacheTag = "cines";
        public CinesController(
            ApplicationDbContext context,
            IMapper mapper,
            IOutputCacheStore outputCacheStore)
            : base(context, mapper, outputCacheStore, cacheTag)
        {
            _context = context;
            _mapper = mapper;
            _outputCacheStore = outputCacheStore;
        }

        [HttpGet]
        [OutputCache(Tags = [cacheTag])]
        public async Task<List<CineDTO>> Get([FromQuery] PaginacionDTO paginacion)
        {
            return await base.Get<Cine, CineDTO>(paginacion, ordenarPor: c => c.Nombre);
        }

        [HttpGet("{id:int}", Name = "ObtenerCinePorId")]
        [OutputCache(Tags = [cacheTag])]
        public async Task<ActionResult<CineDTO>> Get([FromRoute] int id)
        {
            return await base.Get<Cine, CineDTO>(id);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CineCreacionDTO cineCreacionDTO)
        {
            return await base.Post<CineCreacionDTO, Cine, CineDTO>(cineCreacionDTO, "ObtenerCinePorId");
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put([FromRoute] int id, [FromBody] CineCreacionDTO cineCreacionDTO)
        {
            return await base.Put<CineCreacionDTO, Cine>(id, cineCreacionDTO);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            return await base.Delete<Cine>(id);
        }

    }
}

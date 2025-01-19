using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;
using PeliculasAPI.Utilidades;
using System.Linq.Expressions;

namespace PeliculasAPI.Controllers
{
    public class CustomBaseController : ControllerBase

    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;
        private readonly IOutputCacheStore outputCacheStore;
        private readonly string cacheTag;

        public CustomBaseController(
            ApplicationDbContext context,
            IMapper mapper,
            IOutputCacheStore outputCacheStore,
            string cacheTag)
        {
            this.context = context;
            this.mapper = mapper;
            this.outputCacheStore = outputCacheStore;
            this.cacheTag = cacheTag;
        }

        protected async Task<List<TDTO>> Get<TEntidad, TDTO>(PaginacionDTO paginacion,
            Expression<Func<TEntidad, object>> ordenarPor)
            where TEntidad : class
        {
            var queryable = this.context.Set<TEntidad>().AsQueryable();
            await this.HttpContext.InsertarParametrosPaginacionEnCabecera(queryable); // extension method for HttpContext
            return await queryable
            .OrderBy(ordenarPor)
            .Paginar(paginacion) // extension method for IQueryable<T> 
            .ProjectTo<TDTO>(this.mapper.ConfigurationProvider) // only relevant properties used in query
            .ToListAsync();
        }

        protected async Task<ActionResult<TDTO>> Get<TEntidad, TDTO>(int id)
            where TEntidad : class, IId
            where TDTO : IId
        {
            var entidad = await this.context.Set<TEntidad>()
            .ProjectTo<TDTO>(this.mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(e => e.Id == id);

            if (entidad is null)
            {
                return NotFound(new { Error = $"Id: {id} not found" });
            }
            return entidad;
        }

        protected async Task<IActionResult> Post<TCreacionDTO, TEntidad, TDTO>
            (TCreacionDTO creacionDTO, string nombreRuta)
            where TEntidad : class, IId
        {
            var entidad = this.mapper.Map<TEntidad>(creacionDTO);
            this.context.Add(entidad);
            await this.context.SaveChangesAsync();
            await this.outputCacheStore.EvictByTagAsync(this.cacheTag, default); // limpieza de cache
            var entidadDTO = this.mapper.Map<TDTO>(entidad);
            return CreatedAtRoute(nombreRuta, new { id = entidad.Id }, entidadDTO);
        }

        protected async Task<IActionResult> Put<TCreacionDTO, TEntidad>(int id, TCreacionDTO creacionDTO)
            where TEntidad : class, IId
        {
            var entidadExiste = await this.context.Set<TEntidad>().AnyAsync(e => e.Id == id);

            if (!entidadExiste)
            {
                return NotFound(new { Error = $"Id: {id} not found" });
            }

            var entidad = this.mapper.Map<TEntidad>(creacionDTO);
            entidad.Id = id;

            this.context.Update(entidad);
            await this.context.SaveChangesAsync();
            await this.outputCacheStore.EvictByTagAsync(this.cacheTag, default); // limpieza de cache

            return NoContent();
        }

        protected async Task<IActionResult> Delete<TEntidad>(int id)
            where TEntidad : class, IId
        {
            var registrosBorrados = await this.context.Set<TEntidad>().Where(e => e.Id == id).ExecuteDeleteAsync();

            if (registrosBorrados == 0)
            {
                return NotFound(new { Error = $"Id: {id} not found" });
            }

            await this.outputCacheStore.EvictByTagAsync(this.cacheTag, default); // limpieza de cache del tag generos
            return NoContent();
        }
    }
}

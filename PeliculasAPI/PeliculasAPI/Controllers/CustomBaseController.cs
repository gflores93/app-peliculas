using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;
using PeliculasAPI.Utilidades;
using System.Linq.Expressions;

namespace PeliculasAPI.Controllers
{
    public class CustomBaseController : ControllerBase

    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CustomBaseController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        protected async Task<List<TDTO>> Get<TEntidad, TDTO>(PaginacionDTO paginacion,
            Expression<Func<TEntidad, object>> ordenarPor)
            where TEntidad : class
        {
            var queryable = _context.Set<TEntidad>().AsQueryable();
            await this.HttpContext.InsertarParametrosPaginacionEnCabecera(queryable); // extension method for HttpContext
            return await queryable
            .OrderBy(ordenarPor)
            .Paginar(paginacion) // extension method for IQueryable<T> 
            .ProjectTo<TDTO>(_mapper.ConfigurationProvider) // only relevant properties used in query
            .ToListAsync();
        }

        protected async Task<ActionResult<TDTO>> Get<TEntidad, TDTO>(int id)
            where TEntidad : class, IId
            where TDTO : IId
        {
            var entidad = await _context.Set<TEntidad>()
            .ProjectTo<TDTO>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(e => e.Id == id);

            if (entidad is null)
            {
                return NotFound(new { Error = $"Id: {id} not found" });
            }
            return entidad;
        }
    }
}

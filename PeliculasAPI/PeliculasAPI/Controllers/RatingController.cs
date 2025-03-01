using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;
using PeliculasAPI.Servicios;

namespace PeliculasAPI.Controllers
{
    [ApiController]
    [Route("api/rating")]
    public class RatingController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IServicioUsuarios servicioUsuarios;

        public RatingController(ApplicationDbContext context, IServicioUsuarios servicioUsuarios)
        {
            this.context = context;
            this.servicioUsuarios = servicioUsuarios;
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> Post([FromBody] RatingCreacionDTO ratingCreationDTO)
        {
            var usuarioId = await servicioUsuarios.ObtenerUsuarioId();

            var ratingActual = await context.RatingPeliculas
                .FirstOrDefaultAsync(x => x.PeliculaId == ratingCreationDTO.PeliculaId
                && x.UsuarioId == usuarioId);

            if (ratingActual is null)
            {
                var rating = new Rating()
                {
                    PeliculaId = ratingCreationDTO.PeliculaId,
                    Puntuacion = ratingCreationDTO.Puntuacion,
                    UsuarioId = usuarioId
                };

                context.Add(rating);
            }
            else
            {
                ratingActual.Puntuacion = ratingCreationDTO.Puntuacion;
            }

            await context.SaveChangesAsync();
            return NoContent();
        }


    }
}

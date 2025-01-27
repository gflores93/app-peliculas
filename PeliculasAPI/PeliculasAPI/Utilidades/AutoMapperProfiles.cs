using AutoMapper;
using NetTopologySuite.Geometries;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;

namespace PeliculasAPI.Utilidades
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles(GeometryFactory geometryFactory)
        {
            this.ConfigurarMapeoGeneros();
            this.ConfigurarMapeoActores();
            this.ConfigurarMapeoCines(geometryFactory);
            this.ConfigurarMapeoPeliculas();
        }

        private void ConfigurarMapeoGeneros()
        {
            CreateMap<GeneroCreacionDTO, Genero>();
            CreateMap<Genero, GeneroDTO>();
        }

        private void ConfigurarMapeoActores()
        {
            CreateMap<ActorCreacionDTO, Actor>()
                .ForMember(x => x.Foto, opciones => opciones.Ignore());
            CreateMap<Actor, ActorDTO>();
            CreateMap<Actor, PeliculaActorDTO>();

        }

        private void ConfigurarMapeoCines(GeometryFactory geometryFactory)
        {
            CreateMap<CineCreacionDTO, Cine>()
                .ForMember(x => x.Ubicacion, cineDTO => cineDTO.MapFrom(p =>
                geometryFactory.CreatePoint(new Coordinate(p.Longitud, p.Latitud))));
            CreateMap<Cine, CineDTO>()
                .ForMember(x => x.Longitud, cine => cine.MapFrom(p => p.Ubicacion.X))
                .ForMember(x => x.Latitud, cine => cine.MapFrom(p => p.Ubicacion.Y));
        }

        private void ConfigurarMapeoPeliculas()
        {
            CreateMap<PeliculaCreacionDTO, Pelicula>()
                .ForMember(x => x.Poster, opciones => opciones.Ignore())
                .ForMember(x => x.PeliculasGeneros, dto =>
                dto.MapFrom(p => p.GenerosIds!.Select(id => new PeliculaGenero { GeneroId = id })))
                .ForMember(x => x.PeliculasCines, dto =>
                dto.MapFrom(p => p.CinesIds!.Select(id => new PeliculaCine { CineId = id })))
                .ForMember(x => x.PeliculasActores, dto =>
                dto.MapFrom(p => p.Actores!.Select(actor => new PeliculaActor { ActorId = actor.Id, Personaje = actor.Personaje })));

            CreateMap<Pelicula, PeliculaDTO>();
            CreateMap<Pelicula, PeliculaDetallesDTO>()
                .ForMember(p => p.Generos, entidad => entidad.MapFrom(p => p.PeliculasGeneros))
                .ForMember(p => p.Cines, entidad => entidad.MapFrom(p => p.PeliculasCines))
                .ForMember(p => p.Actores, entidad => entidad.MapFrom(p => p.PeliculasActores.OrderBy(o => o.Orden)));

            // List types from Pelicula to PeliculaDetallesDTO
            CreateMap<PeliculaGenero, GeneroDTO>()
                .ForMember(g => g.Id, pg => pg.MapFrom(p => p.GeneroId))
                .ForMember(g => g.Nombre, pg => pg.MapFrom(p => p.Genero.Nombre));

            CreateMap<PeliculaCine, CineDTO>()
                .ForMember(c => c.Id, pc => pc.MapFrom(p => p.CineId))
                .ForMember(c => c.Nombre, pc => pc.MapFrom(p => p.Cine.Nombre))
                .ForMember(c => c.Longitud, pc => pc.MapFrom(p => p.Cine.Ubicacion.X))
                .ForMember(c => c.Latitud, pc => pc.MapFrom(p => p.Cine.Ubicacion.Y));

            CreateMap<PeliculaActor, PeliculaActorDTO>()
                .ForMember(a => a.Id, pa => pa.MapFrom(p => p.ActorId))
                .ForMember(a => a.Nombre, pa => pa.MapFrom(p => p.Actor.Nombre))
                .ForMember(a => a.Foto, pa => pa.MapFrom(p => p.Actor.Foto));

        }
    }
}

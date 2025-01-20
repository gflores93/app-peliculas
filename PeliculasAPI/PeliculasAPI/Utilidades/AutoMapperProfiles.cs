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
    }
}

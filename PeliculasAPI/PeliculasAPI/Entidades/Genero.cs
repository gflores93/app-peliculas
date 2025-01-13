using PeliculasAPI.Validaciones;
using System.ComponentModel.DataAnnotations;

namespace PeliculasAPI.Entidades
{
    public class Genero : IId
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "el campo {0} es requerido")]
        [StringLength(50, ErrorMessage = "el campo {0} debe tener {1} caracteres o menos")]
        [PrimeraLetraMayusculaAttribute]
        public required string Nombre { get; set; }

    }
}

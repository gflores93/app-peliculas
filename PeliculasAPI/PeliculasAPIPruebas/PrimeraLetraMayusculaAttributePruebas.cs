using PeliculasAPI.Validaciones;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PeliculasAPIPruebas
{
    [TestClass]
    public sealed class PrimeraLetraMayusculaAttributePruebas
    {
        [TestMethod]
        [DataRow("")]
        [DataRow("    ")]
        [DataRow(null)]
        // NombreMetodo_LoQueDebeHacer_BajoQueCondicion
        public void IsValid_DebeRetornarExitoso_SiElValorEsVacio(string valor)
        {
            // Preparar
            var primeraLetraMayusculaAttribute = new PrimeraLetraMayusculaAttribute();
            var validationContext = new ValidationContext(new object());

            // Probar
            var resultado = primeraLetraMayusculaAttribute.GetValidationResult(valor, validationContext);

            // Verificar
            Assert.AreEqual(expected: ValidationResult.Success, actual: resultado);
        }

        [TestMethod]
        [DataRow("Felipe")]
        public void IsValid_DebeRetornarExitoso_SiPrimeraLetraEsMayuscula(string valor)
        {
            // Preparar
            var primeraLetraMayusculaAttribute = new PrimeraLetraMayusculaAttribute();
            var validationContext = new ValidationContext(new object());

            // Probar
            var resultado = primeraLetraMayusculaAttribute.GetValidationResult(valor, validationContext);

            // Verificar
            Assert.AreEqual(expected: ValidationResult.Success, actual: resultado);
        }

        [TestMethod]
        [DataRow("felipe")]
        public void IsValid_DebeRetornarError_SiPrimeraLetraNoEsMayuscula(string valor)
        {
            // Preparar
            var primeraLetraMayusculaAttribute = new PrimeraLetraMayusculaAttribute();
            var validationContext = new ValidationContext(new object());

            // Probar
            var resultado = primeraLetraMayusculaAttribute.GetValidationResult(valor, validationContext);

            // Verificar
            Assert.AreEqual(expected: "La primera letra debe ser mayuscula", actual: resultado!.ErrorMessage);
        }
    }
}

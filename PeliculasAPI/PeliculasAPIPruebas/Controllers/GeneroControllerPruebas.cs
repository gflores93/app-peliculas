using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using NSubstitute;
using PeliculasAPI.Controllers;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;
using PeliculasAPIPruebas.Dobles;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PeliculasAPIPruebas.Controllers
{
    [TestClass]
    public sealed class GeneroControllerPruebas : BasePruebas
    {
        [TestMethod]
        public async Task Get_DevuelveTodosLosGeneros()
        {
            // Preparar
            var nombreDB = Guid.NewGuid().ToString();
            var contexto = ConstruirContext(nombreDB);
            var mapper = ConfigurarAutoMapper();
            IOutputCacheStore outputCacheStore = null!;

            contexto.Generos.Add(new Genero() { Nombre = "Género 1" });
            contexto.Generos.Add(new Genero() { Nombre = "Género 2" });
            await contexto.SaveChangesAsync();

            var contexto2 = ConstruirContext(nombreDB);
            var controller = new GenerosController(contexto2, mapper, outputCacheStore);

            // Probar
            var respuesta = await controller.Get();

            // Verificar
            Assert.AreEqual(expected: 2, actual: respuesta.Count);
        }

        [TestMethod]
        public async Task Get_DebeDevolver404_CuandoGeneroConIdNoExiste()
        {
            // Preparar
            var nombreDB = Guid.NewGuid().ToString();
            var contexto = ConstruirContext(nombreDB);
            var mapper = ConfigurarAutoMapper();
            IOutputCacheStore outputCacheStore = null!;

            var controller = new GenerosController(contexto, mapper, outputCacheStore);
            var id = 1;

            // Probar
            var respuesta = await controller.Get(id);

            // Verificar
            // return NotFound(); -> StatusCodeResult
            //var resultado = respuesta.Result as StatusCodeResult

            // return NotFound(new { Error = $"Id: {id} not found" }); -> NotFoundObjectResult
            var resultado = respuesta.Result as NotFoundObjectResult;
            Assert.AreEqual(expected: 404, actual: resultado!.StatusCode);
        }

        [TestMethod]
        public async Task Get_DebeDevolverGeneroCorrecto_CuandoGeneroConIdExiste()
        {
            // Preparar
            var nombreDB = Guid.NewGuid().ToString();
            var contexto = ConstruirContext(nombreDB);
            var mapper = ConfigurarAutoMapper();
            IOutputCacheStore outputCacheStore = null!;

            contexto.Generos.Add(new Genero() { Nombre = "Género 1" });
            contexto.Generos.Add(new Genero() { Nombre = "Género 2" });
            await contexto.SaveChangesAsync();

            var contexto2 = ConstruirContext(nombreDB);
            var controller = new GenerosController(contexto2, mapper, outputCacheStore);
            var id = 2;

            // Probar
            var respuesta = await controller.Get(id);

            // Verificar
            var resultado = respuesta.Value;
            Assert.AreEqual(expected: id, actual: resultado!.Id);
        }

        [TestMethod]
        public async Task Post_DebeCrearGenero_CuandoEnviamosGenero()
        {
            // Preparar
            var nombreDB = Guid.NewGuid().ToString();
            var contexto = ConstruirContext(nombreDB);
            var mapper = ConfigurarAutoMapper();
            IOutputCacheStore outputCacheStore = new OutputCacheStoreFalso();

            var nuevoGenero = new GeneroCreacionDTO() { Nombre = "Nuevo género" };
            var controller = new GenerosController(contexto, mapper, outputCacheStore);

            // Probar
            var respuesta = await controller.Post(nuevoGenero);

            // Verificar
            var resultado = respuesta as CreatedAtRouteResult;
            Assert.IsNotNull(resultado);

            var contexto2 = ConstruirContext(nombreDB);
            var cantidad = await contexto2.Generos.CountAsync();
            Assert.AreEqual(expected: 1, actual: cantidad);
        }

        private const string cacheTag = "generos";

        [TestMethod]
        public async Task Post_DebeLlamarEvictByTagAsync_CuandoEnviamosGenero()
        {
            // Preparar
            var nombreDB = Guid.NewGuid().ToString();
            var contexto = ConstruirContext(nombreDB);
            var mapper = ConfigurarAutoMapper();
            IOutputCacheStore outputCacheStore = Substitute.For<IOutputCacheStore>();

            var nuevoGenero = new GeneroCreacionDTO() { Nombre = "Nuevo género" };
            var controller = new GenerosController(contexto, mapper, outputCacheStore);

            // Probar
            var respuesta = await controller.Post(nuevoGenero);

            // Verificar
            await outputCacheStore.Received(1).EvictByTagAsync(cacheTag, default);
        }
    }
}

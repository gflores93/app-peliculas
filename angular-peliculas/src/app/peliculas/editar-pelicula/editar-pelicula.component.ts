import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { PeliculaCreacionDTO, PeliculaDTO } from '../peliculas';
import { FormularioPeliculasComponent } from "../formulario-peliculas/formulario-peliculas.component";
import { SelectorMultipleDTO } from '../../compartidos/componentes/selector-multiple/selector-multiple';
import { ActorAutocompleteDTO } from '../../actores/actores';
import { PeliculasService } from '../peliculas.service';
import { Router } from '@angular/router';
import { extraerErrores } from '../../compartidos/funciones/extraer-errores';
import { MostrarErroresComponent } from "../../compartidos/componentes/mostrar-errores/mostrar-errores.component";
import { CargandoComponent } from "../../compartidos/componentes/cargando/cargando.component";

@Component({
  selector: 'app-editar-pelicula',
  imports: [FormularioPeliculasComponent, MostrarErroresComponent, CargandoComponent],
  templateUrl: './editar-pelicula.component.html',
  styleUrl: './editar-pelicula.component.css'
})
export class EditarPeliculaComponent implements OnInit {

  ngOnInit(): void {
    this.peliculasService.actualizarGet(this.id).subscribe({
      next: modelo => {
        this.pelicula = modelo.pelicula;
        this.cinesSeleccionados = modelo.cinesSeleccionados.map(cine => {
          return <SelectorMultipleDTO>{ llave: cine.id, valor: cine.nombre }
        });
        this.cinesNoSeleccionados = modelo.cinesNoSeleccionados.map(cine => {
          return <SelectorMultipleDTO>{ llave: cine.id, valor: cine.nombre }
        });
        this.generosSeleccionados = modelo.generosSeleccionados.map(genero => {
          return <SelectorMultipleDTO>{ llave: genero.id, valor: genero.nombre }
        });
        this.generosNoSeleccionados = modelo.generosNoSeleccionados.map(genero => {
          return <SelectorMultipleDTO>{ llave: genero.id, valor: genero.nombre }
        });
        this.actoresSeleccionados = modelo.actores;
      },
      error: error => {
        const errores = extraerErrores(error);
        this.errores = errores;
        console.log(this.errores);
        this.router.navigate(['/']);
      }
    });
  }

  @Input({ transform: numberAttribute }) id!: number;

  peliculasService = inject(PeliculasService);
  router = inject(Router);
  errores: string[] = [];

  // usado en form
  pelicula!: PeliculaDTO;
  // usados en selector multiple
  generosSeleccionados!: SelectorMultipleDTO[];
  generosNoSeleccionados!: SelectorMultipleDTO[];
  cinesSeleccionados!: SelectorMultipleDTO[];
  cinesNoSeleccionados!: SelectorMultipleDTO[];
  // usado en autocomplete
  actoresSeleccionados!: ActorAutocompleteDTO[];

  guardarCambios(pelicula: PeliculaCreacionDTO) {
    this.peliculasService.actualizar(this.id, pelicula).subscribe({
      next: () =>  {
        this.router.navigate(['/']);
      },
      error: error => {
        const errores = extraerErrores(error);
        this.errores = errores;
      }
    });
  }
}

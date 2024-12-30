import { Component, Input, numberAttribute } from '@angular/core';
import { PeliculaCreacionDTO, PeliculaDTO } from '../peliculas';
import { FormularioPeliculasComponent } from "../formulario-peliculas/formulario-peliculas.component";

@Component({
  selector: 'app-editar-pelicula',
  imports: [FormularioPeliculasComponent],
  templateUrl: './editar-pelicula.component.html',
  styleUrl: './editar-pelicula.component.css'
})
export class EditarPeliculaComponent {
  @Input({ transform: numberAttribute }) id!: number;

  pelicula: PeliculaDTO =
    {
      id: 1,
      titulo: 'Spider-Man',
      fechaLanzamiento: new Date(2020, 12, 1),
      trailer: 'ABC',
      poster: 'https://upload.wikimedia.org/wikipedia/en/6/6c/Spider-Man_%282002_film%29_poster.jpg?20171215231428'
    };

  guardarCambios(pelicula: PeliculaCreacionDTO) {
    console.log('editando película', pelicula);
  }
}

import { Component, Input, numberAttribute } from '@angular/core';
import { PeliculaCreacionDTO, PeliculaDTO } from '../peliculas';
import { FormularioPeliculasComponent } from "../formulario-peliculas/formulario-peliculas.component";
import { SelectorMultipleDTO } from '../../compartidos/componentes/selector-multiple/selector-multiple';
import { ActorAutocompleteDTO } from '../../actores/actores';

@Component({
  selector: 'app-editar-pelicula',
  imports: [FormularioPeliculasComponent],
  templateUrl: './editar-pelicula.component.html',
  styleUrl: './editar-pelicula.component.css'
})
export class EditarPeliculaComponent {
  @Input({ transform: numberAttribute }) id!: number;

  // usado en form
  pelicula: PeliculaDTO =
    {
      id: 1,
      titulo: 'Spider-Man',
      fechaLanzamiento: new Date(2020, 12, 1),
      trailer: 'ABC',
      poster: 'https://upload.wikimedia.org/wikipedia/en/6/6c/Spider-Man_%282002_film%29_poster.jpg?20171215231428'
    };

  // usados en selector multiple
  generosSeleccionados: SelectorMultipleDTO[] = [
    { llave: 2, valor: 'Acción' },
  ];

  generosNoSeleccionados: SelectorMultipleDTO[] = [
    { llave: 1, valor: 'Drama' },
    { llave: 3, valor: 'Comedia' },
  ];

  cinesSeleccionados: SelectorMultipleDTO[] = [
    { llave: 2, valor: 'Blue Mall' }
  ];

  cinesNoSeleccionados: SelectorMultipleDTO[] = [
    { llave: 1, valor: 'Agora Mall' },
    { llave: 3, valor: 'Acropolis' },
  ];

  // usado en autocomplete
  actoresSeleccionados: ActorAutocompleteDTO[] = [
    {
      id: 2,
      nombre: 'Tom Hanks',
      personaje: 'Forrest Gump',
      foto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Tom_Hanks_TIFF_2019.jpg/220px-Tom_Hanks_TIFF_2019.jpg'
    },
  ];

  guardarCambios(pelicula: PeliculaCreacionDTO) {
    console.log('editando película', pelicula);
  }
}

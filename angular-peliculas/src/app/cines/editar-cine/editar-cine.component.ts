import { Component, Input, numberAttribute } from '@angular/core';
import { FormularioCinesComponent } from "../formulario-cines/formulario-cines.component";
import { CineCreacionDTO, CineDTO } from '../cines';

@Component({
  selector: 'app-editar-cine',
  imports: [FormularioCinesComponent],
  templateUrl: './editar-cine.component.html',
  styleUrl: './editar-cine.component.css'
})
export class EditarCineComponent {
  @Input({ transform: numberAttribute }) id!: number;

  cine: CineDTO = {
    id: 1,
    nombre: 'CineStar Erlangen',
    latitud: 49.59210628447327, 
    longitud: 11.005521370135664
  }

  guardarCambios(cine: CineCreacionDTO) {
    console.log('editando cine', cine);
  }
}


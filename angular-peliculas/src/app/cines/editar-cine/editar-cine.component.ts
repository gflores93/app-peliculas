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
    nombre: 'Cinepolis Manzanillo'
  }

  guardarCambios(cine: CineCreacionDTO) {
    console.log('editando cine', cine);
  }
}


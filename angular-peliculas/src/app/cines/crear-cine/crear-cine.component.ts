import { Component } from '@angular/core';
import { FormularioCinesComponent } from "../formulario-cines/formulario-cines.component";
import { CineCreacionDTO } from '../cines';

@Component({
  selector: 'app-crear-cine',
  imports: [FormularioCinesComponent],
  templateUrl: './crear-cine.component.html',
  styleUrl: './crear-cine.component.css'
})
export class CrearCineComponent {

  guardarCambios(cine: CineCreacionDTO) {
    console.log('creando cine', cine);
  }

}

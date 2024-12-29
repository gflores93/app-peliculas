import { Component, Input, numberAttribute } from '@angular/core';
import { ActorCreactionDTO, ActorDTO } from '../actores';
import { FormularioActoresComponent } from "../formulario-actores/formulario-actores.component";

@Component({
  selector: 'app-editar-actor',
  imports: [FormularioActoresComponent],
  templateUrl: './editar-actor.component.html',
  styleUrl: './editar-actor.component.css'
})
export class EditarActorComponent {
  @Input({ transform: numberAttribute }) id!: number;

  actor: ActorDTO = {
    id: 1,
    nombre: 'Actor 001',
    // fechaNacimiento: new Date('1993-12-15') // js transforms date into timezone (e.g. UTC-6)
    fechaNacimiento: new Date(1993, 11, 15) // months in js are from 0-11
  }

  guardarCambios(actor: ActorCreactionDTO) {
    console.log('editando actor', actor);
  }
}


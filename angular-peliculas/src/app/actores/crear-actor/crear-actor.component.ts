import { Component } from '@angular/core';
import { ActoresService } from '../actores.service';
import { CrearEntidadComponent } from "../../compartidos/componentes/crear-entidad/crear-entidad.component";
import { FormularioActoresComponent } from '../formulario-actores/formulario-actores.component';
import { SERVICIO_CRUD_TOKEN } from '../../compartidos/proveedores/proveedores';

@Component({
  selector: 'app-crear-actor',
  imports: [CrearEntidadComponent],
  templateUrl: './crear-actor.component.html',
  styleUrl: './crear-actor.component.css',
  providers: [
    { provide: SERVICIO_CRUD_TOKEN, useClass: ActoresService }
  ]
})
export class CrearActorComponent {
  formularioActores = FormularioActoresComponent; // es una referencia a la clase, no una instancia
}

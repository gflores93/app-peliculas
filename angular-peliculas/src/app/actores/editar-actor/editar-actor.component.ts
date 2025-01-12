import { Component, Input, numberAttribute } from '@angular/core';
import { FormularioActoresComponent } from "../formulario-actores/formulario-actores.component";
import { ActoresService } from '../actores.service';
import { SERVICIO_CRUD_TOKEN } from '../../compartidos/proveedores/proveedores';
import { EditarEntidadComponent } from "../../compartidos/componentes/editar-entidad/editar-entidad.component";

@Component({
  selector: 'app-editar-actor',
  imports: [EditarEntidadComponent],
  templateUrl: './editar-actor.component.html',
  styleUrl: './editar-actor.component.css',
  providers: [
    { provide: SERVICIO_CRUD_TOKEN, useClass: ActoresService }
  ]
})
export class EditarActorComponent {

  @Input({ transform: numberAttribute }) id!: number;
  formularioActores = FormularioActoresComponent;

}
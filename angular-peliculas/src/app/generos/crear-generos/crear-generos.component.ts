import { Component } from '@angular/core';
import { GenerosService } from '../generos.service';
import { FormularioGeneroComponent } from '../formulario-genero/formulario-genero.component';
import { CrearEntidadComponent } from "../../compartidos/componentes/crear-entidad/crear-entidad.component";
import { SERVICIO_CRUD_TOKEN } from '../../compartidos/proveedores/proveedores';

@Component({
  selector: 'app-crear-generos',
  imports: [CrearEntidadComponent],
  templateUrl: './crear-generos.component.html',
  styleUrl: './crear-generos.component.css',
  providers: [
    { provide: SERVICIO_CRUD_TOKEN, useClass: GenerosService }
  ]
})
export class CrearGenerosComponent {
  formularioGenero = FormularioGeneroComponent; // es una referencia a la clase, no una instancia
}


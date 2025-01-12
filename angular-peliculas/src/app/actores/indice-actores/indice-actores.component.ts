import { Component, inject } from '@angular/core';
import { ActoresService } from '../actores.service';
import { SERVICIO_CRUD_TOKEN } from '../../compartidos/proveedores/proveedores';
import { IndiceEntidadComponent } from '../../compartidos/componentes/indice-entidad/indice-entidad.component';

@Component({
  selector: 'app-indice-actores',
  imports: [IndiceEntidadComponent],
  templateUrl: './indice-actores.component.html',
  styleUrl: './indice-actores.component.css',
  providers: [
    { provide: SERVICIO_CRUD_TOKEN, useClass: ActoresService }
  ]
})
export class IndiceActoresComponent {}
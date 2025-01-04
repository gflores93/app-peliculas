import { Component, Input } from '@angular/core';
import { CargandoComponent } from "../cargando/cargando.component";

@Component({
  selector: 'app-listado-generico',
  imports: [CargandoComponent],
  templateUrl: './listado-generico.component.html',
  styleUrl: './listado-generico.component.css'
})
export class ListadoGenericoComponent {
  
  @Input({required: true}) listado: any;

}

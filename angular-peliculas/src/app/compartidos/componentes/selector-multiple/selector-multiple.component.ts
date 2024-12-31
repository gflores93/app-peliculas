import { Component, Input } from '@angular/core';
import { SelectorMultipleDTO } from './selector-multiple';

@Component({
  selector: 'app-selector-multiple',
  imports: [],
  templateUrl: './selector-multiple.component.html',
  styleUrl: './selector-multiple.component.css'
})
export class SelectorMultipleComponent {


  @Input({required: true}) seleccionados!: SelectorMultipleDTO[];
  @Input({required: true}) noSeleccionados!: SelectorMultipleDTO[];

  seleccionar(elemento: SelectorMultipleDTO, indice: number) {
    this.seleccionados.push(elemento);
    this.noSeleccionados.splice(indice, 1);
  }

  deseleccionar(elemento: SelectorMultipleDTO, indice: number) {
    this.noSeleccionados.push(elemento);
    this.seleccionados.splice(indice, 1);
  }

  seleccionarTodo() {
    this.seleccionados.push(...this.noSeleccionados);
    this.noSeleccionados.length = 0;
  }

  deseleccionarTodo() {
    this.noSeleccionados.push(...this.seleccionados);
    this.seleccionados.length = 0;
  }
}

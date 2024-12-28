import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-rating',
  imports: [MatIconModule, NgClass],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent {

  @Input({ required: true, transform: (valor: number) => Array(valor).fill(0) }) maximoRating!: number[];
  @Input() ratingSeleccionado: number = 0;

  @Output() votado = new EventEmitter<number>();

  ratingAnterior = 0;

  manejarMouseEnter(indice: number) {
    this.ratingSeleccionado = indice + 1;
  }

  manejarMouseLeave() {
    this.ratingSeleccionado = this.ratingAnterior !== 0 ? this.ratingAnterior : 0;
  }

  manejarClick(indice: number) {
    this.ratingSeleccionado = indice + 1;
    this.ratingAnterior = this.ratingSeleccionado;
    this.votado.emit(this.ratingSeleccionado);

  }


}

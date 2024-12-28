import { CurrencyPipe, DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ListadoGenericoComponent } from "../../compartidos/componentes/listado-generico/listado-generico.component";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-listado-peliculas',
  imports: [DatePipe, CurrencyPipe, NgOptimizedImage, ListadoGenericoComponent, MatButtonModule, MatIconModule],
  templateUrl: './listado-peliculas.component.html',
  styleUrl: './listado-peliculas.component.css'
})
export class ListadoPeliculasComponent {

  @Input({ required: true }) peliculas!: any[];

  agregarPelicula() {
    this.peliculas.push({
        titulo: 'Película Inception',
        fechaLanzamiento: new Date('2024-12-31'),
        precio: 500
      });
  }

  remover(pelicula: any) {
    const indice = this.peliculas.findIndex((peliculaActual: any) => peliculaActual.titulo == pelicula.titulo);
    this.peliculas.splice(indice, 1);
  }
}



import { CurrencyPipe, DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-listado-peliculas',
  imports: [DatePipe, CurrencyPipe, NgOptimizedImage],
  templateUrl: './listado-peliculas.component.html',
  styleUrl: './listado-peliculas.component.css'
})
export class ListadoPeliculasComponent {

  @Input({required: true}) peliculas!: any[];

}



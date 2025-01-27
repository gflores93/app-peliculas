import { Component, inject, OnInit } from '@angular/core';
import { ListadoPeliculasComponent } from "../peliculas/listado-peliculas/listado-peliculas.component";
import { PeliculasService } from '../peliculas/peliculas.service';
import { PeliculaDTO } from '../peliculas/peliculas';

@Component({
  selector: 'app-landing-page',
  imports: [ListadoPeliculasComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

  peliculasService = inject(PeliculasService);
 
  constructor() {
    this.peliculasService.obtenerLandingPage().subscribe({
      next: modelo => {
        this.peliculasEnCines = modelo.enCines;
        this.peliculasProximosEstrenos = modelo.proximosEstrenos;
      },
      error: error => {
        console.log('error', error);
      }
    });
  }
  peliculasEnCines!: PeliculaDTO[];
  peliculasProximosEstrenos!: PeliculaDTO[];

}

import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { PeliculasService } from '../peliculas.service';
import { PeliculaDTO } from '../peliculas';
import { CargandoComponent } from "../../compartidos/componentes/cargando/cargando.component";
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Coordenada } from '../../compartidos/componentes/mapa/coordenada';
import { MapaComponent } from "../../compartidos/componentes/mapa/mapa.component";
import { RatingService } from '../../rating/rating.service';
import Swal from 'sweetalert2';
import { SeguridadService } from '../../seguridad/seguridad.service';
import { RatingComponent } from "../../compartidos/componentes/rating/rating.component";

@Component({
  selector: 'app-detalle-pelicula',
  imports: [CargandoComponent, MatChipsModule, RouterLink, MapaComponent, RatingComponent],
  templateUrl: './detalle-pelicula.component.html',
  styleUrl: './detalle-pelicula.component.css'
})
export class DetallePeliculaComponent implements OnInit {

  ngOnInit(): void {
    this.loadData();
  }

  @Input({ transform: numberAttribute }) id!: number;
  pelicula!: PeliculaDTO;
  peliculasService = inject(PeliculasService);
  ratingService = inject(RatingService);
  seguridadService = inject(SeguridadService);
  // para permitir regresar una URL fuera del dominio valida
  sanitizer = inject(DomSanitizer);
  trailerURL!: SafeResourceUrl;
  coordenadas: Coordenada[] = [];

  generarURLYoutubeEmbed(url: string): SafeResourceUrl | string {
    if (!url) {
      return '';
    }

    var videoId = url.split('v=')[1];
    var posicionAmpersand = videoId.indexOf('&');
    if (posicionAmpersand !== -1) {
      videoId = videoId.substring(0, posicionAmpersand);
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`)
  }

  puntuar(puntuacion: number) {
    if (!this.seguridadService.estaLogueado()) {
      Swal.fire('Error', 'Debes loguearte para poder votar por una pelicula', 'error');
      return;
    }
    
    this.ratingService.puntuar(this.id, puntuacion).subscribe(() => {
      Swal.fire('Exitoso', 'Su voto ha sido recibido', 'success');
      this.loadData();
    });
  }

  loadData() {
    this.peliculasService.obtenerPorId(this.id).subscribe(pelicula => {
      // Due to deserialization, fechaLanzamiento is stored as a string
      pelicula.fechaLanzamiento = new Date(pelicula.fechaLanzamiento);
      this.pelicula = pelicula;
      this.trailerURL = this.generarURLYoutubeEmbed(pelicula.trailer);

      this.coordenadas = pelicula.cines!.map(cine => {
        return <Coordenada>{ latitud: cine.latitud, longitud: cine.longitud, texto: cine.nombre };
      });
    });
  }

}

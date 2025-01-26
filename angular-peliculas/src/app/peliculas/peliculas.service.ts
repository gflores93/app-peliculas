import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { PeliculaCreacionDTO, PeliculaDTO, PeliculasPostGetDTO } from './peliculas';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {

  constructor() { }

  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/peliculas';

  public crearGet(): Observable<PeliculasPostGetDTO> {
    return this.http.get<PeliculasPostGetDTO>(`${this.urlBase}/postget`);
  }

  public crear(pelicula: PeliculaCreacionDTO): Observable<PeliculaDTO> {
    const formData = this.construirFormData(pelicula);
    return this.http.post<PeliculaDTO>(this.urlBase, formData);
  }

  // public actualizar(id: number, actor: ActorCreacionDTO): Observable<any> {
  //   const formData = this.construirFormData(actor);
  //   return this.http.put(`${this.urlBase}/${id}`, formData);
  // }

  // public borrar(id: number): Observable<any> {
  //   return this.http.delete(`${this.urlBase}/${id}`);
  // }

  private construirFormData(pelicula: PeliculaCreacionDTO): FormData {
    const formData = new FormData();

    formData.append('titulo', pelicula.titulo);
    // 2024-01-01T12:00:00 -> 2024-01-01
    formData.append('fechaLanzamiento', pelicula.fechaLanzamiento.toISOString().split('T')[0]);

    if (pelicula.poster) {
      formData.append('poster', pelicula.poster);
    }

    if (pelicula.trailer) {
      formData.append('trailer', pelicula.trailer);
    }

    formData.append('generosIds', JSON.stringify(pelicula.generosIds));
    formData.append('cinesIds', JSON.stringify(pelicula.cinesIds));
    formData.append('actores', JSON.stringify(pelicula.actores));

    return formData;
  }

}

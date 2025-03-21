import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ActorAutocompleteDTO, ActorCreacionDTO, ActorDTO } from './actores';
import { PaginacionDTO } from '../compartidos/modelos/PaginacionDTO';
import { Observable } from 'rxjs';
import { construirQueryParams } from '../compartidos/funciones/construirQueryParams';
import { IServicioCRUD } from '../compartidos/interfaces/IServicioCRUD';

@Injectable({
  providedIn: 'root'
})
export class ActoresService implements IServicioCRUD<ActorDTO, ActorCreacionDTO>{

  constructor() { }
  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/actores';

  public obtenerPaginado(paginacion: PaginacionDTO): Observable<HttpResponse<ActorDTO[]>> {
    let queryParams = construirQueryParams(paginacion);
    return this.http.get<ActorDTO[]>(this.urlBase, { params: queryParams, observe: 'response' });
  }

  public obtenerPorId(id: number): Observable<ActorDTO> {
    return this.http.get<ActorDTO>(`${this.urlBase}/${id}`);
  }

  public obtenerPorNombre(nombre: string) : Observable<ActorAutocompleteDTO[]> {
    return this.http.get<ActorAutocompleteDTO[]>(`${this.urlBase}/${nombre}`);
  }

  public crear(actor: ActorCreacionDTO): Observable<ActorDTO> {
    const formData = this.construirFormData(actor);
    return this.http.post<ActorDTO>(this.urlBase, formData);
  }

  public actualizar(id: number, actor: ActorCreacionDTO): Observable<any> {
    const formData = this.construirFormData(actor);
    return this.http.put(`${this.urlBase}/${id}`, formData);
  }

  public borrar(id: number): Observable<any> {
    return this.http.delete(`${this.urlBase}/${id}`);
  }

  private construirFormData(actor: ActorCreacionDTO): FormData {
    const formData = new FormData();

    formData.append('nombre', actor.nombre);
    // 2024-01-01T12:00:00 -> 2024-01-01
    formData.append('fechaNacimiento', actor.fechaNacimiento.toISOString().split('T')[0]);

    if (actor.foto) {
      formData.append('foto', actor.foto);
    }

    return formData;
  }

}

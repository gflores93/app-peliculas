import { inject, Injectable } from '@angular/core';
import { IServicioCRUD } from '../compartidos/interfaces/IServicioCRUD';
import { CineCreacionDTO, CineDTO } from './cines';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginacionDTO } from '../compartidos/modelos/PaginacionDTO';
import { environment } from '../../environments/environment';
import { construirQueryParams } from '../compartidos/funciones/construirQueryParams';

@Injectable({
  providedIn: 'root'
})
export class CinesService implements IServicioCRUD<CineDTO, CineCreacionDTO> {

  constructor() { }

  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/cines';
  
  // HttpResponse included to access header data, observe: 'response' needed for that
  obtenerPaginado(paginacion: PaginacionDTO): Observable<HttpResponse<CineDTO[]>> {
    let queryParams = construirQueryParams(paginacion);
    return this.http.get<CineDTO[]>(this.urlBase, {params: queryParams, observe: 'response'});
  }
  obtenerPorId(id: number): Observable<CineDTO> {
    return this.http.get<CineDTO>(`${this.urlBase}/${id}`);
  }
  crear(cine: CineCreacionDTO): Observable<CineDTO> {
    return this.http.post<CineDTO>(this.urlBase, cine);
  }
  actualizar(id: number, cine: CineCreacionDTO): Observable<any> {
    return this.http.put(`${this.urlBase}/${id}`, cine);
  }
  borrar(id: number): Observable<any> {
    return this.http.delete(`${this.urlBase}/${id}`);
  }
}

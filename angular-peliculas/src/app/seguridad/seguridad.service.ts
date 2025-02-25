import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CredencialesUsuarioDTO, RespuestaAutenticacionDTO } from './seguridad';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  constructor() { }

  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/usuarios';
  private readonly llaveToken = 'token';
  private readonly llaveExpiracion = 'token-expiracion';

  registrar(credenciales: CredencialesUsuarioDTO) : Observable<RespuestaAutenticacionDTO> {
    return this.http.post<RespuestaAutenticacionDTO>(`${this.urlBase}/registrar`, credenciales)
    .pipe(
      tap(respuestaAtuenticacion => this.guardarToken(respuestaAtuenticacion))
    );
  }

  login(credenciales: CredencialesUsuarioDTO) : Observable<RespuestaAutenticacionDTO> {
    return this.http.post<RespuestaAutenticacionDTO>(`${this.urlBase}/login`, credenciales)
    .pipe(
      tap(respuestaAtuenticacion => this.guardarToken(respuestaAtuenticacion))
    );
  }

  guardarToken(respuestaAutenticacion: RespuestaAutenticacionDTO) {
    localStorage.setItem(this.llaveToken, respuestaAutenticacion.token);
    localStorage.setItem(this.llaveExpiracion, respuestaAutenticacion.expiracion.toString());
  }
  
  estaLogueado(): boolean {
    const token = localStorage.getItem(this.llaveToken);
    if (!token) {
      return false;
    }

    const expiracion = localStorage.getItem(this.llaveExpiracion)!;
    const expiracionFecha = new Date(expiracion);

    if (expiracionFecha <= new Date()) {
      this.logout();
      return false;
    }

    return true;
  }

  logout() {
    localStorage.removeItem(this.llaveToken);
    localStorage.removeItem(this.llaveExpiracion);
  }

  obtenerRol(): string {
    return '';
  }
}

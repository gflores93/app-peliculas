import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ListadoGenericoComponent } from '../../compartidos/componentes/listado-generico/listado-generico.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { PaginacionDTO } from '../../compartidos/modelos/PaginacionDTO';
import { UsuarioDTO } from '../seguridad';
import { SeguridadService } from '../seguridad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-indice-usuarios',
  imports: [RouterLink, ListadoGenericoComponent, SweetAlert2Module, MatPaginatorModule, MatTableModule, MatButtonModule],
  templateUrl: './indice-usuarios.component.html',
  styleUrl: './indice-usuarios.component.css'
})
export class IndiceUsuariosComponent {

  columnasAMostrar = ['email', 'acciones'];
  paginacion: PaginacionDTO = { pagina: 1, recordsPorPagina: 10 };
  cantidadTotalRegistros!: number;
  usuarios!: UsuarioDTO[];
  servicioSeguridad = inject(SeguridadService);
  router = inject(Router);

  constructor() {
    this.cargarRegistros();
  }

  cargarRegistros() {
    this.servicioSeguridad.obtenerUsuariosPaginado(this.paginacion)
      .subscribe(respuesta => {
        this.usuarios = respuesta.body as UsuarioDTO[];
        const cabecera = respuesta.headers.get('cantidad-total-registros') as string;
        this.cantidadTotalRegistros = parseInt(cabecera, 10);
      });
  }

  actualizarPaginacion(datos: PageEvent) {
    this.paginacion = { pagina: datos.pageIndex + 1, recordsPorPagina: datos.pageSize };
    this.cargarRegistros();
  }

  hacerAdmin(email: string) {
    const usuario: UsuarioDTO = { email: email };
    this.servicioSeguridad.hacerAdmin(usuario)
      .subscribe(() => {
        Swal.fire('Exitoso', `El usuario ${email} ahora es admin`, 'success');
      });
  }

  removerAdmin(email: string) {
    const usuarioLogueado = this.servicioSeguridad.obtenerCampoJWT('email');
    const usuario: UsuarioDTO = { email: email };
    this.servicioSeguridad.removerAdmin(usuario)
      .subscribe(() => {
        Swal.fire('Exitoso', `El usuario ${email} ya no es admin`, 'success');
        // TODO: refresh token, para determinar si el usuario es admin o no
        if (usuarioLogueado == email) {
          this.servicioSeguridad.logout();
        }
      });
  }

}

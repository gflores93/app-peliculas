import { Component, inject, Input } from '@angular/core';
import { PaginacionDTO } from '../../modelos/PaginacionDTO';
import { SERVICIO_CRUD_TOKEN } from '../../proveedores/proveedores';
import { HttpResponse } from '@angular/common/http';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ListadoGenericoComponent } from '../listado-generico/listado-generico.component';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-indice-entidad',
  imports: [RouterLink, MatButtonModule, ListadoGenericoComponent, MatTableModule, MatPaginatorModule, SweetAlert2Module, TitleCasePipe],
  templateUrl: './indice-entidad.component.html',
  styleUrl: './indice-entidad.component.css'
})
export class IndiceEntidadComponent<TDTO> {

  @Input({ required: true }) titulo!: string;
  @Input({ required: true }) rutaCrear!: string;
  @Input({ required: true }) rutaEditar!: string;
  @Input() columnasAMostrar: string[] = ['id', 'nombre', 'acciones'];
  entidades!: TDTO[];
  paginacion: PaginacionDTO = { pagina: 1, recordsPorPagina: 5 };
  cantidadTotalRegistros!: number;

  servicioCRUD = inject(SERVICIO_CRUD_TOKEN) as any;

  constructor() {
    this.cargarRegistros();
  }

  cargarRegistros() {
    this.servicioCRUD.obtenerPaginado(this.paginacion).subscribe({
      next: (respuesta: HttpResponse<TDTO[]>) => {
        this.entidades = respuesta.body as TDTO[];
        const cabecera = respuesta.headers.get('cantidad-total-registros') as string;
        this.cantidadTotalRegistros = parseInt(cabecera, 10); //decimal
      },
      error: (error: any) => console.log(error)
    });
  }

  actualizarPaginacion(datos: PageEvent) {
    this.paginacion = { pagina: datos.pageIndex + 1, recordsPorPagina: datos.pageSize };
    this.cargarRegistros();
  }

  borrarRegistro(id: number) {
    this.servicioCRUD.borrar(id).subscribe({
      next: () => {
        this.paginacion.pagina = 1;
        this.cargarRegistros();
      },
      error: (error: any) => console.log(error)
    });
  }

}

import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ActoresService } from '../actores.service';
import { ActorDTO } from '../actores';
import { ListadoGenericoComponent } from "../../compartidos/componentes/listado-generico/listado-generico.component";
import { MatTableModule } from '@angular/material/table';
import { HttpResponse } from '@angular/common/http';
import { PaginacionDTO } from '../../compartidos/modelos/PaginacionDTO';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-indice-actores',
  imports: [RouterLink, MatButtonModule, ListadoGenericoComponent, MatTableModule, MatPaginatorModule, SweetAlert2Module],
  templateUrl: './indice-actores.component.html',
  styleUrl: './indice-actores.component.css'
})
export class IndiceActoresComponent {

  private actoresService = inject(ActoresService);
  actores!: ActorDTO[];
  columnasAMostrar = ['id', 'nombre', 'acciones'];
  paginacion: PaginacionDTO = { pagina: 1, recordsPorPagina: 5 };
  cantidadTotalRegistros!: number;

  constructor() {
    this.cargarRegistros();
  }

  cargarRegistros() {
    this.actoresService.obtenerPaginado(this.paginacion)
      .subscribe({
        next: (respuesta: HttpResponse<ActorDTO[]>) => {
          this.actores = respuesta.body as ActorDTO[];
          const cabecera = respuesta.headers.get('cantidad-total-registros') as string;
          this.cantidadTotalRegistros = parseInt(cabecera, 10); // decimal
        },
        error: error => console.log(error)
      });
  }

  actualizarPaginacion(datos: PageEvent) {
    this.paginacion = { pagina: datos.pageIndex + 1, recordsPorPagina: datos.pageSize };
    this.cargarRegistros();
  }

  borrarRegistro(id: number) {
    this.actoresService.borrar(id).subscribe({
      next: () => {
        this.paginacion.pagina = 1;
        this.cargarRegistros();
      },
      error: error => console.log(error)
    });
  }
}

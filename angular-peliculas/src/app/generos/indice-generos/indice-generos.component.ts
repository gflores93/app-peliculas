import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { GenerosService } from '../generos.service';
import { environment } from '../../../environments/environment';
import { GeneroDTO } from '../generos';
import { ListadoGenericoComponent } from "../../compartidos/componentes/listado-generico/listado-generico.component";
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-indice-generos',
  imports: [RouterLink, MatButtonModule, ListadoGenericoComponent, MatTableModule],
  templateUrl: './indice-generos.component.html',
  styleUrl: './indice-generos.component.css'
})
export class IndiceGenerosComponent {

  private generosService = inject(GenerosService);
  generos!: GeneroDTO[];
  columnasAMostrar = ['id', 'nombre', 'acciones'];

  constructor() {
    this.generosService.obtenerTodos().subscribe({
        next: generos => this.generos = generos,
        error: error => console.log(error)
      });
  }
}

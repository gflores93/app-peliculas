import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { FormularioGeneroComponent } from "../formulario-genero/formulario-genero.component";
import { GeneroCreacionDTO, GeneroDTO } from '../generos';
import { GenerosService } from '../generos.service';
import { Router } from '@angular/router';
import { extraerErrores } from '../../compartidos/funciones/extraer-errores';
import { MostrarErroresComponent } from "../../compartidos/componentes/mostrar-errores/mostrar-errores.component";
import { CargandoComponent } from "../../compartidos/componentes/cargando/cargando.component";

@Component({
  selector: 'app-editar-genero',
  imports: [FormularioGeneroComponent, MostrarErroresComponent, CargandoComponent],
  templateUrl: './editar-genero.component.html',
  styleUrl: './editar-genero.component.css'
})
export class EditarGeneroComponent implements OnInit {

  ngOnInit(): void {
    this.generosService.obtenerPorId(this.id).subscribe({
      next: genero => { 
        this.genero = genero;
      },
      error: error => {
        const errores = extraerErrores(error);
        this.errores = errores;
      }
    });
  }

  private generosService = inject(GenerosService);
  private router = inject(Router);

  @Input({ transform: numberAttribute }) id!: number;
  genero?: GeneroDTO;
  errores: string[] = [];

  guardarCambios(genero: GeneroCreacionDTO) {
    this.generosService.actualizar(this.id, genero as GeneroCreacionDTO)
      .subscribe({
        next: () => {
          this.router.navigate(['/generos']);
        },
        error: error => {
          const errores = extraerErrores(error);
          this.errores = errores;
        }
      });

  }
}

import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { ActorCreacionDTO, ActorDTO } from '../actores';
import { FormularioActoresComponent } from "../formulario-actores/formulario-actores.component";
import { ActoresService } from '../actores.service';
import { Router } from '@angular/router';
import { extraerErrores } from '../../compartidos/funciones/extraer-errores';
import { MostrarErroresComponent } from "../../compartidos/componentes/mostrar-errores/mostrar-errores.component";
import { CargandoComponent } from "../../compartidos/componentes/cargando/cargando.component";

@Component({
  selector: 'app-editar-actor',
  imports: [FormularioActoresComponent, MostrarErroresComponent, CargandoComponent],
  templateUrl: './editar-actor.component.html',
  styleUrl: './editar-actor.component.css'
})
export class EditarActorComponent implements OnInit {

  ngOnInit(): void {
    this.actoresService.obtenerPorId(this.id).subscribe({
      next: actor => {
        this.actor = actor;
      },
      error: error => {
        const errores = extraerErrores(error);
        this.errores = errores;
      }
    });
  }

  private actoresService = inject(ActoresService);
  private router = inject(Router);
  @Input({ transform: numberAttribute }) id!: number;
  actor?: ActorDTO;
  errores: string[] = [];

  guardarCambios(actor: ActorCreacionDTO) {
    this.actoresService.actualizar(this.id, actor as ActorCreacionDTO)
      .subscribe({
        next: () => {
          this.router.navigate(['/actores']);
        },
        error: error => {
          const errores = extraerErrores(error);
          this.errores = errores;
        }
      });
  }
}


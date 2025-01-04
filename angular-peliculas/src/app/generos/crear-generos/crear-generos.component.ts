import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GeneroCreacionDTO } from '../generos';
import { FormularioGeneroComponent } from "../formulario-genero/formulario-genero.component";
import { GenerosService } from '../generos.service';
import { extraerErrores } from '../../compartidos/funciones/extraer-errores';
import { MostrarErroresComponent } from "../../compartidos/componentes/mostrar-errores/mostrar-errores.component";

@Component({
  selector: 'app-crear-generos',
  imports: [FormularioGeneroComponent, MostrarErroresComponent],
  templateUrl: './crear-generos.component.html',
  styleUrl: './crear-generos.component.css'
})
export class CrearGenerosComponent {

  private router = inject(Router);
  private generosService = inject(GenerosService);
  errores: string[] = [];

  guardarCambios(genero: GeneroCreacionDTO) {
    this.generosService.crear(genero).subscribe({
        next: genero => 
          { 
            console.log('creando el genero', genero);
            this.router.navigate(['/generos']);
          },
        error: error => 
        {
          const errores = extraerErrores(error);
          console.log('error al intentar crear el genero', errores);
          this.errores = errores;
        }
      });
  }

}

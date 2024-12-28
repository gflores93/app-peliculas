import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Router, RouterLink } from '@angular/router';
import { GeneroCreacionDTO } from '../generos';
import { FormularioGeneroComponent } from "../formulario-genero/formulario-genero.component";

@Component({
  selector: 'app-crear-generos',
  imports: [RouterLink, FormularioGeneroComponent],
  templateUrl: './crear-generos.component.html',
  styleUrl: './crear-generos.component.css'
})
export class CrearGenerosComponent {

  private router = inject(Router);

  guardarCambios(genero: GeneroCreacionDTO) {
    // TODO
    // this.router.navigate(['/generos']);
    console.log('creando el genero', genero);
  }

}

import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { GenerosService } from '../generos.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-indice-generos',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './indice-generos.component.html',
  styleUrl: './indice-generos.component.css'
})
export class IndiceGenerosComponent {

  private generosService = inject(GenerosService);

  constructor() {
    this.generosService.obtenerTodos().subscribe(
      {
        next: generos => console.log(generos),
        error: error => console.log(error)
      }
    );
  }
}

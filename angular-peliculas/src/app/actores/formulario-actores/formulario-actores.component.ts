import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-formulario-actores',
  imports: [RouterLink, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './formulario-actores.component.html',
  styleUrl: './formulario-actores.component.css'
})
export class FormularioActoresComponent {
  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    nombre: ['', {
      validators: [Validators.required]
    }],
    fechaNacimiento: new FormControl<Date | null>(null),
  });
  
}

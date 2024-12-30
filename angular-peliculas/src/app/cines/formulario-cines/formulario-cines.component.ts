import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { CineCreacionDTO, CineDTO } from '../cines';

@Component({
  selector: 'app-formulario-cines',
  imports: [RouterLink, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './formulario-cines.component.html',
  styleUrl: './formulario-cines.component.css'
})
export class FormularioCinesComponent implements OnInit {

  ngOnInit(): void {
    if (this.modelo !== undefined) {
      this.form.patchValue(this.modelo);
    }
  }

  private formBuilder = inject(FormBuilder);

  @Input() modelo?: CineDTO;

  @Output() posteoFormulario = new EventEmitter<CineCreacionDTO>();

  form = this.formBuilder.group({
    nombre: ['', { validators: [Validators.required] }]
  });

  obtenerErrorCampoNombre(): string {
    let nombre = this.form.controls.nombre; // acceso al campo, no al valor
    if (nombre.hasError('required')) {
      return 'El campo nombre es requerido';
    }
    return '';
  }

  guardarCambios() {
    if (!this.form.valid) {
      return;
    }
    const cine = this.form.value as CineCreacionDTO;
    this.posteoFormulario.emit(cine);
  }


}

import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActorCreactionDTO, ActorDTO } from '../actores';
import moment from 'moment';
import { fechaNoPuedeSerFutura } from '../../compartidos/componentes/funciones/validaciones';


@Component({
  selector: 'app-formulario-actores',
  imports: [RouterLink, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './formulario-actores.component.html',
  styleUrl: './formulario-actores.component.css'
})
export class FormularioActoresComponent implements OnInit{

  ngOnInit(): void {
    if(this.modelo !== undefined) {
      this.form.patchValue(this.modelo);
    }
  }

  private formBuilder = inject(FormBuilder);

  @Input() modelo?: ActorDTO;
  @Output() posteoFormulario = new EventEmitter<ActorCreactionDTO>();

  form = this.formBuilder.group({
    nombre: ['', {
      validators: [Validators.required]
    }],
    fechaNacimiento: new FormControl<Date | null>(null, {
      validators: [Validators.required, fechaNoPuedeSerFutura()]
    }),
  });

  obtenerErrorCampoNombre(): string {
    let nombre = this.form.controls.nombre; // acceso al campo, no al valor
    if (nombre.hasError('required')) {
      return 'El campo nombre es requerido';
    }
    return '';
  }

  obtenerErrorCampoFechaNacimiento(): string {
    let nombre = this.form.controls.fechaNacimiento; // acceso al campo, no al valor
    if (nombre.hasError('required')) {
      return 'El campo fecha nacimiento es requerido';
    }
    // validación creada por usuario
    if (nombre.hasError('futuro')) {
      return nombre.getError('futuro').mensaje;
    }
    return '';
  }

  guardarCambios() {
    if(!this.form.valid) {
      return;
    }
    const actor = this.form.value as ActorCreactionDTO;
    actor.fechaNacimiento = moment(actor.fechaNacimiento).toDate();
    this.posteoFormulario.emit(actor);
  }
  
}

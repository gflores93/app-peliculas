import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActorAutocompleteDTO } from '../actores';


@Component({
  selector: 'app-autocomplete-actores',
  imports: [ReactiveFormsModule, FormsModule, MatFormField, MatInputModule, MatButtonModule, MatIconModule, MatTableModule, MatAutocompleteModule, DragDropModule],
  templateUrl: './autocomplete-actores.component.html',
  styleUrl: './autocomplete-actores.component.css'
})
export class AutocompleteActoresComponent {

  control = new FormControl<string>('');

  actores: ActorAutocompleteDTO[] = [
    {
      id: 1,
      nombre: 'Tom Holland',
      personaje: '',
      foto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Tom_Holland_by_Gage_Skidmore.jpg/220px-Tom_Holland_by_Gage_Skidmore.jpg'
    },
    {
      id: 2,
      nombre: 'Tom Hanks',
      personaje: '',
      foto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Tom_Hanks_TIFF_2019.jpg/220px-Tom_Hanks_TIFF_2019.jpg'
    },
    {
      id: 3,
      nombre: 'Samuel L. Jackson',
      personaje: '',
      foto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/SamuelLJackson.jpg/220px-SamuelLJackson.jpg'
    },
  ];

  @Input({required: true}) actoresSeleccionados: ActorAutocompleteDTO[] = [];

  columnasAMostrar = ['imagen', 'nombre', 'personaje', 'acciones'];

  // referencia necesaria para renderizar tabla después de seleccionar
  @ViewChild(MatTable) table!: MatTable<ActorAutocompleteDTO>;

  actorSeleccionado(event: MatAutocompleteSelectedEvent) {
    const actor = event.option.value;
    if (!this.actoresSeleccionados.find(item => item.id === actor.id)) {
      this.actoresSeleccionados.push(actor);
    }
    this.control.patchValue('');

    if (this.table != undefined) {
      this.table.renderRows();
    }

  }

  finalizarArrastre(event: CdkDragDrop<any>) {
    moveItemInArray(this.actoresSeleccionados, event.previousIndex, event.currentIndex);
    this.table.renderRows();
  }

  eliminar(actor: ActorAutocompleteDTO) {
    const indice = this.actoresSeleccionados.findIndex((a: ActorAutocompleteDTO) => a.id === actor.id);
    actor.personaje = '';
    this.actoresSeleccionados.splice(indice, 1);
    this.table.renderRows();
  }
}

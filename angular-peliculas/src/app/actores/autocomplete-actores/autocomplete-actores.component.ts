import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActorAutocompleteDTO } from '../actores';
import { ActoresService } from '../actores.service';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';


@Component({
  selector: 'app-autocomplete-actores',
  imports: [ReactiveFormsModule, FormsModule, MatFormField, MatInputModule, MatButtonModule, MatIconModule, MatTableModule, MatAutocompleteModule, DragDropModule],
  templateUrl: './autocomplete-actores.component.html',
  styleUrl: './autocomplete-actores.component.css'
})
export class AutocompleteActoresComponent implements OnInit {

  ngOnInit(): void {
    this.control.valueChanges
      // Generic pipeline for handling de-bouncing, distinct input, and value filter
      .pipe(
        debounceTime(300), // Wait for the user to stop typing for 300ms
        distinctUntilChanged((prev, curr) => prev?.trim() === curr?.trim()),  // Only trigger if the trimmed values are different
        map(value => value?.trim())  
      )
      .subscribe(valor => {
        // empty string doesn't trigger request
        if (typeof valor === 'string' && valor) {
          this.actoresService.obtenerPorNombre(valor).subscribe(actores => {
            this.actores = actores;
          });

        }
      });
  }

  actoresService = inject(ActoresService);
  control = new FormControl<string>('');
  actores: ActorAutocompleteDTO[] = [];
  @Input({ required: true }) actoresSeleccionados: ActorAutocompleteDTO[] = [];
  columnasAMostrar = ['imagen', 'nombre', 'personaje', 'acciones'];
  // Referencia necesaria para renderizar tabla después de seleccionar
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

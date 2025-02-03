import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { debounceTime } from 'rxjs';
import { parseBoolean, parseNumber } from '../../compartidos/funciones/parse-types';
import { PaginacionDTO } from '../../compartidos/modelos/PaginacionDTO';
import { GeneroDTO } from '../../generos/generos';
import { PeliculaDTO } from '../peliculas';
import { GenerosService } from '../../generos/generos.service';
import { PeliculasService } from '../peliculas.service';
import { ListadoPeliculasComponent } from "../listado-peliculas/listado-peliculas.component";
import { FiltroPeliculas } from './filtro-peliculas';


@Component({
  selector: 'app-filtro-peliculas',
  imports: [ReactiveFormsModule, ListadoPeliculasComponent,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatSelectModule, MatCheckboxModule, MatPaginatorModule],
  templateUrl: './filtro-peliculas.component.html',
  styleUrl: './filtro-peliculas.component.css'
})
export class FiltroPeliculasComponent implements OnInit {

  ngOnInit(): void {
    this.generosService.obtenerTodos().subscribe(generos => {
      this.generos = generos;

      // When query params provided apply them to the form and request filtered data
      this.leerValoresURL();
      this.buscarPeliculas(this.form.value as FiltroPeliculas);

      // Wait for 300ms after change is made
      this.form.valueChanges
        .pipe(debounceTime(300))
        .subscribe((valores => {
          this.buscarPeliculas(valores as FiltroPeliculas);
          this.escribirParamsBusquedaEnURL(valores as FiltroPeliculas);
        }));
    });
  }

  private generosService = inject(GenerosService);
  private peliculasService = inject(PeliculasService);

  private formBuilder = inject(FormBuilder);
  private location = inject(Location);
  private activatedRoute = inject(ActivatedRoute);

  form = this.formBuilder.group({
    titulo: '',
    generoId: 0,
    proximosEstrenos: false,
    enCines: false
  });

  generos!: GeneroDTO[];
  peliculas!: PeliculaDTO[];
  paginacion: PaginacionDTO = { pagina: 1, recordsPorPagina: 10 }
  cantidadTotalRegistros!: number;

  buscarPeliculas(valores: FiltroPeliculas) {
    valores.pagina = this.paginacion.pagina;
    valores.recordsPorPagina = this.paginacion.recordsPorPagina;

    this.peliculasService.filtrar(valores).subscribe(respuesta => {
      this.peliculas = respuesta.body as PeliculaDTO[];
      const header = respuesta.headers.get('cantidad-total-registros') as string;
      this.cantidadTotalRegistros = parseInt(header, 10);
    });
  }

  escribirParamsBusquedaEnURL(valores: FiltroPeliculas) {
    let queryStrings = [];

    if (valores.titulo) {
      queryStrings.push(`titulo=${encodeURIComponent(valores.titulo)}`); //encode string to valid URI value
    }
    if (valores.generoId !== 0) {
      queryStrings.push(`generoId=${valores.generoId}`);
    }
    if (valores.proximosEstrenos) {
      queryStrings.push(`proximosEstrenos=${valores.proximosEstrenos}`);
    }
    if (valores.enCines) {
      queryStrings.push(`enCines=${valores.enCines}`);
    }

    // creamos el query string en base a los valores seleccionados en el formulario
    this.location.replaceState('peliculas/filtrar', queryStrings.join('&'));
  }

  leerValoresURL() {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      let objeto: any = {};

      if (params.titulo) {
        objeto.titulo = params.titulo;
      }

      if (params.generoId) {
        objeto.generoId = parseNumber(params.generoId);
      }

      if (params.proximosEstrenos) {
        objeto.proximosEstrenos = parseBoolean(params.proximosEstrenos);
      }

      if (params.enCines) {
        objeto.enCines = parseBoolean(params.enCines);
      }

      this.form.patchValue(objeto);
    });
  }

  limpiar() {
    this.form.patchValue({ titulo: '', generoId: 0, proximosEstrenos: false, enCines: false });
  }

  actualizarPaginacion(datos: PageEvent) {
    this.paginacion = { pagina: datos.pageIndex + 1, recordsPorPagina: datos.pageSize };
    this.buscarPeliculas(this.form.value as FiltroPeliculas);
  }
}

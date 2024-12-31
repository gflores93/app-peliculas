import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ListadoPeliculasComponent } from "../listado-peliculas/listado-peliculas.component";
import { FiltroPeliculas } from './filtro-peliculas';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { parseBoolean, parseNumber } from '../../compartidos/componentes/funciones/parse-types';


@Component({
  selector: 'app-filtro-peliculas',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatCheckboxModule, ListadoPeliculasComponent],
  templateUrl: './filtro-peliculas.component.html',
  styleUrl: './filtro-peliculas.component.css'
})
export class FiltroPeliculasComponent implements OnInit {

  ngOnInit(): void {

    // in case the page was loaded with query params we need to apply them to the form and apply filter
    this.leerValoresURL();
    this.buscarPeliculas(this.form.value as FiltroPeliculas);
    this.escribirParamsBusquedaEnURL(this.form.value as FiltroPeliculas);

    this.form.valueChanges.subscribe((valores => {
      this.peliculas = this.peliculasOriginal;
      this.buscarPeliculas(valores as FiltroPeliculas);
      this.escribirParamsBusquedaEnURL(valores as FiltroPeliculas);
    }));
  }

  private formBuilder = inject(FormBuilder);
  private location = inject(Location);
  private activatedRoute = inject(ActivatedRoute);

  form = this.formBuilder.group({
    titulo: '',
    generoId: 0,
    proximosEstrenos: false,
    enCines: false
  });

  generos = [
    { id: 1, nombre: "Drama" },
    { id: 2, nombre: "Acción" },
    { id: 3, nombre: "Comedia" },
  ];


  // TODO: sustituir con info de base de datos
  peliculasOriginal = [
    {
      titulo: 'Inside Out 2',
      fechaLanzamiento: new Date(),
      precio: 1400.99,
      poster: 'https://upload.wikimedia.org/wikipedia/en/f/f7/Inside_Out_2_poster.jpg?20240514232832',
      generos: [3],
      enCines: true,
      proximosEstrenos: false
    },
    {
      titulo: 'Moana 2',
      fechaLanzamiento: new Date('2016-05-03'),
      precio: 300.99,
      poster: 'https://upload.wikimedia.org/wikipedia/en/7/73/Moana_2_poster.jpg',
      generos: [3],
      enCines: true,
      proximosEstrenos: false
    },
    {
      titulo: 'Bad Boys: Ride or Die',
      fechaLanzamiento: new Date('2016-05-03'),
      precio: 300.99,
      poster: 'https://upload.wikimedia.org/wikipedia/en/8/8b/Bad_Boys_Ride_or_Die_%282024%29_poster.jpg',
      generos: [2, 3],
      enCines: true,
      proximosEstrenos: false
    },
    {
      titulo: 'Deadpool & Wolverine',
      fechaLanzamiento: new Date('2016-05-03'),
      precio: 300.99,
      poster: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Deadpool_%26_Wolverine_poster.jpg/220px-Deadpool_%26_Wolverine_poster.jpg',
      generos: [2, 3],
      enCines: true,
      proximosEstrenos: false
    },
    {
      titulo: 'Oppenheimer',
      fechaLanzamiento: new Date('2016-05-03'),
      precio: 300.99,
      poster: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Oppenheimer_%28film%29.jpg/220px-Oppenheimer_%28film%29.jpg',
      generos: [1],
      enCines: true,
      proximosEstrenos: false
    },
    {
      titulo: 'The Flash',
      fechaLanzamiento: new Date('2016-05-03'),
      precio: 300.99,
      poster: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/ed/The_Flash_%28film%29_poster.jpg/220px-The_Flash_%28film%29_poster.jpg',
      generos: [1, 2],
      enCines: true,
      proximosEstrenos: false
    },
    {
      titulo: 'Fast X',
      fechaLanzamiento: new Date('2023-05-03'),
      precio: 500.99,
      poster: 'https://upload.wikimedia.org/wikipedia/en/f/f2/Fast_X_poster.jpg',
      generos: [1, 2, 3],
      enCines: true,
      proximosEstrenos: false
    },
    {
      titulo: 'Guardians of the Galaxy vol. 3',
      fechaLanzamiento: new Date('2016-05-03'),
      precio: 600.99,
      poster: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Guardians_of_the_Galaxy_Vol._3_poster.jpg/220px-Guardians_of_the_Galaxy_Vol._3_poster.jpg',
      generos: [2, 3],
      enCines: false,
      proximosEstrenos: true
    },
    {
      titulo: 'Super Mario Bros',
      fechaLanzamiento: new Date('2023-05-03'),
      precio: 300.99,
      poster: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/44/The_Super_Mario_Bros._Movie_poster.jpg/220px-The_Super_Mario_Bros._Movie_poster.jpg',
      generos: [2, 3],
      enCines: false,
      proximosEstrenos: true
    },
  ];

  peliculas = this.peliculasOriginal; // initial value

  buscarPeliculas(valores: FiltroPeliculas) {
    if (valores.titulo) {
      this.peliculas = this.peliculas.filter(pelicula => pelicula.titulo.indexOf(valores.titulo) !== -1);
    }

    if (valores.generoId !== 0) {
      this.peliculas = this.peliculas.filter(pelicula => pelicula.generos.indexOf(valores.generoId) !== -1);
    }

    if (valores.proximosEstrenos) {
      this.peliculas = this.peliculas.filter(pelicula => pelicula.proximosEstrenos);
    }

    if (valores.enCines) {
      this.peliculas = this.peliculas.filter(pelicula => pelicula.enCines);
    }
  }

  escribirParamsBusquedaEnURL(valores: FiltroPeliculas) {
    let queryStrings = [];
    
    if(valores.titulo) {
      queryStrings.push(`titulo=${encodeURIComponent(valores.titulo)}`); //encode string to valid URI value
    }
    if(valores.generoId !== 0) {
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

      if(params.titulo) {
        objeto.titulo = params.titulo;
      }

      if(params.generoId) {
        objeto.generoId = parseNumber(params.generoId);
      }

      if(params.proximosEstrenos) {
        objeto.proximosEstrenos = parseBoolean(params.proximosEstrenos);
      }

      if(params.enCines) {
        objeto.enCines = parseBoolean(params.enCines);
      }
      
      this.form.patchValue(objeto);
    });
  }

  limpiar() {
    this.form.patchValue({ titulo: '', generoId: 0, proximosEstrenos: false, enCines: false });
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CitasRoutingModule } from './citas-routing.module';
import { ContenedorCitasComponent } from './contenedor-citas/contenedor-citas.component';
import { ListaCitasComponent } from './lista-citas/lista-citas.component';
import { DetalleCitasComponent } from './detalle-citas/detalle-citas.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ContenedorCitasComponent,
    ListaCitasComponent,
    DetalleCitasComponent
  ],
  imports: [
    CommonModule,
    CitasRoutingModule,
    ReactiveFormsModule
  ]
})
export class CitasModule { }

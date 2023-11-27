import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgendaRoutingModule } from './agenda-routing.module';
import { ContenedorAgendaComponent } from './contenedor-agenda/contenedor-agenda.component';
import { ListaAgendaComponent } from './lista-agenda/lista-agenda.component';
import { DetalleAgendaComponent } from './detalle-agenda/detalle-agenda.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ContenedorAgendaComponent,
    ListaAgendaComponent,
    DetalleAgendaComponent
  ],
  imports: [
    CommonModule,
    AgendaRoutingModule,
    ReactiveFormsModule
  ]
})
export class AgendaModule { }

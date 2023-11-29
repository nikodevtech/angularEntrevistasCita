import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgendaRoutingModule } from './agenda-routing.module';
import { ContenedorAgendaComponent } from './contenedor-agenda/contenedor-agenda.component';
import { ListaAgendaComponent } from './lista-agenda/lista-agenda.component';
import { DetalleAgendaComponent } from './detalle-agenda/detalle-agenda.component';


@NgModule({
  declarations: [
    ContenedorAgendaComponent,
    ListaAgendaComponent,
    DetalleAgendaComponent
  ],
  imports: [
    CommonModule,
    AgendaRoutingModule,
  ]
})
export class AgendaModule { }

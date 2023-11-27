import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContenedorAgendaComponent } from './contenedor-agenda/contenedor-agenda.component';
import { DetalleAgendaComponent } from './detalle-agenda/detalle-agenda.component';
import { ListaAgendaComponent } from './lista-agenda/lista-agenda.component';

const routes: Routes = [
  { path: '', component: ContenedorAgendaComponent, children: [
    { path: 'listado', component: ListaAgendaComponent },
    { path: 'editar/:id', component: DetalleAgendaComponent },
    { path: 'crear', component: DetalleAgendaComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgendaRoutingModule { }

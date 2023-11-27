import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidaComponent } from './Vistas/bienvenida/bienvenida.component';

const routes: Routes = [
  { path: '', component: BienvenidaComponent},
  { path: 'clientes', loadChildren: () => import('./Vistas/clientes/clientes.module').then(m => m.ClientesModule)},
  { path: 'citas', loadChildren: () => import('./Vistas/citas/citas.module').then(m => m.CitasModule)},
  { path: 'agenda', loadChildren: () => import('./Vistas/agenda/agenda.module').then(m => m.AgendaModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

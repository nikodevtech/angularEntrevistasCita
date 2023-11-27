import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContenedorCitasComponent } from './contenedor-citas/contenedor-citas.component';
import { DetalleCitasComponent } from './detalle-citas/detalle-citas.component';
import { ListaCitasComponent } from './lista-citas/lista-citas.component';

const routes: Routes = [
  { path: '', component: ContenedorCitasComponent, children: [
    { path: 'listado', component: ListaCitasComponent },
    { path: 'editar/:id', component: DetalleCitasComponent },
    { path: 'crear', component: DetalleCitasComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitasRoutingModule { }

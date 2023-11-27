import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContenedorClientesComponent } from './contenedor-clientes/contenedor-clientes.component';
import { DetalleClientesComponent } from './detalle-clientes/detalle-clientes.component';
import { ListaClientesComponent } from './lista-clientes/lista-clientes.component';

const routes: Routes = [
  { path: '', component: ContenedorClientesComponent, children: [
    { path: 'listado', component: ListaClientesComponent },
    { path: 'editar/:id', component: DetalleClientesComponent },
    { path: 'crear', component: DetalleClientesComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }

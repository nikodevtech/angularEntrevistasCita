import { Component } from '@angular/core';
import { Cliente } from 'src/app/Modelos/cliente';
import { FirebaseService } from 'src/app/Servicios/firebase.service';
import { NotificacionesService } from 'src/app/Servicios/notificaciones.service';

@Component({
  selector: 'app-lista-clientes',
  templateUrl: './lista-clientes.component.html',
  styleUrls: ['./lista-clientes.component.css']
})
export class ListaClientesComponent {
  listaClientes: Cliente[] = [];

  constructor(
    private _firebaseService: FirebaseService,
    private _notificacionesService: NotificacionesService
    ) {}

  ngOnInit(): void {
    this.getClientes();
  }

  //element.payload.doc.id --> accede al id que tiene cada documento (registro) en firebase
  //element.payload.doc.data -->  accede a la data (campos) del documento

  /**
   * Obtiene todos los juegos registrados en firebase con dicho servicio
   * @returns suscripcion al observable
   */
  getClientes() {
    return this._firebaseService.obtenerTodos('clientes').subscribe((data) => {
      this.listaClientes = [];
      data.forEach((element: any) => {
        //iteramos sobre los datos del observable
        this.listaClientes.push({
          id: element.payload.doc.id, // asignamos el id del registro
          ...element.payload.doc.data(), // asignamos el resto de los atributos/campos con spread operator
        });
      });
    });
  }

  /**
   * Elimina un juego llamando al servicio para confirmar la eliminación
   * @param id del juego a eliminar
   */
  eliminarCliente(id: string, dni: string) {
    this._notificacionesService.confirmarEliminar(id, dni, 'cliente', 'clientes');
  }
}

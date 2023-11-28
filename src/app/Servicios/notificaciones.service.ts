import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import Swal from 'sweetalert2';
import { FirebaseService } from './firebase.service';
import { Cliente } from '../Modelos/cliente';

/**
 * Servicio para gestionar notificaciones de alertas y confirmaciones.
 *
 * @export
 * @class NotificacionesService
 */
@Injectable({
  providedIn: 'root',
})
export class NotificacionesService {
  listaClientes: Cliente[] = [];
  constructor(private _firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this._firebaseService.obtenerTodos('clientes').subscribe((data) => {
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
   * Muestra una notificación de éxito para la modificación de un elemento.
   * @param {string} elementoAnotificar - Nombre del elemento modificado.
   */
  notificacionModificacion(elementoAnotificar: string) {
    Swal.fire({
      title: `${elementoAnotificar} se ha registrado con exito`,
      text: `${elementoAnotificar} modificado`,
      icon: 'info',
    });
  }

  /**
   * Muestra una notificación de éxito para el registro de un elemento.
   * @param {string} elementoAnotificar - Nombre del elemento registrado.
   */
  notificacionRegistrar(elementoAnotificar: string) {
    Swal.fire({
      title: `${elementoAnotificar} se ha registrado con exito`,
      text: `${elementoAnotificar} registrado`,
      icon: 'success',
    });
  }

  /**
   * Muestra una confirmación para eliminar un elemento y realiza la acción si es confirmada.
   * @param {string} id - Identificador único del elemento a eliminar.
   * @param {string} nombre - Nombre del elemento a eliminar.
   * @param {string} elementoEliminar - Tipo de elemento que se va a eliminar (puede ser 'cita' u otro).
   * @param {string} coleccion - Nombre de la colección en la base de datos (por ejemplo, 'citas').
   */
  confirmarEliminar(
    id: string,
    nombre: string,
    elementoEliminar: string,
    coleccion: string
  ) {
    Swal.fire({
      title: `¿Estás seguro de eliminar ${elementoEliminar} ${nombre}?`,
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#18BE79',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Si se confirma, realiza la eliminación a través del servicio FirebaseService
        this._firebaseService
          .eliminar(coleccion, id)
          .then(() => {
            console.log(`${elementoEliminar} eliminado`);
          })
          .catch((error) => {
            console.log(error);
          });
        Swal.fire(
          // Muestra una notificación de éxito
          '¡Acción completada!',
          `${elementoEliminar} se ha eliminado con exito.`,
          'error'
        );
      }
    });
  }
}

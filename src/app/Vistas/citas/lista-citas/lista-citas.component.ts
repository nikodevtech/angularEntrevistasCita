import { Component } from '@angular/core';
import { Cita } from 'src/app/Modelos/cita';
import { Cliente } from 'src/app/Modelos/cliente';
import { FirebaseService } from 'src/app/Servicios/firebase.service';
import { NotificacionesService } from 'src/app/Servicios/notificaciones.service';

/**
 * Componente encargado de mostrar una lista de citas y proporcionar funcionalidades
 * como la obtención de citas desde Firebase y la eliminación de citas.
 * @export
 * @class ListaCitasComponent
 */
@Component({
  selector: 'app-lista-citas',
  templateUrl: './lista-citas.component.html',
  styleUrls: ['./lista-citas.component.css'],
})
export class ListaCitasComponent {
  listaClientes: Cliente[] = [];
  listaCitas: Cita[] = [];

  /**
   * Crea una instancia de ListaCitasComponent.
   * @param {FirebaseService} _firebaseService - Servicio para operaciones con Firebase.
   * @param {NotificacionesService} _notificacionesService - Servicio para notificaciones.
   */
  constructor(
    private _firebaseService: FirebaseService,
    private _notificacionesService: NotificacionesService
  ) {}

  /**
   * Se ejecuta al inicializar el componente.
   * Obtiene la lista de citas al llamar al método getCitas.
   */
  ngOnInit(): void {
    this.getCitas();
    this.getClientes();
  }

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
   * Obtiene la lista de citas desde Firebase y actualiza el arreglo listaCitas.
   */
  getCitas() {
    return this._firebaseService.obtenerTodos('citas').subscribe((data) => {
      this.listaCitas = [];
      data.forEach((element: any) => {
        //iteramos sobre los datos del observable
        this.listaCitas.push({
          id: element.payload.doc.id, // asignamos el id del registro
          ...element.payload.doc.data(), // asignamos el resto de los atributos/campos con spread operator
        });
      });
    });
  }
  /**
   * Solicita confirmación para eliminar una cita y luego llama al servicio de notificaciones
   * para procesar la eliminación si el usuario confirma.
   * @param {string} idCita - Identificador único de la cita.
   * @param {string} dni - Número de DNI asociado a la cita (se utiliza para mostrar información en la confirmación).
   */
  eliminarCita(idCita: string, dni: string, idCliente: string) {
    this._notificacionesService.confirmarEliminar(
      idCita,
      dni,
      'la cita',
      'citas'
    );
    //Eliminar la cita del array de citas de cada cliente por el id de la cita
    this.actualizarArrayCitasCliente(idCliente, idCita);
  }

  /**
   * Actualiza el array de citas en el cliente después de eliminar una cita.
   * @param {string} idCliente - Identificador del cliente.
   * @param {string} idCita - Identificador de la cita a eliminar.
   */
  private actualizarArrayCitasCliente(idCliente: string, idCita: string) {
    const cliente = this.listaClientes.find(
      (cliente) => cliente.id === idCliente
    );
    if (cliente && cliente.arrayCitasCliente) {
      // Eliminar el ID de la cita del array de citas del cliente
      cliente.arrayCitasCliente = cliente.arrayCitasCliente.filter(
        (id) => id !== idCita
      );
      // Actualizar el cliente en la base de datos
      this._firebaseService.actualizar('clientes', idCliente, {
        arrayCitasCliente: cliente.arrayCitasCliente,
      });
    }
  }
}

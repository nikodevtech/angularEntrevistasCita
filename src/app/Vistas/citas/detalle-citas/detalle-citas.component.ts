import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Cita } from 'src/app/Modelos/cita';
import { Cliente } from 'src/app/Modelos/cliente';
import { FirebaseService } from 'src/app/Servicios/firebase.service';
import { NotificacionesService } from 'src/app/Servicios/notificaciones.service';

/**
 * Componente para registrar y editar citas de entrevistas.
 * @export
 * @class DetalleCitasComponent
 */
@Component({
  selector: 'app-detalle-citas',
  templateUrl: './detalle-citas.component.html',
  styleUrls: ['./detalle-citas.component.css'],
})
export class DetalleCitasComponent {
  createCita: FormGroup; // Formulario para la creación y edición de citas.
  submitted = false; // Indica si el formulario ha sido enviado.
  loading = false; // True muestra el spinner de carga en caso de envío de datos
  id: string | null; // Identificador de la cita en caso de edición.
  titulo = 'Registrar nueva cita'; //Título del formulario.
  textoButton = 'Registrar'; // Texto del botón de envío del formulario.
  listaClientes: Cliente[] = []; // Lista de clientes disponibles.

  /**
   * Crea una instancia de DetalleCitasComponent.
   *
   * @param {FormBuilder} formBuilder - Servicio para construir formularios reactivos.
   * @param {FirebaseService} _firebaseService - Servicio para operaciones con Firebase.
   * @param {Router} router - Servicio de enrutamiento.
   * @param {ActivatedRoute} route - Información sobre la ruta activada.
   * @param {NotificacionesService} _notificacionesService - Servicio para mostrar notificaciones.
   */
  constructor(
    private formBuilder: FormBuilder,
    private _firebaseService: FirebaseService,
    private router: Router,
    private route: ActivatedRoute,
    private _notificacionesService: NotificacionesService
  ) {
    this.createCita = this.formBuilder.group({
      entrevistadoPor: ['', Validators.required],
      diaCita: ['', Validators.required],
      horaCita: ['', Validators.required],
      cliente: ['', Validators.required],
    });
    // Obtener el ID de la ruta actual
    this.id = this.route.snapshot.paramMap.get('id');
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.esEditar(); // Verificar si se está editando una cita existente
    this.getClientes(); // Obtener los datos de los clientes
  }

  /**
   * Obtiene la lista de clientes desde Firebase y la asigna a `listaClientes`.
   * @returns {Subscription} - Suscripción a la obtención de clientes.
   */
  getClientes() {
    return this._firebaseService.obtenerTodos('clientes').subscribe((data) => {
      this.listaClientes = data.map((cliente: any) => {
        return {
          id: cliente.payload.doc.id,
          ...cliente.payload.doc.data(),
        };
      });
    });
  }

  /**
   * Método invocado al enviar el formulario para agregar o editar una cita.
   * Si el ID es `null`, se agrega una nueva cita. De lo contrario, se edita una existente.
   */
  agregarEditarCita(): void {
    this.submitted = true;
  
    // Verificar si la hora está dentro del rango deseado
    const horaIngresada = this.createCita.value.horaCita;
    if (horaIngresada && (horaIngresada < '10:00' || horaIngresada > '14:00')) {
      this.createCita.get('horaCita')?.setErrors({ fueraDeRango: true });
    }
  
    if (this.createCita.invalid) {
      return;
    }
  
    if (this.id === null) {
      this.registrarCita();
    } else {
      this.editarCita(this.id);
    }
  }

  /**
   * Metodo para editar una cita con el ID proporcionado.
   * @param id Identificador de la cita
   */
  editarCita(id: string) {
    this.loading = true;
    const cita: Cita = {
      entrevistadoPor: this.createCita.value.entrevistadoPor,
      diaCita: this.createCita.value.diaCita,
      horaCita: this.createCita.value.horaCita,
      idCliente: this.createCita.value.cliente,
      clienteData: this.getClienteData(this.createCita.value.cliente),
    };
    // Actualizar la cita en Firebase
    this._firebaseService
      .actualizar('citas', id, cita)
      .then(() => {
        this.loading = false;
        this._notificacionesService.notificacionModificacion('La cita');
        this.router.navigate(['/citas/listado']);
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
      });
  }

  /**
   * Registra una nueva cita en Firebase.
   */
  registrarCita() {
    this.loading = true;
    const cita: Cita = {
      entrevistadoPor: this.createCita.value.entrevistadoPor,
      diaCita: this.createCita.value.diaCita,
      horaCita: this.createCita.value.horaCita,
      idCliente: this.createCita.value.cliente,
      clienteData: this.getClienteData(this.createCita.value.cliente),
    };

    this._firebaseService
      .insertar('citas', cita)
      .then((citaRegistrada) => {
        this.loading = false;
        // Obtener el ID de la cita registrada
        const idCitaRegistrada = citaRegistrada.id;
        // Actualizar el array de citas en el cliente
        const idCliente = this.createCita.value.cliente;
        this.actualizarCitaEnCliente(idCitaRegistrada, idCliente);
        this._notificacionesService.notificacionRegistrar('La cita');
        this.router.navigate(['/citas/listado']);
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
      });
  }


  /**
   * Verifica si se está editando una cita existente y carga los datos en el formulario.
   */
  esEditar() {
    if (this.id !== null) {
      this.loading = true;
      this.textoButton = 'Editar';
      this.titulo = 'Editar Cita';
      this._firebaseService
        .obtenerPorId('citas', this.id)
        .subscribe((respuesta) => {
          this.loading = false;
          // Obtiene y formatear la fecha de la cita
          const diaCita = new Date(respuesta.payload.data()['diaCita']);
          const diaCitaFormateada = diaCita.toISOString().split('T')[0];

          // Llenar el formulario con los datos de la cita a editar
          if (diaCitaFormateada) {
            this.createCita.setValue({
              entrevistadoPor: respuesta.payload.data()['entrevistadoPor'],
              diaCita: diaCitaFormateada,
              horaCita: respuesta.payload.data()['horaCita'],
              cliente: respuesta.payload.data()['idCliente'],
            });
          }
        });
    }
  }
  /**
   * Obtiene los datos del cliente seleccionado en el formulario.
   * @param {string} idCliente - Identificador del cliente seleccionado.
   * @returns {any} - Datos del cliente.
   */
  private getClienteData(idCliente: string): any {
    const cliente = this.listaClientes.find(
      (cliente) => cliente.id === idCliente
    );
    if (cliente) {
      return {
        nombreCliente: cliente.nombre,
        dniCliente: cliente.dni,
        telefonoCliente: cliente.telefono,
        emailCliente: cliente.email,
      };
    } else {
      return {};
    }
  }

  /**
   * Actualiza el array de citas en el cliente correspondiente.
   * @param {string} idCita - Identificador de la cita actualizada.
   * @param {string} idCliente - Identificador del cliente al que se le actualizará el array de citas.
   */
  private actualizarCitaEnCliente(idCita: string, idCliente: string) {
    // Obtiene el cliente con el ID
    const cliente = this.listaClientes.find((cliente) => cliente.id === idCliente);

    // Actualiza el array de citas en el cliente
    if (cliente) {
        if (!cliente.arrayCitasCliente) {
            cliente.arrayCitasCliente = [];
        }
        cliente.arrayCitasCliente.push(idCita);

        // Actualizar el cliente en la base de datos
        this._firebaseService.actualizar('clientes', idCliente, {
            arrayCitasCliente: cliente.arrayCitasCliente,
        });
    }
  }
}

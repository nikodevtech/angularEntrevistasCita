import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Cliente } from 'src/app/Modelos/cliente';
import { FirebaseService } from 'src/app/Servicios/firebase.service';
import { NotificacionesService } from 'src/app/Servicios/notificaciones.service';

@Component({
  selector: 'app-detalle-clientes',
  templateUrl: './detalle-clientes.component.html',
  styleUrls: ['./detalle-clientes.component.css']
})
export class DetalleClientesComponent {
  createCliente: FormGroup; //Representa el formulario
  submitted = false; // Para controlar si el formulario ha sido enviado y si es invalido poder dar info
  loading = false; //Para poder controlar cuando mostrar el spinner de bootstrap
  id: string | null; //Para recibir el id como param para editar o null para crear
  titulo = 'Registrar nuevo cliente';
  textoButton = 'Registrar';

  constructor(
    private formBuilder: FormBuilder, //Dependencia para form reactivo
    private _firebaseService: FirebaseService,
    private router: Router, //Dependecia para navegar entre rutas
    private route: ActivatedRoute ,//Dependencia para acceder al id por la ruta
    private _notificacionesService: NotificacionesService //Dependencia para mostrar mensajes
  ) {
    // Inicializa el formulario con formBuilder y define campos con validadores
    this.createCliente = this.formBuilder.group({
      //crea un FormGroup con estos campos
      nombre: ['', Validators.required],
      dni: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', Validators.required],
    });
    this.id = this.route.snapshot.paramMap.get('id'); //capturamos el id de la url
  }

  ngOnInit(): void {
    this.esEditar();
  }

  /**
   * Gestiona la lógica si hay que agregar o editar un cliente en Firebase
   * dependiendo de si el id es null o no.
   */
  agregarEditarCliente(): void {
    this.submitted = true;
    //Con este condicional si falta algun dato requerido en el formulario no se crea el cliente
    if (this.createCliente.invalid) {
      return;
    }
    // Si el formulario es valido, se crea o se actualiza el cliente
    if (this.id === null) {
      this.registrarCliente();
    } else {
      this.editarCliente(this.id);
    }
  }

  /**
   * Actualiza la información de un cliente existente en Firebase.
   * @param id del cliente
   * @remarks Se extraen los datos del formulario y se actualiza el cliente con el ID proporcionado.
   * La fecha de actualización se establece en la fecha actual.
   * Muestra un mensaje de éxito y redirige a la lista de clientes.
   */
  editarCliente(id: string) {
    this.loading = true;

    const cliente: Cliente = {
      nombre: this.createCliente.value.nombre,
      dni: this.createCliente.value.dni,
      telefono: this.createCliente.value.telefono,
      email: this.createCliente.value.email,
      arrayCitasCliente: [],
    };

    this._firebaseService
      .actualizar('clientes', id, cliente)
      .then(() => {
        this.loading = false;
        this._notificacionesService.notificacionModificacion("El cliente");
        this.router.navigate(['/clientes/listado']);
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
      });
  }

  /**
   * Agrega un nuevo cliente
   * @remarks
   * Se crea un objeto cliente con los datos del formulario y se llama al servicio para agregarlo a Firebase.
   * Muestra un mensaje de éxito, detiene la carga y redirige a la lista de clientes.
   */
  registrarCliente() {
    this.loading = true;
    const cliente: Cliente = {
      nombre: this.createCliente.value.nombre,
      dni: this.createCliente.value.dni,
      telefono: this.createCliente.value.telefono,
      email: this.createCliente.value.email,
      arrayCitasCliente: [],
    };
    this._firebaseService
      .insertar('clientes', cliente)
      .then(() => {
        this._notificacionesService.notificacionRegistrar("El cliente");
        this.loading = false;
        this.router.navigate(['/clientes/listado']);
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
      });
  }

  /**
   * Verifica si se esta editando o creando un nuevo cliente
   * para mostrar los campos del form con los datos correspondientes
   */
  esEditar() {
    if (this.id !== null) {
      this.loading = true;
      this.textoButton = 'Editar';
      this.titulo = 'Editar cliente';
      this._firebaseService
        .obtenerPorId('clientes', this.id)
        .subscribe((respuesta) => {
          this.loading = false;
          this.createCliente.setValue({
            nombre: respuesta.payload.data()['nombre'],
            dni: respuesta.payload.data()['dni'],
            telefono: respuesta.payload.data()['telefono'],
            email: respuesta.payload.data()['email'],
          });
        });
    }
  }

}

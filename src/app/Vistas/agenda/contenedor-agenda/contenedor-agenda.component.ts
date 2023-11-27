import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AgendaDiaria } from 'src/app/Modelos/agenda-diaria';
import { Cita } from 'src/app/Modelos/cita';
import { FirebaseService } from 'src/app/Servicios/firebase.service';
import { NotificacionesService } from 'src/app/Servicios/notificaciones.service';

@Component({
  selector: 'app-contenedor-agenda',
  templateUrl: './contenedor-agenda.component.html',
  styleUrls: ['./contenedor-agenda.component.css']
})
export class ContenedorAgendaComponent {
  agendaForm: FormGroup;
  listaCitas: Cita[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private notificacionesService: NotificacionesService
  ) {
    this.agendaForm = this.formBuilder.group({
      dia: ['', Validators.required],
      hora: ['', Validators.required],
      cita1: [''],
      cita2: [''],
      cita3: [''],
      cita4: ['']
    });
  }

  ngOnInit(): void {
    this.getCitas();
  }

  getCitas() {
    const fechaHoy = new Date();
    console.log(fechaHoy.getDate())
    const fechaManana = new Date();
    fechaManana.setDate(fechaHoy.getDate() + 1); // Obtener citas para el día siguiente
    const diaManana = fechaManana.toISOString().split('T')[0];
    console.log(diaManana)

    this.firebaseService
      .obtenerPorFiltro('citas', 'diaCita', diaManana)
      .subscribe((data) => {
        data.forEach((element: any) => {
          this.listaCitas.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data(),
          } as Cita);
        });
      })
  }

  asignarCita() {
    // Validar si hay datos suficientes para asignar la cita en la agenda
    if (this.agendaForm.valid) {
      const agenda: AgendaDiaria = {
        cita1: this.agendaForm.value.cita1 || null,
        cita2: this.agendaForm.value.cita2 || null,
        cita3: this.agendaForm.value.cita3 || null,
        cita4: this.agendaForm.value.cita4 || null,
      };

      // Lógica para asignar la agenda en Firebase
      this.firebaseService.insertar('agendaDiaria', agenda);

      this.notificacionesService.notificacionRegistrar('agenda');
    }
  }
}

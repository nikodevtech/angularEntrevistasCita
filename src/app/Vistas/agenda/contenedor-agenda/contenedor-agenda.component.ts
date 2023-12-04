import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AgendaDiaria } from 'src/app/Modelos/agenda-diaria';
import { Cita } from 'src/app/Modelos/cita';
import { FirebaseService } from 'src/app/Servicios/firebase.service';
import { NotificacionesService } from 'src/app/Servicios/notificaciones.service';

@Component({
  selector: 'app-contenedor-agenda',
  templateUrl: './contenedor-agenda.component.html',
  styleUrls: ['./contenedor-agenda.component.css'],
})
export class ContenedorAgendaComponent {
  listaCitas: Cita[] = [];
  agenda: AgendaDiaria = {};

  constructor(
    private firebaseService: FirebaseService,
    private notificacionesService: NotificacionesService
  ) {}

  ngOnInit(): void {
    this.getCitas();
  }

  getCitas() {
    const fechaHoy = new Date();
    const fechaManana = new Date();
    fechaManana.setDate(fechaHoy.getDate() + 1); // Obtener citas para el día siguiente
    const diaManana = fechaManana.toISOString().split('T')[0];

    this.listaCitas = [];

    this.firebaseService
      .obtenerPorFiltro('citas', 'diaCita', diaManana)
      .subscribe((data) => {
        data.forEach((element: any) => {
          this.listaCitas.push({
            id: element.payload.doc.id,
            ...element.payload.doc.data(),
          } as Cita);
        });

        // Llenar la agenda con las 4 primeras citas obtenidas o con las disponibles
        this.agenda = {
          cita1: this.listaCitas[0],
          cita2: this.listaCitas[1],
          cita3: this.listaCitas[2],
          cita4: this.listaCitas[3],
        };
        // Filtrar solo las citas definidas (eliminar las citas indefinidas)
        this.agenda = Object.fromEntries(
          Object.entries(this.agenda).filter(
            ([key, value]) => value !== undefined
          )
        );
      });
  }
  marcarComoVisto(cita: Cita) {
    cita.visto = !cita.visto;
    this.firebaseService.actualizar('citas', cita.id!, cita).then(() => {
      this.listaCitas = [];
    });
  }

  guardarAgendaDiaria() {
    if (Object.keys(this.agenda).length > 0) {
      this.firebaseService.insertar('agendaDiaria', this.agenda);
      this.notificacionesService.notificacionRegistrar('agenda');
    } else {
      console.error('No hay citas definidas en la agenda para guardar.');
    }
  }
}

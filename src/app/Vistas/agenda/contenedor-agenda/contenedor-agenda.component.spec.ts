import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenedorAgendaComponent } from './contenedor-agenda.component';

describe('ContenedorAgendaComponent', () => {
  let component: ContenedorAgendaComponent;
  let fixture: ComponentFixture<ContenedorAgendaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContenedorAgendaComponent]
    });
    fixture = TestBed.createComponent(ContenedorAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

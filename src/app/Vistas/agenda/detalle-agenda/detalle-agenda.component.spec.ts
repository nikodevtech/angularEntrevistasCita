import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAgendaComponent } from './detalle-agenda.component';

describe('DetalleAgendaComponent', () => {
  let component: DetalleAgendaComponent;
  let fixture: ComponentFixture<DetalleAgendaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleAgendaComponent]
    });
    fixture = TestBed.createComponent(DetalleAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

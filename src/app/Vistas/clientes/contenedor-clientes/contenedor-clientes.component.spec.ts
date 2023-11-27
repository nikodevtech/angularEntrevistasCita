import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenedorClientesComponent } from './contenedor-clientes.component';

describe('ContenedorClientesComponent', () => {
  let component: ContenedorClientesComponent;
  let fixture: ComponentFixture<ContenedorClientesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContenedorClientesComponent]
    });
    fixture = TestBed.createComponent(ContenedorClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

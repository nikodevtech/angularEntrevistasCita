import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenedorCitasComponent } from './contenedor-citas.component';

describe('ContenedorCitasComponent', () => {
  let component: ContenedorCitasComponent;
  let fixture: ComponentFixture<ContenedorCitasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContenedorCitasComponent]
    });
    fixture = TestBed.createComponent(ContenedorCitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

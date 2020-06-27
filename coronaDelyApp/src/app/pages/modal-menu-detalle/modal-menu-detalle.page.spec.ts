import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMenuDetallePage } from './modal-menu-detalle.page';

describe('ModalMenuDetallePage', () => {
  let component: ModalMenuDetallePage;
  let fixture: ComponentFixture<ModalMenuDetallePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMenuDetallePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMenuDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

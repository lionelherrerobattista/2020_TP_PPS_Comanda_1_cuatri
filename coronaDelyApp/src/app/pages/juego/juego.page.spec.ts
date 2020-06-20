import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoPage } from './juego.page';

describe('JuegoPage', () => {
  let component: JuegoPage;
  let fixture: ComponentFixture<JuegoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

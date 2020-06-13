import { TestBed } from '@angular/core/testing';

import { TipoDeNotificacionService } from './tipo-de-notificacion.service';

describe('TipoDeNotificacionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TipoDeNotificacionService = TestBed.get(TipoDeNotificacionService);
    expect(service).toBeTruthy();
  });
});

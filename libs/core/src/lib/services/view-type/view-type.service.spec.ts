import { inject, TestBed } from '@angular/core/testing';
import { ViewTypeService } from './view-type.service';

describe('ViewTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ViewTypeService],
    });
  });

  it('should be created', inject(
    [ViewTypeService],
    (service: ViewTypeService) => {
      expect(service).toBeTruthy();
    }
  ));
});

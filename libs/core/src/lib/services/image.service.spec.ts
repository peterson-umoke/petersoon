import { TestBed } from '@angular/core/testing';
import * as _ from 'lodash';
import { ImageService } from './image.service';

describe('ImageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  describe('getTransformMatrix', () => {
    const checkArray = (expected: number[], actual: number[]) => {
      _.times(expected.length, (i) => {
        expect(actual[i]).toBeCloseTo(expected[i], 2);
      });
    };

    it('should return identity matrix', () => {
      const service: ImageService = TestBed.inject(ImageService);
      const M = service.getTransformMatrix(
        200,
        100,
        { x: 0, y: 0 },
        { x: 199, y: 0 },
        { x: 199, y: 99 },
        { x: 0, y: 99 }
      );
      checkArray([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], M);
    });

    it('should translate 100,50, and scale .5,.25', () => {
      const service: ImageService = TestBed.inject(ImageService);

      const M = service.getTransformMatrix(
        200,
        100,
        { x: 100, y: 50 },
        { x: 199, y: 50 },
        { x: 199, y: 74 },
        { x: 100, y: 74 }
      );
      checkArray([0.5, 0, 0, 0, 0, 0.25, 0, 0, 0, 0, 1, 0, 100, 50, 0, 1], M);
    });

    it('should transform image 1', () => {
      const service: ImageService = TestBed.inject(ImageService);

      const M = service.getTransformMatrix(
        704,
        200,
        { x: 359, y: 192 },
        { x: 673, y: 188 },
        { x: 672, y: 278 },
        { x: 359, y: 280 }
      );

      checkArray(
        [0.426, -0.012, 0, 0, 0.006, 0.449, 0, 0, 0, 0, 1, 0, 359, 192, 0, 1],
        M
      );
    });

    it('should transform image 2', () => {
      const service: ImageService = TestBed.inject(ImageService);

      const M = service.getTransformMatrix(
        272,
        152,
        { x: 1266, y: 279 },
        { x: 1529, y: 275 },
        { x: 1533, y: 428 },
        { x: 1270, y: 433 }
      );
      checkArray(
        [1.007, -0.008, 0, 0, 0.026, 1.02, 0, 0, 0, 0, 1, 0, 1266, 279, 0, 1],
        M
      );
    });

    it('should transform image 3', () => {
      const service: ImageService = TestBed.inject(ImageService);

      const M = service.getTransformMatrix(
        384,
        144,
        { x: 371, y: 290 },
        { x: 502, y: 297 },
        { x: 502, y: 353 },
        { x: 371, y: 348 }
      );
      checkArray(
        [0.39, 0.045, 0, 0, 0, 0.41, 0, 0, 0, 0, 1, 0, 371, 290, 0, 1],
        M
      );
    });
  });
});

import { Injectable } from '@angular/core';
import * as _ from 'lodash';

// tslint:disable: max-line-length
interface Point {
  x: number;
  y: number;
}

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor() {}

  public getTransformMatrix(
    width: number,
    height: number,
    topLeft: Point,
    topRight: Point,
    bottomRight: Point,
    bottomLeft: Point
  ): number[] {
    const x = this.getPerspectiveTransform(
      [
        { x: 0, y: 0 },
        { x: width, y: 0 },
        { x: width, y: height },
        { x: 0, y: height },
      ],
      [
        topLeft,
        { x: topRight.x + 1, y: topRight.y },
        { x: bottomRight.x + 1, y: bottomRight.y + 1 },
        { x: bottomLeft.x, y: bottomLeft.y + 1 },
      ]
    );

    // matrix3d is homogeneous coords in column major
    const M = [
      x[0],
      x[3],
      0,
      x[6],
      x[1],
      x[4],
      0,
      x[7],
      0,
      0,
      1,
      0,
      x[2],
      x[5],
      0,
      1,
    ];
    return M;
  }
  /**
   * Calculates coefficients of perspective transformation
   * @param xy Four orignal points
   * @param uv Four transformed points
   * @description
   * From OpenCV:
   * https://github.com/opencv/opencv/blob/11b020b9f9e111bddd40bffe3b1759aa02d966f0/modules/imgproc/src/imgwarp.cpp#L3001
   * which maps (xi,yi) to (ui,vi), (i=1,2,3,4):
   *
   *      c00*xi + c01*yi + c02
   * ui = ---------------------
   *      c20*xi + c21*yi + c22
   *
   *      c10*xi + c11*yi + c12
   * vi = ---------------------
   *      c20*xi + c21*yi + c22
   *
   * Coefficients are calculated by solving linear system:
   * / x0 y0  1  0  0  0 -x0*u0 -y0*u0 \ /c00\ /u0\
   * | x1 y1  1  0  0  0 -x1*u1 -y1*u1 | |c01| |u1|
   * | x2 y2  1  0  0  0 -x2*u2 -y2*u2 | |c02| |u2|
   * | x3 y3  1  0  0  0 -x3*u3 -y3*u3 |.|c10|=|u3|,
   * |  0  0  0 x0 y0  1 -x0*v0 -y0*v0 | |c11| |v0|
   * |  0  0  0 x1 y1  1 -x1*v1 -y1*v1 | |c12| |v1|
   * |  0  0  0 x2 y2  1 -x2*v2 -y2*v2 | |c20| |v2|
   * \  0  0  0 x3 y3  1 -x3*v3 -y3*v3 / \c21/ \v3/
   *
   * where:
   *   cij - matrix coefficients, c22 = 1
   */

  private getPerspectiveTransform(src: Point[], dest: Point[]): number[] {
    // Ax = b
    const A = _.times(8, () => _.times(8, _.constant(0)));
    const b = _.times(8, _.constant(0));

    _.times(4, (i) => {
      A[i][0] = A[i + 4][3] = src[i].x;
      A[i][1] = A[i + 4][4] = src[i].y;
      A[i][2] = A[i + 4][5] = 1;
      A[i][3] = A[i][4] = A[i][5] = A[i + 4][0] = A[i + 4][1] = A[i + 4][2] = 0;
      A[i][6] = -src[i].x * dest[i].x;
      A[i][7] = -src[i].y * dest[i].x;
      A[i + 4][6] = -src[i].x * dest[i].y;
      A[i + 4][7] = -src[i].y * dest[i].y;
      b[i] = dest[i].x;
      b[i + 4] = dest[i].y;
    });

    return this.solve(A, b);
  }

  // Solve Linear equation Ax=b
  // returns x
  private solve(A: number[][], b: number[]): number[] {
    const n = A.length;
    const A_aug = _.cloneDeep(A);
    _.times(n, (i) => A_aug[i].push(b[i]));

    _.times(n, (i) => {
      // Search for maximum in this column
      let max_value = 0;
      let max_row = null;

      for (let k = i; k < n; k++) {
        const current_max_value = Math.abs(A_aug[k][i]);

        if (current_max_value > max_value) {
          max_value = current_max_value;
          max_row = k;
        }
      }

      // Swap maximum row with current row (column by column)
      for (let k = i; k < n + 1; k++) {
        const tmp = A_aug[i][k];
        A_aug[i][k] = A_aug[max_row][k];
        A_aug[max_row][k] = tmp;
      }

      // Make all rows below this one 0 in current column
      for (let k = i + 1; k < n; k++) {
        const c = -A_aug[k][i] / A_aug[i][i];
        for (let j = i; j < n + 1; j++) {
          if (i === j) A_aug[k][j] = 0;
          else A_aug[k][j] += c * A_aug[i][j];
        }
      }
    });

    // Solve equation Ax=b
    const x = new Array(n);
    for (let i = n - 1; i > -1; i--) {
      x[i] = A_aug[i][n] / A_aug[i][i];
      for (let k = i - 1; k > -1; k--) A_aug[k][n] -= A_aug[k][i] * x[i];
    }
    return x;
  }
}

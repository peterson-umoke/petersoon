import { Component, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-image-outline',
  templateUrl: './image-outline.component.html',
  styleUrls: ['./image-outline.component.scss'],
})
export class ImageOutlineComponent {
  @Input() background = false;
  @Input() border = true;
  @Input() example = false;
  @Input() height: number;
  @Input() width: number;

  constructor() {}

  public get orientationIcon() {
    if (!this.width || !this.height) {
      return '';
    }
    return this.width >= this.height ? 'landscape-img' : 'portrait-img';
  }

  public openExample() {
    if (this.example) {
      const win = window.open(
        '',
        '_blank',
        `width=${this.width},height=${this.height}`
      );
      win.document.writeln(
        '<body style="background-color: #ED2044; margin: 0px; display: flex;">'
      );
      win.document.writeln(`
        <img
          style="display: block; margin: auto; max-width: ${this.width /
            2}px; max-height: ${this.height / 2}px;"
          src="https://blipbillboards-marketplace.s3.amazonaws.com/svg/white_blip.svg"
        >
      `);
      win.document.writeln('</body>');
    }
  }
}

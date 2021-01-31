import { Component, Inject, InjectionToken, OnInit } from '@angular/core';

export const CONTAINER_DATA = new InjectionToken<{}>('CONTAINER_DATA');

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent implements OnInit {
  public images: Array<any>;
  public imageIndex: number;

  constructor(@Inject(CONTAINER_DATA) public componentData: any) {}

  public ngOnInit() {
    this.images = this.componentData.images;
    this.imageIndex = this.componentData.imageIndex;
  }

  public close() {
    this.componentData.close();
  }

  public goToImage(num: number) {
    this.imageIndex += num;

    if (this.imageIndex > this.images.length - 1) {
      this.imageIndex = 0;
    } else if (this.imageIndex < 0) {
      this.imageIndex = this.images.length - 1;
    }
  }

  public closeModal(e: any) {
    if (e.target === e.currentTarget) {
      // checking if target and currentTarget is same
      this.close();
    }
  }
}

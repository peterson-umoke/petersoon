import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Directive, HostListener, Injector, Input } from '@angular/core';
import {
  CONTAINER_DATA,
  ImageViewerComponent,
} from '../../components/image-viewer/image-viewer.component';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[appImageViewer]',
})
export class ImageViewerDirective {
  @Input() images: Array<any>;
  @Input() imageIndex: number;
  @HostListener('click', ['$event'])
  onClick(event: Event) {
    event.stopPropagation();
    if (this.images && this.images.length) {
      this.open();
    }
  }

  constructor(public overlay: Overlay, private _injector: Injector) {}

  /**
   * Creates a portal for modal image-view component to appear.
   */
  public open() {
    const overlayRef = this.overlay.create({
      height: '400px',
      width: '600px',
    });
    const containerPortal = new ComponentPortal(
      ImageViewerComponent,
      null,
      this.createInjector({
        images: this.images,
        imageIndex: this.imageIndex,
        close: () => overlayRef.detach(),
      })
    );
    overlayRef.attach(containerPortal);
  }

  /**
   * Creates a Portal Injector to use the image-view component
   * @param dataToPass
   */
  public createInjector(dataToPass: any): PortalInjector {
    const injectorTokens = new WeakMap();
    injectorTokens.set(CONTAINER_DATA, dataToPass);
    return new PortalInjector(this._injector, injectorTokens);
  }
}

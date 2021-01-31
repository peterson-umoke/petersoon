import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { GeneratorTemplate } from '@marketplace/core';
import { ArtworkGeneratorService } from '../../services/artwork-generator-service/artwork-generator.service';

@Component({
  selector: 'ads-template-carousel',
  templateUrl: './generator-template-carousel.component.html',
  styleUrls: ['./generator-template-carousel.component.scss'],
})
export class GeneratorCarouselComponent implements OnInit, AfterViewInit {
  private _currentTransform = 0;
  public mediumDevice = 959;
  public smallDevice = 600;

  public windowRef: any;

  public templateIndex = 0;
  public templateMap = {
    0: GeneratorTemplate.BASIC,
    1: GeneratorTemplate.BASIC_INVERT,
    2: GeneratorTemplate.BASIC_REFLECT,
    3: GeneratorTemplate.SPLIT,
    4: GeneratorTemplate.SPLIT_INVERT,
  };

  @ViewChild('dots', { static: false }) dots: ElementRef;
  @ViewChildren('item') items: QueryList<ElementRef>;
  @ViewChild('scrollContainer', { static: false }) scrollContainer: ElementRef;

  constructor(private artworkGeneratorService: ArtworkGeneratorService) {
    this.windowRef = window;
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.artworkGeneratorService.updateSelectedTemplate(
      this.templateMap[this.templateIndex]
    );
  }

  /**
   * scroll to the selected template (mobile and tablet only)
   */
  private animate() {
    this.items.toArray()[this.templateIndex].nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }

  /**
   * change the current template index and move the carousel to it
   * @param updatedIndex new template index
   */
  public changeTemplate(updatedIndex: number) {
    if (updatedIndex < 0) {
      // go to the end NOT IMPLEMENTED YET
    } else if (updatedIndex > Object.keys(this.templateMap).length - 1) {
      // go to the beginning NOT IMPLEMENTED YET
    } else {
      // go to the next or previous item
      // at times arguments coming from the template are not numbers...
      this.templateIndex = parseInt(updatedIndex.toString(), 10);
      if (window.innerWidth < this.mediumDevice) {
        // if device is tablet or mobile
        this.animate();
      } else {
        this.moveCarousel();
      }
    }
    this.artworkGeneratorService.updateSelectedTemplate(
      this.templateMap[this.templateIndex]
    );
  }

  /**
   * truncate the 'px' from the margin size
   * @param margin
   */
  private convertMarginToNumber(margin: string): number {
    return parseFloat(margin.substr(0, margin.length - 2));
  }

  /**
   * This will use CSS transforms to move the templates within the carousel (only on desktop view)
   */
  private moveCarousel() {
    const items = [...this.items.toArray()];
    const previousItem = this.templateIndex === 0 ? 0 : this.templateIndex - 1;
    const element = items[previousItem].nativeElement;
    const totalItemWidth =
      element.offsetWidth +
      this.convertMarginToNumber(getComputedStyle(element).marginRight);
    this._currentTransform = -1 * totalItemWidth * this.templateIndex;
    for (let i = 0; i < items.length; i++) {
      items[
        i
      ].nativeElement.style.transform = `translateX(${this._currentTransform}px)`;
    }
  }
}

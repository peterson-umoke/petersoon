import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { first } from 'rxjs/operators';

@Directive({
  //tslint:disable-next-line:directive-selector
  selector: '[coreFitText]',
})
export class FitTextDirective implements OnChanges, AfterViewInit {
  @Input() minFontSize? = 1;
  @Input() maxFontSize? = 512;
  @Input() elementText: string;
  @Input() resize: any;
  @Output() resized: EventEmitter<number> = new EventEmitter();
  fittextElement: HTMLElement;
  fittextParent: HTMLElement;
  currentFontSize: number;
  rendered = false;

  constructor(el: ElementRef, private ngZone: NgZone) {
    this.fittextElement = el.nativeElement;
    this.fittextParent = this.fittextElement.parentElement;
  }

  ngOnChanges(changes: SimpleChanges) {
    let resizeHasBeenRun = false;
    if (
      this.rendered &&
      changes.elementText &&
      changes.elementText.currentValue.length > 0
    ) {
      if (!changes.elementText.previousValue) {
        this.resizeText();
        resizeHasBeenRun = true;
      } else if (
        changes.elementText.currentValue.length <
        changes.elementText.previousValue.length
      ) {
        this.resizeText();
        resizeHasBeenRun = true;
      } else if (
        changes.elementText.currentValue.length >
        changes.elementText.previousValue.length
      ) {
        this.resizeText(true);
        resizeHasBeenRun = true;
      }
    }

    if (
      this.rendered &&
      !resizeHasBeenRun &&
      changes.maxFontSize &&
      changes.maxFontSize.currentValue !== changes.maxFontSize.previousValue
    ) {
      this.resizeText();
      resizeHasBeenRun = true;
    }

    if (this.rendered && !resizeHasBeenRun && changes.resize) {
      this.resizeText(false);
    }
  }

  resizeText(onlyDecrease: boolean = false) {
    this.ngZone.onStable.pipe(first()).subscribe(() => {
      const previousFontSize = this.currentFontSize;
      if (!onlyDecrease) this.increaseFontSize();
      this.decreaseFontSize();
      if (previousFontSize !== this.currentFontSize) {
        this.resized.emit(this.currentFontSize);
      }
    });
  }

  ngAfterViewInit() {
    this.currentFontSize =
      this.elementText && this.elementText.length > 15
        ? this.fittextParent.clientHeight / 2
        : this.fittextParent.clientHeight;
    this.resizeText();
    this.rendered = true;
  }

  decreaseFontSize() {
    const scaleRate = 1;
    while (
      (this.fittextElement.clientHeight > this.fittextParent.clientHeight ||
        this.fittextElement.clientWidth > this.fittextParent.clientWidth + 1) &&
      this.currentFontSize > this.minFontSize
    ) {
      this.currentFontSize = this.calculateFontSize(-1, scaleRate);
      this.fittextElement.style.fontSize = `${this.currentFontSize}px`;
    }
    if (this.maxFontSize && this.currentFontSize >= this.maxFontSize) {
      this.currentFontSize = this.maxFontSize;
      this.fittextElement.style.fontSize = `${this.currentFontSize}px`;
    }
  }

  increaseFontSize() {
    const scaleRate = 5;
    while (
      this.fittextElement.clientHeight <= this.fittextParent.clientHeight &&
      this.currentFontSize < this.maxFontSize
    ) {
      this.currentFontSize = this.calculateFontSize(1, scaleRate);
      this.fittextElement.style.fontSize = `${this.currentFontSize}px`;
    }
  }

  calculateFontSize(direction: number, scaleRate: number) {
    return this.currentFontSize + scaleRate * direction;
  }
}

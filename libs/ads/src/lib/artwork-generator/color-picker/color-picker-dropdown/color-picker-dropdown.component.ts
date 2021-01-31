import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'ads-color-picker-dropdown',
  templateUrl: './color-picker-dropdown.component.html',
  styleUrls: ['./color-picker-dropdown.component.scss'],
})
export class ColorPickerDropdownComponent implements OnInit {
  @Input() colors: string[];
  @Input() selectedColor = '#000000';
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onUpdateColor: EventEmitter<string> = new EventEmitter();
  @ViewChild('colorDropdown', { static: false }) colorDropdown: ElementRef;
  @ViewChild('overlay', { static: false }) overlay: ElementRef;

  constructor() {}

  ngOnInit() {}

  /**
   * toggle color picker drop down
   */
  public toggleColorPicker() {
    if (this.colorDropdown.nativeElement.style.maxHeight) {
      this.colorDropdown.nativeElement.style.maxHeight = null;
      this.overlay.nativeElement.style.display = null;
      setTimeout(() => {
        this.colorDropdown.nativeElement.style.padding = null;
      }, 200);
    } else {
      this.colorDropdown.nativeElement.style.maxHeight = this.colors
        ? '239px'
        : '204px';
      this.colorDropdown.nativeElement.style.padding = '8px';
      this.overlay.nativeElement.style.display = 'block';
    }
  }

  public updateColor(color: string) {
    this.onUpdateColor.emit(color);
  }
}

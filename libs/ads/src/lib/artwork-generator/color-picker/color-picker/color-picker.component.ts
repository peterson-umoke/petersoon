import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { PRESET_COLORS } from '../../../services/artwork-generator-service/artwork-generator.service';

@Component({
  selector: 'ads-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent {
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onEnter: EventEmitter<any> = new EventEmitter();
  @Input() colors: string[];
  @Input() selectedColor = '#000000';
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onUpdateColor: EventEmitter<string> = new EventEmitter();
  private callback;

  public presetColors = PRESET_COLORS;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
    this.colors = (data && data.colors) || null;
    this.callback = (data && data.callback) || null;
  }

  /**
   * Checks that user input is the a valid hex code before updating the color
   * @param color hex code ie: #ffffff
   */
  public hexInput(color: string) {
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      this.setColor(color);
    }
  }

  /**
   * updates the primary template color through the ArtworkGeneratorService
   * @param color hex code ie: #4d4d4d
   */
  public setColor(color: string) {
    this.onUpdateColor.emit(color);
    if (this.callback) {
      this.callback(color);
      this.selectedColor = color;
    }
  }

  public closeParent() {
    this.onEnter.emit();
  }
}

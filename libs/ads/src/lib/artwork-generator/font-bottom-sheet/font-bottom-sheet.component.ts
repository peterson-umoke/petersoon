import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GenFont } from '../../services/artwork-generator-service/artwork-generator.service';

@Component({
  selector: 'ads-font-bottom-sheet',
  templateUrl: './font-bottom-sheet.component.html',
  styleUrls: ['./font-bottom-sheet.component.scss'],
})
export class FontBottomSheetComponent implements OnInit {
  @Input() selectedFont: GenFont;
  @Output() fontSelected: EventEmitter<GenFont> = new EventEmitter<GenFont>();

  public fonts: GenFont[] = [
    'Arbutus Slab',
    // 'Baloo Da',
    'Barlow',
    // 'Exo',
    'Lato',
    'Merriweather',
    'Montserrat',
    // 'Oswald',
  ];

  constructor() {}

  public selectFont(font: GenFont) {
    this.selectedFont = font;
    this.fontSelected.emit(font);
  }

  ngOnInit() {}
}

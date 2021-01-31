import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Ad } from '../../models';

const MAX_AD_IMAGES = 15;

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-ads-card',
  templateUrl: './ads-card.component.html',
  styleUrls: ['./ads-card.component.scss'],
})
export class AdsCardComponent implements OnChanges {
  @Input() ad: Ad;
  @Input() creatingCampaign = false;
  @Input() selectedAds: Array<string> = [];
  @Output() adClicked = new EventEmitter();
  @Output() campaignToggled = new EventEmitter();

  public isAdSelected = false;

  public imageIndex = 0;
  public maxImages: number = MAX_AD_IMAGES;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ad'] || changes['selectedAds']) {
      this.isAdSelected = this.selectedAds.includes(this.ad.id);
    }
  }

  /**
   * Change current image index
   * @param change
   */
  public changeIndex(change: number, event: Event): void {
    event.stopPropagation();
    this.imageIndex += change;
  }

  public get campaignButtonLabel() {
    return this.isAdSelected ? 'Remove from campaign' : 'Add to campaign';
  }

  public get campaignButtonColor() {
    return this.isAdSelected ? 'primary' : 'warning';
  }

  public clicked() {
    this.adClicked.emit(this.ad);
  }

  public toggleCampaign(event: Event) {
    event.stopPropagation();
    this.campaignToggled.emit(this.ad);
  }
}

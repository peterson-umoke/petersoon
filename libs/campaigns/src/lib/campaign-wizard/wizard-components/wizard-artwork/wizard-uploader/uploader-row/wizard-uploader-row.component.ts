import { Component, Input, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Ad, AdImage, Sign } from '@marketplace/core';

const SIGN_DISPLAY_LIMIT_GT_LG = 6;
const SIGN_DISPLAY_LIMIT_GT_SM = 4;
const SIGN_DISPLAY_LIMIT_GT_XS = 2;
const SIGN_DISPLAY_LIMIT_XS = 99999999;
@Component({
  selector: 'campaigns-wizard-uploader-row',
  templateUrl: './wizard-uploader-row.component.html',
  styleUrls: ['./wizard-uploader-row.component.scss'],
})
export class WizardUploaderRowComponent implements OnInit {
  constructor(public media: MediaObserver) {}

  @Input()
  public image?: AdImage;

  @Input()
  public ad: Ad;

  @Input()
  public showHeader = false;

  @Input()
  public size: { width: number; height: number };

  @Input()
  public signs: Sign[] = [];

  public showAllSigns = false;

  public get signDisplayLimit() {
    if (this.media.isActive('gt-lg')) {
      return SIGN_DISPLAY_LIMIT_GT_LG;
    } else if (this.media.isActive('gt-sm')) {
      return SIGN_DISPLAY_LIMIT_GT_SM;
    } else if (this.media.isActive('gt-xs')) {
      return SIGN_DISPLAY_LIMIT_GT_XS;
    } else {
      return SIGN_DISPLAY_LIMIT_XS;
    }
  }

  public get tooManySigns() {
    return this.signs.length > this.signDisplayLimit;
  }

  ngOnInit() {}

  toggleAllSigns() {
    this.showAllSigns = !this.showAllSigns;
  }

  get signIcon() {
    return this.image == null ? 'block' : 'lens';
  }
  get iconClass() {
    return this.image == null ? 'no-match' : 'match';
  }

  get signsToShow() {
    if (this.showAllSigns) {
      return this.signs;
    } else {
      return this.signs.slice(0, this.signDisplayLimit);
    }
  }
}

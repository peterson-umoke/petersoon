import { AgmMap } from '@agm/core';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  GoogleMapStyles,
  Sign,
  SignFacing,
  TranslationService,
} from '@marketplace/core';
import { delay } from 'lodash';
import { Subject } from 'rxjs';
import { first, take } from 'rxjs/operators';
import { CampaignWizardService } from '../../../../services/campaign-wizard/campaign-wizard.service';

@Component({
  selector: 'campaigns-wizard-locations-card',
  templateUrl: './wizard-locations-card.component.html',
  styleUrls: ['./wizard-locations-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardLocationsCardComponent implements OnInit {
  @Input() sign: Sign;
  @Input() markerClicked: boolean;
  @Input() renderCardMap: boolean;
  @Input() signSelected: boolean;
  @Input() allowAddingSigns: boolean;
  @Input() allowAddingUniqueSign: boolean;
  @Input() ltMd: boolean;

  @ViewChild('collapsible', { static: false }) collapsible: ElementRef;
  @ViewChild('description', { static: false }) description: ElementRef;
  @ViewChild('name', { static: false }) name: ElementRef;
  @ViewChild('map') map: AgmMap;

  public render: Subject<boolean> = new Subject();
  public expanded = false;
  public imageIndex = 0;
  public googleMapStyles = GoogleMapStyles;
  public selectedMarker = this.markerIcon(true);
  public deselectedMarker = this.markerIcon(false);

  constructor(
    private translationService: TranslationService,
    private campaignWizardService: CampaignWizardService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    delay(() => this.render.next(true), 100);
  }

  private markerIcon(selected: boolean): string {
    return `assets/map-markers/available/${selected ? 1 : 0}_1.png`;
  }

  public toggleSelected(): void {
    if (this.signSelected) {
      this.campaignWizardService.removeSigns(this.sign);
    } else {
      this.sign.unique_sign
        ? this.campaignWizardService.addUniqueSign(this.sign)
        : this.campaignWizardService.addSigns(this.sign);
    }
  }

  public toggleCollapsible(): void {
    if (!this.expanded) {
      const mapHeight = this.renderCardMap ? 150 : 0;
      this.collapsible.nativeElement.style.maxHeight =
        this.collapsible.nativeElement.scrollHeight + mapHeight + 'px';
      this.description.nativeElement.style.whiteSpace = 'normal';
      this.description.nativeElement.style.height = 'inherit';
      this.name.nativeElement.style.whiteSpace = 'normal';
      this.name.nativeElement.style.height = 'inherit';
      this.expanded = true;
      if (this.renderCardMap) {
        this.zone.onMicrotaskEmpty.pipe(first()).subscribe(() => {
          this.map.triggerResize();
        });
      }
    } else {
      this.collapsible.nativeElement.style.maxHeight = null;
      this.description.nativeElement.style.whiteSpace = null;
      this.description.nativeElement.style.height = null;
      this.name.nativeElement.style.whiteSpace = null;
      this.name.nativeElement.style.height = null;
      this.expanded = false;
    }
  }

  public trafficDirection(signFacing: SignFacing): string {
    switch (signFacing) {
      case SignFacing.N:
        return this.translate('DIRECTIONS.S');
      case SignFacing.S:
        return this.translate('DIRECTIONS.N');
      case SignFacing.E:
        return this.translate('DIRECTIONS.W');
      case SignFacing.W:
        return this.translate('DIRECTIONS.E');
      case SignFacing.NE:
        return this.translate('DIRECTIONS.SW');
      case SignFacing.NW:
        return this.translate('DIRECTIONS.SE');
      case SignFacing.SE:
        return this.translate('DIRECTIONS.NW');
      case SignFacing.SW:
        return this.translate('DIRECTIONS.NE');
    }
  }

  public translate(key: string): string {
    let translation = '';
    const fullKey = 'CAMPAIGN.CREATION.SIGN_LIST.' + key;
    this.translationService
      .getTranslation(fullKey)
      .pipe(take(1))
      .subscribe((text: string) => {
        translation = text;
      });
    return translation;
  }

  public changeImage(action: number): void {
    if (action < 0) {
      this.imageIndex = this.sign.photos.length - 1;
    } else if (action > this.sign.photos.length - 1) {
      this.imageIndex = 0;
    } else {
      this.imageIndex = action;
    }
  }
}

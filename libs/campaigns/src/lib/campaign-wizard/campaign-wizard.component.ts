import { Component, OnDestroy, OnInit } from '@angular/core';
import { ArtworkGeneratorService } from '@marketplace/ads';
import { Ad, BingMapsService, shareReplayRefCount } from '@marketplace/core';
import * as _ from 'lodash';
import { combineLatest, Observable, Subject } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { CampaignCompletionService } from '../services/campaign-wizard/campaign-completion/campaign-completion.service';
import { CampaignConversionService } from '../services/campaign-wizard/campaign-conversion/campaign-conversion.service';
import { CampaignInitializationService } from '../services/campaign-wizard/campaign-initialization/campaign-initialization.service';
import { CampaignWizardService } from '../services/campaign-wizard/campaign-wizard.service';
import { WizardImageSizesService } from '../services/campaign-wizard/wizard-image-sizes/wizard-image-sizes.service';
import { WizardLocationsService } from '../services/campaign-wizard/wizard-locations/wizard-locations.service';
import { WizardScheduleService } from '../services/campaign-wizard/wizard-schedule/wizard-schedule.service';

@Component({
  selector: 'campaigns-campaign-wizard',
  templateUrl: './campaign-wizard.component.html',
  styleUrls: ['./campaign-wizard.component.scss'],
  providers: [
    CampaignWizardService,
    CampaignConversionService,
    WizardLocationsService,
    WizardScheduleService,
    WizardImageSizesService,
    ArtworkGeneratorService,
    BingMapsService,
    CampaignInitializationService,
    CampaignCompletionService,
  ],
})
export class CampaignWizardComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject();
  private lastY: number;
  private url$: Observable<string>;

  public hidePrimaryButton = false;
  public exitWizard = false;
  public tabData: {}[] = null;
  public pageDetails: string;
  public saveAndClose = false;
  public showLeftArrow = false;
  public showRightArrow = true;
  public reviewPage$: Observable<boolean>;
  public generatorPage = false;
  public campaignEnabled$: Observable<boolean>;
  public primaryButtonText$: Observable<string>;
  public budgetSet$: Observable<boolean>;
  public locationsSet$: Observable<boolean>;
  public artworkSet$: Observable<boolean>;
  public scheduleSet$: Observable<boolean>;
  public canRequestApproval$: Observable<boolean>;
  public nameSet$: Observable<boolean>;
  public pageDetails$: Observable<string>;
  public disablePrimaryButton$: Observable<boolean>;
  public enableDropdown$: Observable<boolean>;

  constructor(
    private campaignWizardService: CampaignWizardService,
    private generatorService: ArtworkGeneratorService,
    private campaignInitializationService: CampaignInitializationService,
    private completionService: CampaignCompletionService
  ) {
    this.url$ = this.campaignWizardService.url$;
    this.lastY = window.pageYOffset;
    this.campaignEnabled$ = this.campaignWizardService.campaignEnabled$;
    this.reviewPage$ = this.getReviewPage$();
    this.primaryButtonText$ = this.getPrimaryButtonText$();
    this.budgetSet$ = this.completionService.budgetSet$;
    this.locationsSet$ = this.completionService.locationsSet$;
    this.artworkSet$ = this.completionService.artworkSet$;
    this.scheduleSet$ = this.completionService.scheduleSet$;
    this.nameSet$ = this.completionService.nameSet$;
    this.canRequestApproval$ = this.completionService.canRequestApproval$;
    this.pageDetails$ = this.getPageDetails$();
    this.disablePrimaryButton$ = this.getDisablePrimaryButton$();
    this.enableDropdown$ = this.getEnableDropdown$();
  }

  async ngOnInit() {
    this.tabData = await this.campaignInitializationService.initialize();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public displayPrimaryButton($event: any) {
    const currentY = $event.touches[0].clientY;
    this.hidePrimaryButton = currentY <= this.lastY;
    this.lastY = currentY;
  }

  private getPrimaryButtonText$(): Observable<string> {
    return combineLatest([this.reviewPage$, this.campaignEnabled$]).pipe(
      map(([reviewPage, campaignEnabled]) => {
        if (reviewPage) {
          if (campaignEnabled) {
            return 'CAMPAIGN.CREATION.SAVE_AND_CLOSE';
          } else {
            return 'CAMPAIGN.CREATION.REQUEST_APPROVAL';
          }
        } else {
          return 'CAMPAIGN.CREATION.SAVE_AND_CONTINUE';
        }
      })
    );
  }

  private getEnableDropdown$(): Observable<boolean> {
    return combineLatest([this.reviewPage$, this.campaignEnabled$]).pipe(
      map(
        ([reviewPage, campaignEnabled]) =>
          !reviewPage || !(reviewPage && campaignEnabled)
      ),
      shareReplayRefCount(1)
    );
  }

  private getPageDetails$(): Observable<string> {
    return this.url$.pipe(
      map((url) => {
        const pages = ['locations', 'budget', 'schedule', 'artwork', 'review'];
        let pageDetails: string;
        this.generatorPage = false;
        if (_.includes(url, 'artwork')) {
          pageDetails = 'CAMPAIGN.CREATION.ADS_DETAILS';
          if (_.includes(url, 'generator')) {
            pageDetails = 'CAMPAIGN.CREATION.GENERATOR_DETAILS';
            this.generatorPage = true;
          } else if (_.includes(url, 'upload')) {
            pageDetails = '';
          }
        } else {
          _.forEach(pages, (page, pageNum) => {
            if (_.includes(url, page)) {
              pageDetails = `CAMPAIGN.CREATION.PAGES.${pageNum}.DETAILS`;
              return false; // Escapes lodash forEach
            }
          });
        }
        return pageDetails;
      })
    );
  }

  private getDisablePrimaryButton$(): Observable<boolean> {
    return combineLatest([
      this.reviewPage$,
      this.canRequestApproval$,
      this.campaignEnabled$,
    ]).pipe(
      map(
        ([reviewPage, canRequestApproval, campaignEnabled]) =>
          reviewPage && !canRequestApproval && !campaignEnabled
      ),
      shareReplayRefCount(1)
    );
  }

  private getReviewPage$(): Observable<boolean> {
    return this.url$.pipe(
      map((url) => _.includes(url, 'review')),
      shareReplayRefCount(1)
    );
  }

  public checkScroll($event: Event) {
    const nav = document.getElementById('navBarScroll');
    const leftOffset = nav.scrollLeft;
    this.showLeftArrow = leftOffset > 0;
    this.showRightArrow = leftOffset < nav.scrollWidth - nav.clientWidth - 24;
  }

  public scrollHorizontal(left: boolean) {
    const nav = document.getElementById('navBarScroll');
    nav.scrollBy({
      top: 0,
      left: left ? -nav.scrollWidth : nav.scrollWidth,
      behavior: 'smooth',
    });
  }

  public primaryButtonClick(): void {
    combineLatest([
      this.reviewPage$,
      this.canRequestApproval$,
      this.campaignEnabled$,
    ])
      .pipe(first())
      .subscribe(([reviewPage, canRequestApproval, campaignEnabled]) => {
        if (reviewPage) {
          if (canRequestApproval && !campaignEnabled) {
            this.saveClose(true);
          } else if (!canRequestApproval && !campaignEnabled) {
            return;
          } else if (campaignEnabled) {
            this.saveClose();
          }
        } else if (this.generatorPage) {
          this.saveGeneratorAd();
        } else {
          this.saveContinue();
        }
      });
  }

  public toggleSaveAndClose(): void {
    this.saveAndClose = !this.saveAndClose;
  }

  public saveClose(requestApproval = false): void {
    this.exitWizard = true;
    this.campaignWizardService.saveClose(requestApproval);
  }

  public saveContinue(): void {
    this.campaignWizardService.saveContinue();
  }

  public async saveCampaign(): Promise<void> {
    return this.campaignWizardService.saveCampaign();
  }

  public unsavedChanges(): boolean {
    return this.campaignWizardService.unsavedChanges();
  }

  public saveGeneratorAd(cont = true): void {
    if (!this.generatorService.saveGeneratedAd()) {
      return;
    }
    this.generatorService.savedAd$.pipe(first()).subscribe((ad: Ad) => {
      this.campaignWizardService.toggleAd(ad);
      if (cont) {
        this.saveContinue();
      } else {
        this.saveClose();
      }
    });
  }
}

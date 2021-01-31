import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  GoogleMapStyles,
  shareReplayRefCount,
  SignCluster,
  TranslationService,
  UserService,
} from '@marketplace/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { CampaignCompletionService } from '../../../services/campaign-wizard/campaign-completion/campaign-completion.service';
import { CampaignWizardService } from '../../../services/campaign-wizard/campaign-wizard.service';
import { WizardLocationsService } from '../../../services/campaign-wizard/wizard-locations/wizard-locations.service';

@Component({
  selector: 'campaigns-wizard-review',
  templateUrl: './wizard-review.component.html',
  styleUrls: ['./wizard-review.component.scss'],
})
export class WizardReviewComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject();
  private routes: {};
  public campaignForm: FormGroup;
  public nameCard: {};
  public locationsCard: {};
  public budgetCard: {};
  public scheduleCard: {};
  public artworkCard: {};
  public googleMapStyles = GoogleMapStyles;
  public campaignNameMax = 100;
  public cards: {}[];
  public selectedClusters$: Observable<SignCluster[]>;
  public billable$: Observable<boolean>;
  public selectedSignsCount: number;
  public selectedAdsCount$: Observable<number>;

  constructor(
    private campaignWizardService: CampaignWizardService,
    private locationsService: WizardLocationsService,
    private router: Router,
    private userService: UserService,
    private completionService: CampaignCompletionService,
    public translationService: TranslationService
  ) {
    this.routes = this.campaignWizardService.routes;
    this.campaignForm = this.campaignWizardService.campaignForm;
    this.selectedClusters$ = this.locationsService.selectedClusters$;
    this.selectedSignsCount = this.campaignWizardService.selectedSigns.length;
    this.selectedAdsCount$ = this.campaignWizardService.selectedAds$.pipe(
      takeUntil(this.destroy$),
      map((ads) => ads.length),
      shareReplayRefCount(1)
    );
    this.nameCard = {
      title: 'CAMPAIGN.CREATION.REVIEW.NAME',
      valid$: this.completionService.nameSet$,
    };
    this.locationsCard = {
      title: 'LOCATIONS',
      link: this.routes['LOCATIONS'],
      valid$: this.completionService.locationsSet$,
    };
    this.budgetCard = {
      title: 'CAMPAIGN.CREATION.REVIEW.BUDGET_AND_START',
      link: this.routes['BUDGET'],
      budget: this.campaignForm.get('budget').value,
      firstShown: this.campaignWizardService.firstShown(),
      startDate: this.campaignForm.get('startDate').value,
      endDate: this.campaignForm.get('endDate').value,
      valid$: this.completionService.budgetSet$,
    };
    this.scheduleCard = {
      title: 'SCHEDULE',
      link: this.routes['SCHEDULE'],
      valid$: this.completionService.scheduleSet$,
    };
    this.artworkCard = {
      title: 'ARTWORK',
      link: this.routes['ARTWORK'],
      valid$: this.completionService.artworkSet$,
    };
    this.cards = [
      this.nameCard,
      this.locationsCard,
      this.budgetCard,
      this.scheduleCard,
      this.artworkCard,
    ];
    this.billable$ = this.userService.$selectedOrgBillable.pipe(
      takeUntil(this.destroy$),
      shareReplayRefCount(1)
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public navigate(route: string) {
    this.router.navigateByUrl(route);
  }
}

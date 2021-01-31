import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Ad,
  AdApiService,
  AppRoutes,
  Campaign,
  CampaignsService,
  shareReplayRefCount,
  Sign,
} from '@marketplace/core';
import * as _ from 'lodash';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  first,
  map,
  startWith,
  tap,
} from 'rxjs/operators';
import { CampaignConversionService } from './campaign-conversion/campaign-conversion.service';
import { WeeklySchedule } from './wizard-schedule/wizard-schedule.service';

@Injectable()
export class CampaignWizardService {
  private campaign: Campaign;
  private signs: BehaviorSubject<Sign[]>;
  private selectedAds: BehaviorSubject<Ad[]>;
  private schedule: BehaviorSubject<WeeklySchedule>;
  private campaignEnabled: Subject<boolean> = new Subject();

  public allowAddingSigns$: Observable<boolean>;
  public allowAddingUniqueSign$: Observable<boolean>;
  public changedSigns$: Subject<Sign[]> = new Subject();
  public newCampaign = true;
  public minBudget$: Observable<number>;
  public maxBudget = 1000;
  public routes: {};
  public campaignForm: FormGroup;
  public selectedAds$: Observable<Ad[]>;
  public selectedSigns$: Observable<Sign[]>;
  public signs$: Observable<Sign[]>;
  public schedule$: Observable<WeeklySchedule>;
  public url$: Observable<string>;
  public campaignEnabled$: Observable<boolean>;
  public uniqueMinMpbLow = 1.0;
  public uniqueMinMpbMed = 5.0;
  public uniqueMinMpbHigh = 10.0;

  constructor(
    private fb: FormBuilder,
    private conversionService: CampaignConversionService,
    private campaignsService: CampaignsService,
    private router: Router,
    private adApiService: AdApiService
  ) {
    this.campaign = new Campaign();
    this.selectedAds = new BehaviorSubject([]);
    this.selectedAds$ = this.selectedAds.asObservable();
    this.signs = new BehaviorSubject([]);
    this.signs$ = this.signs.asObservable().pipe(shareReplayRefCount(1));
    this.selectedSigns$ = this.createSelectedSignsObservable();
    this.schedule = new BehaviorSubject([[]]);
    this.schedule$ = this.schedule.asObservable();
    this.campaignForm = this.fb.group({
      name: this.fb.control('New Campaign', [Validators.required]),
      budget: this.fb.control(null, [
        Validators.required,
        Validators.min(2),
        Validators.max(this.maxBudget),
      ]),
      startDate: this.fb.control(null),
      endDate: this.fb.control(null),
      mpbLow: this.fb.control(0.1, {
        validators: Validators.required,
        updateOn: 'blur',
      }),
      mpbMed: this.fb.control(0.25, {
        validators: Validators.required,
        updateOn: 'blur',
      }),
      mpbHigh: this.fb.control(0.5, {
        validators: Validators.required,
        updateOn: 'blur',
      }),
    });
    this.url$ = this.createUrlObservable();
    this.allowAddingSigns$ = this.createAllowAddingSignsObservable();
    this.allowAddingUniqueSign$ = this.createAllowAddingUniqueSignObservable();
    this.minBudget$ = this.createMinBudgetObservable();
    this.campaignEnabled$ = this.campaignEnabled
      .asObservable()
      .pipe(shareReplayRefCount(1));
  }

  public initialize(campaign: Campaign, signs: Sign[], routes: {}): void {
    this.campaign = campaign;
    if (campaign.id) {
      this.newCampaign = false;
    }
    this.signs.next(signs);
    this.routes = routes;
    this.conversionService.initializeValues(campaign, signs, this.campaignForm);
    this.signs.next(this.conversionService.initialSigns);
    this.selectedAds.next(this.conversionService.initialSelectedAds);
    this.schedule.next(this.conversionService.initialSchedule);
    this.campaignEnabled.next(campaign.enabled);
  }

  public get selectedSigns(): Sign[] {
    return this.signs.value.filter((s) => s.selected);
  }

  private createSelectedSignsObservable(): Observable<Sign[]> {
    return this.signs$.pipe(
      map((signs) => _.filter(signs, (s) => s.selected)),
      shareReplayRefCount(1)
    );
  }

  private createUrlObservable(): Observable<string> {
    return this.router.events.pipe(
      map((event) => _.get(event, 'url', null)),
      filter((url) => url !== null),
      distinctUntilChanged((prev, curr) => prev === curr),
      startWith(this.router.url),
      shareReplayRefCount(1)
    );
  }

  public async saveClose(requestApproval = false) {
    if (requestApproval) {
      this.campaign.enabled = true;
    }
    this.saveCampaign().then(() => {
      if (this.campaign.enabled) {
        this.router.navigate([AppRoutes.CAMPAIGNS]);
      } else {
        this.router.navigate([AppRoutes.CAMPAIGNS_DRAFTS]);
      }
    });
  }

  public async saveContinue() {
    this.saveCampaign().then(() => {
      this.navigateToNextPage();
    });
  }

  public uniqueSignCampaign(): boolean {
    return this.selectedSigns.length === 1 && this.selectedSigns[0].unique_sign;
  }

  private navigateToNextPage() {
    const pages = ['locations', 'budget', 'schedule', 'artwork', 'review'];
    _.forEach(pages, (page, index) => {
      if (_.includes(this.router.url, page)) {
        if (page !== 'review') {
          const nextRoute = _.find(this.routes, (r) =>
            _.includes(r, pages[index + 1])
          );
          this.router.navigateByUrl(nextRoute);
          document
            .querySelector('router-outlet')
            .scrollIntoView({ block: 'end' });
        } else {
          this.router.navigate([AppRoutes.CAMPAIGNS]);
        }
      }
    });
  }

  public async saveCampaign() {
    this.campaign = this.updatedCampaign();
    if (!this.newCampaign) {
      this.campaign = await this.campaignsService.updateCampaign(this.campaign);
    } else {
      this.campaign = await this.campaignsService.saveCampaign(this.campaign);
      this.newCampaign = false;
    }
    const ads = _.get(this.campaign, 'ad_group.ads', []).map((ad: Ad) => ad.id);
    const signs = _.get(this.campaign, 'sign_group.signs', []);
    if (ads.length && signs.length) {
      this.adApiService
        .backgroundResizeImage(ads, signs, false)
        .subscribe((_result) => {}, (err) => console.error(err));
    }
  }

  private updatedCampaign() {
    return this.conversionService.convertToCampaign(
      this.campaign,
      this.schedule.value,
      this.selectedSigns,
      this.selectedAds.value,
      this.campaignForm
    );
  }

  public unsavedChanges(): boolean {
    return !_.isEqual({ ...this.campaign }, { ...this.updatedCampaign() });
  }

  public firstShown(): string {
    return this.campaign.first_shown;
  }

  public updateSchedule(schedule: WeeklySchedule): void {
    this.schedule.next(schedule);
  }

  public addUniqueSign(sign: Sign): void {
    this.allowAddingUniqueSign$.pipe(first()).subscribe((allow) => {
      if (sign.unique_sign && allow) {
        this.signs.next(
          _.map(this.signs.value, (s) => {
            if (s.id === sign.id) {
              s.selected = true;
            }
            return s;
          })
        );
        this.changedSigns$.next([sign]);
        this.updateUniqueSignMpb();
      }
    });
  }

  private updateUniqueSignMpb(): void {
    const mpbLow = this.campaignForm.controls.mpbLow;
    const mpbMed = this.campaignForm.controls.mpbMed;
    const mpbHigh = this.campaignForm.controls.mpbHigh;
    if (mpbLow.value < this.uniqueMinMpbLow) {
      mpbLow.patchValue(this.uniqueMinMpbLow);
    }
    if (mpbMed.value < this.uniqueMinMpbMed) {
      mpbMed.patchValue(this.uniqueMinMpbMed);
    }
    if (mpbHigh.value < this.uniqueMinMpbHigh) {
      mpbHigh.patchValue(this.uniqueMinMpbHigh);
    }
  }

  public addSigns(signs: Sign[] | Sign): void {
    this.allowAddingSigns$.pipe(first()).subscribe((allow) => {
      if (allow) {
        const signsToAdd = _.castArray(signs);
        if (signsToAdd.length === 1 && signsToAdd[0].unique_sign) {
          this.addUniqueSign(signsToAdd[0]);
        } else {
          this.signs.next(
            this.signs.value.map((s) => {
              if (
                _.findIndex(signsToAdd, ['id', s.id]) > -1 &&
                !s.unique_sign
              ) {
                s.selected = true;
              }
              return s;
            })
          );
          this.changedSigns$.next(signsToAdd);
        }
      }
    });
  }

  public removeSigns(signs?: Sign[] | Sign): void {
    if (!signs) {
      const previousSigns = _.cloneDeep(this.signs.value);
      this.signs.next(
        _.map(this.signs.value, (s) => {
          s.selected = false;
          return s;
        })
      );
      this.changedSigns$.next(previousSigns);
    } else {
      const signsToRemove = _.castArray(signs);
      this.signs.next(
        this.signs.value.map((s) => {
          if (_.findIndex(signsToRemove, ['id', s.id]) > -1) {
            s.selected = false;
          }
          return s;
        })
      );
      this.changedSigns$.next(signsToRemove);
    }
  }

  public toggleAd(ad: Ad) {
    const index = _.findIndex(this.selectedAds.value, ['id', ad.id]);
    const updatedAds = this.selectedAds.value.slice();
    if (index === -1) {
      updatedAds.push(ad);
    } else {
      updatedAds.splice(index, 1);
    }
    this.selectedAds.next(updatedAds);
  }

  private createAllowAddingSignsObservable(): Observable<boolean> {
    return this.signs.pipe(
      map((signs) => _.filter(signs, (s) => s.selected)),
      map((selected) => !_.some(selected, 'unique_sign')),
      shareReplayRefCount(1)
    );
  }

  private createAllowAddingUniqueSignObservable(): Observable<boolean> {
    return this.signs$.pipe(
      map((signs) => _.filter(signs, (s) => s.selected)),
      map((selected) => !selected.length),
      shareReplayRefCount(1)
    );
  }

  private createMinBudgetObservable(): Observable<number> {
    return this.signs$.pipe(
      map((signs) => _.filter(signs, (s) => s.selected)),
      map((selected) => (selected.length > 0 ? 2 * selected.length : 0)),
      tap((minBudget) => {
        this.campaignForm
          .get('budget')
          .setValidators([Validators.required, Validators.min(minBudget)]);
        this.campaignForm.get('budget').updateValueAndValidity();
        this.campaignForm.get('budget').markAsTouched();
      }),
      shareReplayRefCount(1)
    );
  }

  public setRecommendedBudget(): void {
    const signCount = this.selectedSigns.length;
    let recommendedBudget = signCount > 2 ? (signCount - 2) * 10 + 20 : 20;
    if (signCount > 0 && _.some(this.selectedSigns, 'unique_sign')) {
      recommendedBudget = 50;
    }
    this.campaignForm.patchValue({ budget: recommendedBudget });
    this.campaignForm.get('budget').updateValueAndValidity();
  }
}

import { Injectable } from '@angular/core';
import { shareReplayRefCount, UserService } from '@marketplace/core';
import * as _ from 'lodash';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CampaignWizardService } from '../campaign-wizard.service';
import {
  DaySchedule,
  HourPrice,
} from '../wizard-schedule/wizard-schedule.service';

@Injectable({
  providedIn: 'root',
})
export class CampaignCompletionService {
  public locationsSet$: Observable<boolean>;
  public budgetSet$: Observable<boolean>;
  public scheduleSet$: Observable<boolean>;
  public artworkSet$: Observable<boolean>;
  public nameSet$: Observable<boolean>;
  public canRequestApproval$: Observable<boolean>;

  constructor(
    private campaignWizardService: CampaignWizardService,
    private userService: UserService
  ) {
    this.locationsSet$ = this.getLocationsSet$();
    this.budgetSet$ = this.getBudgetSet$();
    this.scheduleSet$ = this.getScheduleSet$();
    this.artworkSet$ = this.getArtworkSet$();
    this.nameSet$ = this.getNameSet$();
    this.canRequestApproval$ = this.getCanRequestApproval$();
  }

  private getCanRequestApproval$(): Observable<boolean> {
    return combineLatest([
      this.locationsSet$,
      // this.budgetSet$,  TODO create budget curve based on number of signs
      this.scheduleSet$,
      this.artworkSet$,
      this.nameSet$,
      this.userService.$selectedOrgBillable,
    ]).pipe(map((requiredFields) => _.every(requiredFields)));
  }

  private getLocationsSet$(): Observable<boolean> {
    return this.campaignWizardService.signs$.pipe(
      map((signs) => _.filter(signs, (s) => s.selected)),
      map((signs) => signs.length > 0),
      shareReplayRefCount(1)
    );
  }

  private getBudgetValid$(): Observable<boolean> {
    return this.campaignWizardService.campaignForm
      .get('budget')
      .statusChanges.pipe(
        startWith(this.campaignWizardService.campaignForm.get('budget').status),
        map((status) => (status === 'VALID' ? true : false))
      );
  }

  private getBudgetSet$(): Observable<boolean> {
    return combineLatest([
      this.getBudgetValid$(),
      this.campaignWizardService.minBudget$,
    ]).pipe(
      map(([valid, _min]) => valid),
      shareReplayRefCount(1)
    );
  }

  private getScheduleSet$(): Observable<boolean> {
    return this.campaignWizardService.schedule$.pipe(
      map((schedule) =>
        _.some(schedule, (day: DaySchedule[]) => {
          return _.some(day, (hour: HourPrice) => hour !== 0);
        })
      ),
      shareReplayRefCount(1)
    );
  }

  private getArtworkSet$(): Observable<boolean> {
    return this.campaignWizardService.selectedAds$.pipe(
      map((ads) => ads.length > 0),
      shareReplayRefCount(1)
    );
  }

  private getNameSet$(): Observable<boolean> {
    return this.campaignWizardService.campaignForm
      .get('name')
      .valueChanges.pipe(
        startWith(this.campaignWizardService.campaignForm.get('name').value),
        map((name) => name.length > 0),
        shareReplayRefCount(1)
      );
  }
}

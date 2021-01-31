import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormControl, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { first, map, startWith, takeUntil } from 'rxjs/operators';
import { CampaignWizardService } from '../../../services/campaign-wizard/campaign-wizard.service';
import {
  HourPrice,
  SchedulePreset,
  SchedulePresetKeys,
  WeeklySchedule,
  WizardScheduleService,
} from '../../../services/campaign-wizard/wizard-schedule/wizard-schedule.service';

@Component({
  selector: 'campaigns-wizard-schedule',
  templateUrl: './wizard-schedule.component.html',
  styleUrls: ['./wizard-schedule.component.scss'],
})
export class WizardScheduleComponent implements OnInit, OnDestroy {
  private tileStart: { hour: number; day: number; value: HourPrice };
  private tileEnd: { hour: number; day: number };
  private destroy$: Subject<boolean> = new Subject();
  public minMpbLow: number;
  public minMpbMed: number;
  public minMpbHigh: number;
  public hourPrice = {
    zero: 0 as HourPrice,
    low: 'low' as HourPrice,
    med: 'med' as HourPrice,
    high: 'high' as HourPrice,
  }; // For template

  public campaignForm: FormGroup;
  public mpbLow: FormControl;
  public mpbMed: FormControl;
  public mpbHigh: FormControl;
  public localDays: string[];
  public localHours: string[];
  public schedulePresetKeys: SchedulePresetKeys;
  public schedule: WeeklySchedule;
  public selectedPreset$: Observable<SchedulePreset>;
  public schedule$: Observable<WeeklySchedule>;
  public gutterSize$: Observable<string>;

  constructor(
    private campaignWizardService: CampaignWizardService,
    private scheduleService: WizardScheduleService,
    private media: MediaObserver
  ) {
    this.campaignForm = this.campaignWizardService.campaignForm;
    this.tileEnd = { hour: null, day: null };
    this.localDays = this.scheduleService.localDays();
    this.localHours = this.scheduleService.localHours();
    this.schedulePresetKeys = this.scheduleService.presetKeys;
    this.schedule = [[]];
    this.mpbLow = this.campaignForm.controls.mpbLow as FormControl;
    this.mpbMed = this.campaignForm.controls.mpbMed as FormControl;
    this.mpbHigh = this.campaignForm.controls.mpbHigh as FormControl;
    this.selectedPreset$ = this.scheduleService.selectedPreset$;
    this.schedule$ = this.campaignWizardService.schedule$;
    this.gutterSize$ = this.getGutterSize$();
    const uniqueSignCampaign = this.campaignWizardService.uniqueSignCampaign();
    this.minMpbLow = uniqueSignCampaign
      ? this.campaignWizardService.uniqueMinMpbLow
      : 0.01;
    this.minMpbMed = uniqueSignCampaign
      ? this.campaignWizardService.uniqueMinMpbMed
      : null;
    this.minMpbHigh = uniqueSignCampaign
      ? this.campaignWizardService.uniqueMinMpbHigh
      : null;
  }

  async ngOnInit() {
    const initialSchedule = await this.schedule$.pipe(first()).toPromise();
    if (!initialSchedule) {
      this.updateSchedule(this.scheduleService.getMaxAudience());
    }
    this.schedule$
      .pipe(takeUntil(this.destroy$))
      .subscribe((schedule: WeeklySchedule) => {
        this.schedule = schedule;
      });
    this.watchMpb();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public centValue(original: number, modifier: number) {
    return Math.round(original * 100 + modifier * 100) / 100;
  }

  private getGutterSize$(): Observable<string> {
    return this.media
      .asObservable()
      .pipe(
        map((changes: MediaChange[]) =>
          Boolean(_.find(changes, (change) => change.mqAlias === 'lt-md'))
            ? '5px'
            : '0px'
        )
      );
  }

  private watchMpb(): void {
    this.mpbLow.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        startWith(this.mpbLow.value)
      )
      .subscribe((low) => {
        if (low < this.minMpbLow) {
          this.mpbLow.patchValue(this.minMpbLow);
        } else if (low >= this.mpbMed.value) {
          this.mpbLow.patchValue(this.centValue(this.mpbMed.value, -0.01));
        }
      });
    this.mpbMed.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        startWith(this.mpbMed.value)
      )
      .subscribe((med) => {
        if (this.minMpbMed && med < this.minMpbMed) {
          this.mpbMed.patchValue(this.centValue(this.minMpbMed, 0));
        } else if (med <= this.mpbLow.value) {
          this.mpbMed.patchValue(this.centValue(this.mpbLow.value, 0.01));
        } else if (med >= this.mpbHigh.value) {
          this.mpbMed.patchValue(this.centValue(this.mpbHigh.value, -0.01));
        }
      });
    this.mpbHigh.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        startWith(this.mpbHigh.value)
      )
      .subscribe((high) => {
        if (this.minMpbHigh && high < this.minMpbHigh) {
          this.mpbHigh.patchValue(this.centValue(this.minMpbHigh, 0));
        } else if (high <= this.mpbMed.value) {
          this.mpbHigh.patchValue(this.centValue(this.mpbMed.value, 0.01));
        }
      });
  }

  public updateSchedule(schedule: WeeklySchedule): void {
    this.campaignWizardService.updateSchedule(schedule);
    this.scheduleService.matchPreset(schedule);
  }

  public updateSelectedPreset(preset: SchedulePreset) {
    this.updateSchedule(this.scheduleService.updateSelectedPreset(preset));
  }

  private updateAll(value: HourPrice) {
    _.forEach(_.range(24), (hour) => {
      _.forEach(_.range(7), (day) => {
        this.schedule[hour][day] = value;
      });
    });
    this.updateSchedule(this.schedule);
  }

  public clear() {
    this.updateAll(0);
  }

  public selectAll() {
    this.updateAll(this.nextHourPrice(0, 0));
  }

  public selectDay(day: number): void {
    const value = this.nextHourPrice(0, day) as HourPrice;
    _.forEach(_.range(24), (hour) => {
      this.schedule[hour][day] = value;
    });
    this.updateSchedule(this.schedule);
  }

  public selectHour(hour: number): void {
    const value = this.nextHourPrice(hour, 0) as HourPrice;
    _.forEach(_.range(7), (day) => {
      this.schedule[hour][day] = value;
    });
    this.updateSchedule(this.schedule);
  }

  private nextHourPrice(hour: number, day: number): HourPrice {
    switch (this.schedule[hour][day]) {
      case 0:
        return 'high';
      case 'high':
        return 'med';
      case 'med':
        return 'low';
      case 'low':
        return 0;
    }
  }

  public hourMouseDown(hour: number, day: number): void {
    this.schedule[hour][day] = this.nextHourPrice(hour, day) as HourPrice;
    this.tileStart = {
      hour: hour,
      day: day,
      value: this.schedule[hour][day],
    };
  }

  public hourMouseOver(hour: number, day: number): void {
    if (this.tileEnd.day === day && this.tileEnd.hour === hour) {
      return;
    }

    if (this.tileStart) {
      const value = this.tileStart.value;
      this.tileEnd = { day: day, hour: hour };
      this.schedule[hour][day] = value;
    }
  }

  public hourMouseUp(): void {
    if (this.tileStart) {
      this.updateSchedule(this.schedule);
    }
    this.tileStart = null;
    this.tileEnd = { day: null, hour: null };
  }
}

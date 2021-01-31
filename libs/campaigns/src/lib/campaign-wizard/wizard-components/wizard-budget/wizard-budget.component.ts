import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { Profile, UserService } from '@marketplace/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { CampaignWizardService } from '../../../services/campaign-wizard/campaign-wizard.service';

@Component({
  selector: 'campaigns-wizard-budget',
  templateUrl: './wizard-budget.component.html',
  styleUrls: ['./wizard-budget.component.scss'],
})
export class WizardBudgetComponent {
  public campaignForm: FormGroup;
  public today = moment().format('YYYY-MM-DD');
  public startOption: null | 'date';
  public endOption: null | 'date';
  public selectedSignsCount: number;
  public minBudget$: Observable<number>;
  public maxBudget: number;
  public profile$: Observable<Profile>;

  constructor(
    private campaignWizardService: CampaignWizardService,
    private userService: UserService
  ) {
    this.campaignForm = this.campaignWizardService.campaignForm;
    if (!this.campaignForm.controls['budget'].value) {
      this.campaignWizardService.setRecommendedBudget();
    }
    this.startOption = this.campaignForm.get('startDate').value ? 'date' : null;
    this.endOption = this.campaignForm.get('endDate').value ? 'date' : null;
    this.profile$ = this.userService.$profile;
    this.selectedSignsCount = this.campaignWizardService.selectedSigns.length;
    this.minBudget$ = this.campaignWizardService.minBudget$;
    this.maxBudget = this.campaignWizardService.maxBudget;
  }

  public datePickerClosed(option: 'start' | 'end'): void {
    if (option === 'start') {
      this.startOption = this.campaignForm.controls['startDate'].value
        ? 'date'
        : null;
    } else if (option === 'end') {
      this.endOption = this.campaignForm.controls['endDate'].value
        ? 'date'
        : null;
    }
  }

  public checkValidDates(): void {
    const start = this.campaignForm.controls.startDate.value;
    const end = this.campaignForm.controls.endDate.value;
    if (end && start > end) {
      this.endOption = null;
      this.campaignForm.controls['endDate'].setValue(null);
    }
  }

  public radioChange(
    radio: MatRadioChange,
    option: 'startDate' | 'endDate'
  ): void {
    if (radio.value === null) {
      this.campaignForm.controls[option].patchValue(null);
    }
  }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampaignAnalyticsComponent } from './campaign-container/campaign-analytics/campaign-analytics.component';
import { CampaignContainerComponent } from './campaign-container/campaign-container.component';
import { CampaignWizardComponent } from './campaign-wizard/campaign-wizard.component';
import { WizardArtworkComponent } from './campaign-wizard/wizard-components/wizard-artwork/wizard-artwork.component';
import { WizardBudgetComponent } from './campaign-wizard/wizard-components/wizard-budget/wizard-budget.component';
import { WizardLocationsComponent } from './campaign-wizard/wizard-components/wizard-locations/wizard-locations.component';
import { WizardReviewComponent } from './campaign-wizard/wizard-components/wizard-review/wizard-review.component';
import { WizardScheduleComponent } from './campaign-wizard/wizard-components/wizard-schedule/wizard-schedule.component';
import { WizardUnsavedChangesGuard } from './campaign-wizard/wizard-unsaved-changes-guard/wizard-unsaved-changes.guard';
import { CampaignsContainerComponent } from './campaigns-container.component';
import { CampaignsComponent } from './campaigns/campaigns.component';

const wizardComponents = [
  { path: 'locations', component: WizardLocationsComponent },
  { path: 'budget', component: WizardBudgetComponent },
  { path: 'schedule', component: WizardScheduleComponent },
  {
    path: 'artwork',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'das',
      },
      {
        path: ':subComponent',
        component: WizardArtworkComponent,
      },
    ],
  },
  { path: 'review', component: WizardReviewComponent },
  { path: '', redirectTo: 'locations', pathMatch: 'full' },
];

const routes: Routes = [
  {
    path: '',
    component: CampaignsContainerComponent,
    children: [
      { path: '', component: CampaignsComponent },
      { path: 'archived', component: CampaignsComponent },
      { path: 'drafts', component: CampaignsComponent },
    ],
  },
  {
    path: 'new',
    children: [
      {
        path: '',
        component: CampaignWizardComponent,
        children: wizardComponents,
        canDeactivate: [WizardUnsavedChangesGuard],
      },
      {
        path: ':campaignId',
        component: CampaignWizardComponent,
        children: wizardComponents,
        canDeactivate: [WizardUnsavedChangesGuard],
      },
    ],
  },
  {
    path: 'edit',
    children: [
      {
        path: '',
        component: CampaignWizardComponent,
        children: wizardComponents,
        canDeactivate: [WizardUnsavedChangesGuard],
      },
      {
        path: ':campaignId',
        component: CampaignWizardComponent,
        children: wizardComponents,
        canDeactivate: [WizardUnsavedChangesGuard],
      },
    ],
  },
  {
    path: ':campaignId',
    component: CampaignContainerComponent,
    children: [{ path: 'analytics', component: CampaignAnalyticsComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaignsRoutingModule {}

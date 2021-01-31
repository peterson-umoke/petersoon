import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdsModule } from '@marketplace/ads';
import { CoreModule, MaterialModule } from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CampaignCardComponent } from './campaign-card/campaign-card.component';
import { CampaignAnalyticsComponent } from './campaign-container/campaign-analytics/campaign-analytics.component';
import { CampaignContainerComponent } from './campaign-container/campaign-container.component';
import { CampaignFlipsComponent } from './campaign-container/campaign-flips/campaign-flips.component';
import { CampaignHeaderComponent } from './campaign-container/campaign-header/campaign-header.component';
import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { CampaignMenuComponent } from './campaign-menu/campaign-menu.component';
import { CampaignPlayPauseComponent } from './campaign-play-pause/campaign-play-pause.component';
import { CampaignWizardComponent } from './campaign-wizard/campaign-wizard.component';
import { WizardAdsComponent } from './campaign-wizard/wizard-components/wizard-artwork/wizard-ads/wizard-ads.component';
import { WizardArtworkSizesComponent } from './campaign-wizard/wizard-components/wizard-artwork/wizard-artwork-sizes/wizard-artwork-sizes.component';
import { WizardArtworkComponent } from './campaign-wizard/wizard-components/wizard-artwork/wizard-artwork.component';
import { WizardUploaderRowComponent } from './campaign-wizard/wizard-components/wizard-artwork/wizard-uploader/uploader-row/wizard-uploader-row.component';
import { WizardAdUploaderComponent } from './campaign-wizard/wizard-components/wizard-artwork/wizard-uploader/wizard-ad-uploader.component';
import { WizardBudgetComponent } from './campaign-wizard/wizard-components/wizard-budget/wizard-budget.component';
import { WizardLocationsCardComponent } from './campaign-wizard/wizard-components/wizard-locations/wizard-locations-card/wizard-locations-card.component';
import { WizardLocationsComponent } from './campaign-wizard/wizard-components/wizard-locations/wizard-locations.component';
import { WizardReviewComponent } from './campaign-wizard/wizard-components/wizard-review/wizard-review.component';
import { WizardScheduleComponent } from './campaign-wizard/wizard-components/wizard-schedule/wizard-schedule.component';
import { CampaignsContainerComponent } from './campaigns-container.component';
import { CampaignsHeaderComponent } from './campaigns-header/campaigns-header.component';
import { CampaignsRoutingModule } from './campaigns-routing.module';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { WaitingToLaunchComponent } from './waiting-to-launch/waiting-to-launch.component';

const components: any[] = [
  CampaignsContainerComponent,
  CampaignCardComponent,
  CampaignAnalyticsComponent,
  CampaignFlipsComponent,
  CampaignHeaderComponent,
  CampaignContainerComponent,
  CampaignListComponent,
  CampaignMenuComponent,
  CampaignPlayPauseComponent,
  CampaignsComponent,
  CampaignsHeaderComponent,
  WaitingToLaunchComponent,
  CampaignsContainerComponent,
  CampaignWizardComponent,
  WizardLocationsComponent,
  WizardLocationsCardComponent,
  WizardBudgetComponent,
  WizardReviewComponent,
  WizardScheduleComponent,
  WizardArtworkComponent,
  WizardAdsComponent,
  WizardArtworkSizesComponent,
  WizardAdUploaderComponent,
  WizardUploaderRowComponent,
];

@NgModule({
  declarations: components,
  exports: components,
  imports: [
    CommonModule,
    CoreModule,
    CampaignsRoutingModule,
    FlexLayoutModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxChartsModule,
    AgmCoreModule,
    AdsModule,
  ],
})
export class CampaignsModule {}

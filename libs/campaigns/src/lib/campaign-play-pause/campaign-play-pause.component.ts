import { Component, Input } from '@angular/core';
import { Campaign, CampaignsService } from '@marketplace/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-campaign-play-pause',
  templateUrl: './campaign-play-pause.component.html',
  styleUrls: ['./campaign-play-pause.component.scss'],
})
export class CampaignPlayPauseComponent {
  @Input() campaign: Campaign;
  @Input() requestApproval: boolean;

  constructor(public campaignsService: CampaignsService) {}

  public changeStatus(status: boolean): void {
    this.campaign.enabled = status;
    this.campaignsService
      .updateCampaign(this.campaign)
      .then((savedCampaign: Campaign) => {
        if (savedCampaign) {
          this.campaign.enabled = status;
        }

        this.campaignsService.goToPage(savedCampaign);
      });
  }
}

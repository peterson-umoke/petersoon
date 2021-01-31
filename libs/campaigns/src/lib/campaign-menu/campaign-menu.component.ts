import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  AppRoutes,
  Campaign,
  CampaignRoutes,
  CampaignsService,
  ChangeDialogComponent,
} from '@marketplace/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-campaign-menu',
  templateUrl: './campaign-menu.component.html',
  styleUrls: ['./campaign-menu.component.scss'],
})
export class CampaignMenuComponent implements OnInit {
  @Input() campaign: Campaign;
  @Input() iconType = 'more_vert';

  constructor(
    private dialog: MatDialog,
    private campaignsService: CampaignsService,
    private router: Router
  ) {}

  ngOnInit() {}

  public analytics() {
    this.router.navigateByUrl(AppRoutes.campaignAnalytics(this.campaign.id));
  }

  public archive() {
    this.campaignsService
      .archiveCampaign(this.campaign)
      .then((archivedCampaign: Campaign) => {
        this.campaignsService.goToPage(archivedCampaign);
      });
  }

  public delete() {
    const dialogRef = this.dialog.open(ChangeDialogComponent, {
      data: { action: 'DELETE.TEXT', type: 'CHANGE.DELETE_CAMPAIGN' },
    });

    dialogRef.afterClosed().subscribe(async (deleteCampaign: boolean) => {
      if (deleteCampaign) {
        await this.campaignsService.deleteCampaign(this.campaign);
      }
    });
  }

  public details() {
    this.router.navigateByUrl(
      AppRoutes.editCampaignRoute(this.campaign.id, CampaignRoutes.REVIEW)
    );
  }

  public duplicate() {
    this.router.navigate([AppRoutes.NEW_CAMPAIGN_LOCATIONS], {
      queryParams: { duplicate: this.campaign.id },
    });
  }

  public edit() {
    this.router.navigateByUrl(
      AppRoutes.editCampaignRoute(this.campaign.id, CampaignRoutes.LOCATIONS)
    );
  }

  public unarchive() {
    this.campaignsService
      .unarchiveCampaign(this.campaign)
      .then((unarchivedCampaign: Campaign) => {
        this.campaignsService.goToPage(unarchivedCampaign);
      });
  }
}

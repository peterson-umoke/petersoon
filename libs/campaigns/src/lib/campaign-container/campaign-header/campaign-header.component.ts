import { Component, OnInit } from '@angular/core';
import {
  AppRoutes,
  Campaign,
  CampaignService,
  Organization,
  RouterService,
  TitleService,
  UserService,
} from '@marketplace/core';
import { Observable } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-campaign-header',
  templateUrl: './campaign-header.component.html',
  styleUrls: ['./campaign-header.component.scss'],
})
export class CampaignHeaderComponent implements OnInit {
  public activeLinkIndex: number;
  public analyticsRoute: string;
  public appRoutes = AppRoutes;
  public campaign: Campaign;
  public detailsRoute: string;

  constructor(
    private campaignService: CampaignService,
    private routerService: RouterService,
    private titleService: TitleService,
    private userService: UserService
  ) {}

  ngOnInit() {
    const orgSub = this.userService.$selectedOrganization.subscribe((org) => {
      setTimeout(() => {
        if (org) {
          this.routerService.$route
            .subscribe((route: string) => {
              if (route && route.includes('analytics')) {
                this.getCampaign(route, org);
              }
            })
            .unsubscribe();
          orgSub.unsubscribe();
        }
      });
    });
  }

  private setActiveLink(route: string): void {
    if (route === 'analytics') {
      this.activeLinkIndex = 0;
    }
  }

  private getCampaign(route: string, org: Organization): void {
    const campaignArr = route.split('campaigns/')[1].split('/');
    this.setActiveLink(campaignArr[0]);
    this.analyticsRoute = AppRoutes.campaignAnalytics(campaignArr[0]);
    this.campaignService
      .getCampaignStats(org.id, campaignArr[0])
      .then((campaignObservable: Observable<any>) => {
        campaignObservable.subscribe((campaign: Campaign) => {
          if (campaign) {
            this.titleService.setTitle(campaign.name);
            this.campaign = campaign;
          }
        });
      });
  }
}

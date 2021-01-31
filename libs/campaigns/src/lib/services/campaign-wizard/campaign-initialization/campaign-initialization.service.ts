import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AdsService,
  AppRoutes,
  Campaign,
  CampaignApiService,
  CampaignRoutes,
  CampaignType,
  Organization,
  SignApiService,
  UserService,
} from '@marketplace/core';
import * as _ from 'lodash';
import * as momentTZ from 'moment-timezone';
import { forkJoin, Observable, of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { CampaignWizardService } from '../campaign-wizard.service';

@Injectable()
export class CampaignInitializationService {
  public routes: {};
  public tabData: {}[];

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private signApiService: SignApiService,
    private campaignApiService: CampaignApiService,
    private adsService: AdsService,
    private campaignWizardService: CampaignWizardService
  ) {}

  public async initialize(): Promise<{}[]> {
    return forkJoin([
      this.getInitialCampaign$(),
      this.signApiService.geoQuery(),
    ])
      .pipe(
        map(([campaign, signs]) => {
          this.routes = this.initializeRoutes(campaign.id || null);
          this.campaignWizardService.initialize(campaign, signs, this.routes);
          this.tabData = this.initializeTabData(this.routes);
          return this.tabData;
        })
      )
      .toPromise();
  }

  private getInitialCampaign$(): Observable<Campaign> {
    const selectedOrg$ = this.userService.$selectedOrganization.pipe(
      first((o) => o != null)
    );
    const edit$ = this.route.params.pipe(
      first(),
      map((params) => params['campaignId'] || null)
    );
    const duplicate$ = this.route.queryParamMap.pipe(
      first(),
      map((qpMap) => qpMap.get('duplicate') || null)
    );
    return forkJoin([selectedOrg$, edit$, duplicate$]).pipe(
      switchMap(([org, edit, dup]) => {
        this.adsService.getAds();
        return this.campaignSwitch$(org, edit, dup);
      })
    );
  }

  private campaignSwitch$(
    org: Organization,
    edit?: string,
    dup?: string
  ): Observable<Campaign> {
    if (edit || dup) {
      return this.campaignApiService.get(edit || dup).pipe(
        map((c) => {
          if (dup) {
            return c.clone({
              campaign_type: CampaignType.STANDARD,
              conflict: false,
              description: '',
              id: null,
              modified: null,
              name: c.name + ' Duplicate',
              organization: org.id,
            });
          }
          return c;
        })
      );
    } else {
      return of(
        new Campaign({
          enabled: false,
          organization: org.id,
          timezone: momentTZ.tz.guess(),
        })
      );
    }
  }

  private initializeRoutes(
    campaignId?: string
  ): { [routeName: string]: string } {
    const routes = {};
    _.forEach(_.keys(CampaignRoutes), (route) => {
      if (campaignId) {
        routes[route] = AppRoutes.editCampaignRoute(
          campaignId,
          CampaignRoutes[route]
        );
      } else {
        routes[route] = AppRoutes.newCampaignRoute(CampaignRoutes[route]);
      }
    });
    return routes;
  }

  private initializeTabData(routes: {
    [routeName: string]: string;
  }): { route: string; title: string }[] {
    const tabs = ['LOCATIONS', 'BUDGET', 'SCHEDULE', 'ARTWORK', 'REVIEW'];
    return _.map(tabs, (title) => {
      return {
        route: routes[title],
        title: title,
      };
    });
  }
}

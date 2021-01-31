import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AppRoutes,
  Campaign,
  CampaignRoutes,
  TranslationService,
} from '@marketplace/core';
import * as _ from 'lodash';

const MAX_IMAGES = 7;
const PADDING = 3;

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-campaign-card',
  templateUrl: './campaign-card.component.html',
  styleUrls: ['./campaign-card.component.scss'],
})
export class CampaignCardComponent implements OnInit {
  @Input() campaign: Campaign;

  private routeActive: boolean;
  private thumbnailLength: number;

  public analytics: string;
  public artwork: string;
  public budget: string;
  public details: string;
  public imageIndex = 0;
  public imageNumber: Array<{ display: string; index: number }> = [];
  public review: string;
  public showNotifications = false;
  public waitingToLaunch: boolean;

  constructor(
    private router: Router,
    public translationService: TranslationService
  ) {}

  ngOnInit() {
    this.thumbnailLength = this.campaign.thumbnails.length;
    this.routeActive = !(
      this.router.url.includes('drafts') || this.router.url.includes('archived')
    );

    _.forEach(this.campaign.thumbnails, (thumbnail, i) => {
      this.imageNumber.push({
        display: i < MAX_IMAGES ? String(i + 1) : '...',
        index: i,
      });
      return i < MAX_IMAGES;
    });

    this.analytics = AppRoutes.campaignAnalytics(this.campaign.id);
    this.artwork = AppRoutes.editCampaignRoute(
      this.campaign.id,
      CampaignRoutes.ARTWORK
    );
    this.budget = AppRoutes.editCampaignRoute(
      this.campaign.id,
      CampaignRoutes.BUDGET
    );
    this.details = AppRoutes.campaignDetails(this.campaign.id);
    this.review = AppRoutes.editCampaignRoute(
      this.campaign.id,
      CampaignRoutes.REVIEW
    );

    if (this.routeActive && this.campaign.checklist) {
      this.waitingToLaunch = this.campaign.underModeration;
    }
  }

  public changeImage(index: number) {
    this.imageIndex = index;
    this.imageNumber = this.createNumberArray(index);
  }

  /**
   * Create the padded number array of thumbnails
   * @param index
   */
  private createNumberArray(index: number) {
    let low = index - PADDING;
    let high = index + PADDING;
    const arr = [];

    if (low < 0) {
      high += -low;
      low = 0;
    }

    if (high >= this.thumbnailLength && this.thumbnailLength > MAX_IMAGES) {
      low = low - (high - this.thumbnailLength) - 1;
      high = this.thumbnailLength - 1;
    }

    if (low > 0) {
      arr.push({ display: '...', index: low - 1 });
    }

    for (let i = low; i <= high && i < this.thumbnailLength; i++) {
      arr.push({ display: String(i + 1), index: i });
    }

    if (this.thumbnailLength > high + 1) {
      arr.push({ display: '...', index: high + 1 });
    }

    return arr;
  }

  /**
   * Goes to route
   * @param route
   */
  public goTo(route: string) {
    this.router.navigateByUrl(route);
  }

  /**
   * Calls function for notification link to route or perform functionality
   * @param linkFunction
   */
  public invokeLinkFunction(linkFunction: () => void) {
    linkFunction();
  }
}

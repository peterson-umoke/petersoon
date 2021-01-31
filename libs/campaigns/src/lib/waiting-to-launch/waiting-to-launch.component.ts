import { Component, Input, OnInit } from '@angular/core';
import { Campaign } from '@marketplace/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-waiting-to-launch',
  templateUrl: './waiting-to-launch.component.html',
  styleUrls: ['./waiting-to-launch.component.scss'],
})
export class WaitingToLaunchComponent implements OnInit {
  @Input() campaign: Campaign;
  @Input() artworkLink: string;
  public imageIndex = 0;
  public complete =
    'https://blipbillboards-marketplace.s3.amazonaws.com/svg/complete.svg';
  public inProgress =
    'https://blipbillboards-marketplace.s3.amazonaws.com/svg/in-progress.svg';
  public incomplete =
    'https://blipbillboards-marketplace.s3.amazonaws.com/svg/incomplete.svg';

  constructor() {}

  ngOnInit() {
    this.campaign = this.campaign;
  }

  changeImage(action: number) {
    if (action < 0) {
      this.imageIndex = this.campaign.thumbnails.length - 1;
    } else if (action > this.campaign.thumbnails.length - 1) {
      this.imageIndex = 0;
    } else {
      this.imageIndex = action;
    }
  }

  /**
   * Calls function for notification link to route or perform functionality
   * @param linkFunction
   */
  public verifyLink(
    notifications: Array<{
      key: string;
      params: { linkText?: string; linkFunction?: () => void };
    }>,
    type: string
  ) {
    notifications.forEach((notification) => {
      if (
        notification.key === 'CAMPAIGN.NOTIFICATIONS.VERIFICATIONS' &&
        type === 'verify' &&
        notification.params.linkFunction
      ) {
        notification.params.linkFunction();
      }
    });
  }
}

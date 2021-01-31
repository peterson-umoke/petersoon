import { Component, OnInit } from '@angular/core';
import {
  SnackBarService,
  TranslationService,
  UserService,
} from '@marketplace/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.scss'],
})
export class RewardsComponent implements OnInit {
  public activeOptionIndex = 1;
  public userId: string;

  constructor(
    private snackBarService: SnackBarService,
    private translationService: TranslationService,
    public userService: UserService // Used in HTML
  ) {}

  ngOnInit() {
    this.userService.$profile.subscribe((profile) => {
      if (profile !== null) {
        this.userId = profile.user.id;
      }
    });
  }

  /**
   * Copy link text to clipboard
   */
  public copyOnClick(_event: Event, relatedLink: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = relatedLink;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.translationService
      .getTranslation('REWARDS.COPY_LINK_SUCCESS')
      .subscribe((text: string) => {
        this.snackBarService.open(text);
      });
  }

  public get referralUrl() {
    return `blipbillboards.com/referral-program-start/?utm_source=promo&utm_campaign=tsmxtd&utm_content=${this.userId}`;
  }

  public get referralHtml() {
    return `https://www.blipbillboards.com/referral-iframe/?da=${this.activeOptionIndex}&code=${this.userId}`;
  }

  public get embedIframe() {
    return `<iframe src="${this.referralHtml}" height="233" width="280" scrolling="no" frameBorder="0"></iframe>`;
  }
}

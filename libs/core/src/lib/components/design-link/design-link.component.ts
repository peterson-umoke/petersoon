import { Component } from '@angular/core';

export const URL = 'https://www.blipbillboards.com/billboard-design-service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-design-link',
  templateUrl: './design-link.component.html',
  styleUrls: ['./design-link.component.scss'],
})
export class DesignLinkComponent {
  public designTeamUrl = URL;

  constructor() {}
}

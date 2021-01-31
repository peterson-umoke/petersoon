import { Component } from '@angular/core';
import { AdImage, VerificationsService } from '@marketplace/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-ad-verifications',
  templateUrl: './ad-verifications.component.html',
  styleUrls: ['./ad-verifications.component.scss'],
})
export class AdVerificationsComponent {
  public verifications: Array<AdImage> = [];

  constructor(private verificationsService: VerificationsService) {
    this.verificationsService.getVerifications();
    this.verificationsService.$verifications.subscribe(
      (images: Array<AdImage>) => {
        this.verifications = images;
      }
    );
  }

  public approve(id: string): void {
    this.verificationsService.approveImage(id);
  }

  public approveAll(): void {
    this.verificationsService.approveAll();
  }

  public reject(id: string): void {
    this.verificationsService.rejectImage(id);
  }

  public rejectAll(): void {
    this.verificationsService.rejectAll();
  }
}

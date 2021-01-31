import { Component, OnInit } from '@angular/core';
import { SignSizes } from '@marketplace/core';
import { Observable } from 'rxjs';
import { WizardImageSizesService } from '../../../../services/campaign-wizard/wizard-image-sizes/wizard-image-sizes.service';

@Component({
  selector: 'campaigns-wizard-artwork-sizes',
  templateUrl: './wizard-artwork-sizes.component.html',
  styleUrls: ['./wizard-artwork-sizes.component.scss'],
})
export class WizardArtworkSizesComponent implements OnInit {
  public signSizes$: Observable<SignSizes[]>;
  public reducedSizes$: Observable<SignSizes[]>;

  constructor(private imageSizeService: WizardImageSizesService) {}

  ngOnInit() {
    this.signSizes$ = this.imageSizeService.signSizes$;
    this.reducedSizes$ = this.imageSizeService.reducedSizes$;
  }
}

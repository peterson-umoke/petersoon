import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'campaigns-wizard-artwork',
  templateUrl: './wizard-artwork.component.html',
  styleUrls: ['./wizard-artwork.component.scss'],
})
export class WizardArtworkComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  public subComponent$: Observable<'das' | 'generator' | 'upload'>;

  ngOnInit() {
    this.subComponent$ = this.route.params.pipe(pluck('subComponent'));
  }
}

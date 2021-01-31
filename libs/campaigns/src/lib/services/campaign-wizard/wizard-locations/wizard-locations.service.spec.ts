import { Sign, SignFilter } from '@marketplace/core';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { CampaignWizardService } from '../campaign-wizard.service';
import { WizardLocationsService } from './wizard-locations.service';

describe('WizardLocationsService', () => {
  let service: WizardLocationsService;
  const signs = [
    { id: 'a', name: 'SignA', lat: 45.1, lon: 45.2, selected: true } as Sign,
    { id: 'b', name: 'SignB', lat: 50.1, lon: 50.2, selected: false } as Sign,
  ];
  const signsSubject = new Subject();
  const changedSigns = new Subject();
  beforeEach(() => {
    service = new WizardLocationsService(<CampaignWizardService>(<unknown>{
      signs$: signsSubject,
      selectedSigns$: signsSubject.pipe(
        map((_signs: Sign[]) => _.filter(_signs, (s) => s.selected))
      ),
      changedSigns$: changedSigns,
    }));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should observe visible signs', () => {
    service.visibleSigns$.pipe(first()).subscribe((visible) => {
      expect(visible).toEqual(signs);
    });
    signsSubject.next(signs);
  });

  it('should observe selected clusters', () => {
    service.selectedClusters$.pipe(first()).subscribe((selected) => {
      expect(selected.length).toEqual(1);
    });
    signsSubject.next(signs);
  });

  it('should observe selected filter', () => {
    service.selectedFilter$.pipe(first()).subscribe((selected) => {
      expect(selected).toEqual(SignFilter.ALL);
    });
  });
});

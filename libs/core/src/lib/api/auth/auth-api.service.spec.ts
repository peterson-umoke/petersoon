import { inject, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import * as _ from 'lodash';
import { of } from 'rxjs';
import {
  AdsService,
  CampaignService,
  CampaignsService,
  LoadingService,
  PaymentService,
  UserService,
  VerificationsService,
} from '../../services';
import { AuthService } from '../../services_lib';
import { AuthAPIService } from './auth-api.service';

describe('AuthAPIService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthAPIService,
        { provide: AdsService, useValue: {} },
        {
          provide: AuthService,
          useValue: { loggedIn: () => of({ uid: 'user1' }).toPromise() },
        },
        { provide: CampaignService, useValue: {} },
        { provide: CampaignsService, useValue: {} },
        {
          provide: AngularFirestore,
          useValue: {
            doc: () => ({
              get: () =>
                of({
                  exists: true,
                  data: () => ({
                    id: 'user1',
                    templateManager: true,
                  }),
                }),
              update: _.noop,
            }),
          },
        },
        { provide: LoadingService, useValue: {} },
        { provide: PaymentService, useValue: {} },
        {
          provide: UserService,
          useValue: { getProfile: () => of({}).toPromise() },
        },
        { provide: VerificationsService, useValue: {} },
      ],
    });
  });

  it('should be created', inject(
    [AuthAPIService],
    (service: AuthAPIService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('should fill in userServices properties on checkLogin', inject(
    [AuthAPIService],
    async (service: AuthAPIService) => {
      const loggedIn = spyOn(
        TestBed.inject(AuthService),
        'loggedIn'
      ).and.callThrough();
      const getProfile = spyOn(
        TestBed.inject(UserService),
        'getProfile'
      ).and.callThrough();
      await service.checkLogin(<any>{ what: 'route' });
      expect(loggedIn).toHaveBeenCalledWith();
      expect(getProfile).toHaveBeenCalledWith(<any>{ what: 'route' });
      expect(TestBed.inject(UserService)).toEqual(
        jasmine.objectContaining({
          isTemplateManager: true,
        })
      );
    }
  ));
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AppRoutes,
  CampaignsService,
  CampaignTypes,
  FilterPipe,
  RouterService,
  SearchService,
  TranslationService,
  UserService,
  ViewTypeService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockComponents, MockModule } from 'ng-mocks';
import { BehaviorSubject, EMPTY, of } from 'rxjs';
import { CampaignCardComponent } from '../campaign-card/campaign-card.component';
import { CampaignListComponent } from '../campaign-list/campaign-list.component';
// Components
import { CampaignsComponent, Page } from './campaigns.component';

xdescribe('CampaignsComponent', () => {
  let component: CampaignsComponent;
  let fixture: ComponentFixture<CampaignsComponent>;
  let routerService: RouterService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        CampaignsComponent,
        MockComponents(CampaignCardComponent, CampaignListComponent),
      ],
      imports: [
        // MockModule(
        //   BlipCoreModule.forRoot({
        //     API_URL: environment.API_URL,
        //     FIREBASE_CONFIG: environment.FIREBASE_CONFIG,
        //   })
        // ),
        MockModule(FlexLayoutModule),
        MockModule(TranslateModule),
        RouterTestingModule,

        // Material Modules
        MockModule(MatButtonModule),
        MockModule(MatIconModule),
        MockModule(MatSnackBarModule),
      ],
      providers: [
        {
          provide: CampaignsService,
          useValue: {
            $campaignChange: new BehaviorSubject(true),
            getCampaignChecklist: () => Promise.resolve(),
            getCampaignStats: () => Promise.resolve({}),
            getCampaignType: () => Promise.resolve([]),
          },
        },
        RouterService,
        {
          provide: FilterPipe,
          useValue: {
            transform: () => [],
          },
        },
        {
          provide: SearchService,
          useValue: {
            type: () => new BehaviorSubject(''),
          },
        },
        {
          provide: TranslationService,
          useValue: {
            getTranslation: () => EMPTY,
          },
        },
        {
          provide: UserService,
          useValue: {
            $selectedOrganization: new BehaviorSubject({}),
            $selectedOrgInfo: of({}),
            getOrganizationInfo: () => Promise.resolve({}),
            organization: { id: '' },
          },
        },
        {
          provide: ViewTypeService,
          useValue: {
            type: () => new BehaviorSubject(0),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignsComponent);
    component = fixture.componentInstance;
    routerService = TestBed.inject(RouterService);
    fixture.detectChanges();
  });

  describe('Ensure the current page is correct', () => {
    it('should be active', () => {
      routerService.$route = new BehaviorSubject('/campaigns');
      component.ngOnInit();
      expect(component.currentPage).toBe(Page.ACTIVE);
      expect(component.currentType).toBe(CampaignTypes.ACTIVE);
    });

    it('should be archived', () => {
      routerService.$route = new BehaviorSubject('/campaigns/archived');
      component.ngOnInit();
      expect(component.currentPage).toBe(Page.ARCHIVED);
      expect(component.currentType).toBe(CampaignTypes.ARCHIVED);
    });

    it('should be drafts', () => {
      routerService.$route = new BehaviorSubject('/campaigns/draft');
      component.ngOnInit();
      expect(component.currentPage).toBe(Page.DRAFTS);
      expect(component.currentType).toBe(CampaignTypes.DRAFT);
    });
  });

  describe('Ensure correct payment problems show', () => {
    it('should have a valid credit card on file', () => {
      const userService = <any>TestBed.inject(UserService);
      userService.$selectedOrgInfo = of({
        funded: true,
        'prepay-only': false,
        spendable: 0,
        burntime: 5,
      });
      component.ngOnInit();
      expect(component.showPaymentProblem).toBeFalsy();
      expect(component.paymentProblemInformation).toBeNull();
    });

    it('should have spendable days left', async () => {
      const userService = <any>TestBed.inject(UserService);
      userService.$selectedOrgInfo = of({
        funded: false,
        'prepay-only': false,
        spendable: 1,
        burntime: 5,
      });
      const translationService = fixture.debugElement.injector.get(
        TranslationService
      );
      const translation = 'You have 8 days left';
      spyOn(translationService, 'getTranslation').and.callFake(
        (key: string) => new BehaviorSubject(translation)
      );
      await fixture.whenStable();
      component.ngOnInit();
      expect(component.showPaymentProblem).toBeTruthy();
      expect(component.paymentProblemInformation).toEqual({
        buttonText: 'PAYMENT.ADD',
        errorText: translation,
        resolveUrl: AppRoutes.CARDS,
      });
    });

    it('should have at lease 30 days of spend', () => {
      const userService = <any>TestBed.inject(UserService);
      userService.$selectedOrgInfo = of({
        funded: false,
        'prepay-only': false,
        spendable: 2,
        burntime: null,
      });
      component.ngOnInit();
      expect(component.showPaymentProblem).toBeFalsy();
      expect(component.paymentProblemInformation).toBeNull();
    });

    it('should have spendable amount because the account it prepay only', async () => {
      const userService = <any>TestBed.inject(UserService);
      userService.$selectedOrgInfo = of({
        funded: false,
        'prepay-only': true,
        spendable: 0,
        burntime: 5,
      });
      const translationService = fixture.debugElement.injector.get(
        TranslationService
      );
      const translation = 'Political organizations need prepay money';
      spyOn(translationService, 'getTranslation').and.callFake(
        (key: string) => new BehaviorSubject(translation)
      );
      await fixture.whenStable();
      component.ngOnInit();
      expect(component.showPaymentProblem).toBeTruthy();
      expect(component.paymentProblemInformation).toEqual({
        buttonText: 'PAYMENT.UPDATE_HERE',
        errorText: translation,
        resolveUrl: AppRoutes.CARDS,
      });
    });

    it('should have no cards and no prepaid amount', async () => {
      const userService = <any>TestBed.inject(UserService);
      userService.$selectedOrgInfo = of({
        funded: false,
        'prepay-only': false,
        spendable: 0,
        burntime: 0,
      });
      const translationService = fixture.debugElement.injector.get(
        TranslationService
      );
      const translation = 'You need to add a card';
      spyOn(translationService, 'getTranslation').and.callFake(
        (key: string) => new BehaviorSubject(translation)
      );
      await fixture.whenStable();
      component.ngOnInit();
      expect(component.showPaymentProblem).toBeTruthy();
      expect(component.paymentProblemInformation).toEqual({
        buttonText: 'PAYMENT.UPDATE_HERE',
        errorText: translation,
        resolveUrl: AppRoutes.CARDS,
      });
    });
  });
});

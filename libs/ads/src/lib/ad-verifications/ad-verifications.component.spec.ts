import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AdImage,
  ImageOutlineComponent,
  ImageViewerDirective,
  KeysPipe,
  MaterialModule,
  VerificationsService,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { BehaviorSubject } from 'rxjs';
import { AdVerificationsComponent } from './ad-verifications.component';

describe('AdVerificationsComponent', () => {
  let component: AdVerificationsComponent;
  let fixture: ComponentFixture<AdVerificationsComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, TranslateModule.forRoot()],
      declarations: [
        AdVerificationsComponent,
        MockDirective(ImageViewerDirective),
        MockComponent(ImageOutlineComponent),
        MockPipe(KeysPipe),
      ],
      providers: [
        {
          provide: VerificationsService,
          useValue: {
            $verifications: new BehaviorSubject<Array<AdImage>>(
              []
            ).asObservable(),
            getVerifications: () => {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdVerificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

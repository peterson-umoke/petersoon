import { Directive, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockComponent, MockDirective } from 'ng-mocks';
import { ImageViewerDirective } from '../../directives/image-viewer/image-viewer.directive';
import { MaterialModule } from '../../modules';
import { AdsService } from '../../services';
import { AdMenuComponent } from '../ad-menu/ad-menu.component';
import { AdsCardComponent } from './ads-card.component';

// tslint:disable-next-line: directive-selector
@Directive({ selector: 'appImageViewer' })
class AppImageViewerDirective {
  @Input() images: any;
  @Input() imageIndex: any;
}

describe('AdsCardComponent', () => {
  let component: AdsCardComponent;
  let fixture: ComponentFixture<AdsCardComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, TranslateModule.forRoot()],
      declarations: [
        AdsCardComponent,
        MockDirective(ImageViewerDirective),
        MockComponent(AdMenuComponent),
      ],
      providers: [{ provide: AdsService, useValue: {} }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsCardComponent);
    component = fixture.componentInstance;
    component.ad = {
      id: 'id',
      name: 'Some Ad',
      created: 123,
      images: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

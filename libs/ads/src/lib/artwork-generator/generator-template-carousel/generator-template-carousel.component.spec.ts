import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockComponent } from 'ng-mocks';
import { ArtworkGeneratorService } from '../../services/artwork-generator-service/artwork-generator.service';
import { GeneratorTemplateComponent } from '../generator-template/generator-template.component';
import { GeneratorCarouselComponent } from './generator-template-carousel.component';

describe('CarouselComponent', () => {
  let component: GeneratorCarouselComponent;
  let fixture: ComponentFixture<GeneratorCarouselComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, TranslateModule.forRoot(), BrowserModule],
      declarations: [
        GeneratorCarouselComponent,
        MockComponent(GeneratorTemplateComponent),
      ],
      providers: [
        {
          provide: ArtworkGeneratorService,
          useValue: {
            updateSelectedTemplate: () => {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratorCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

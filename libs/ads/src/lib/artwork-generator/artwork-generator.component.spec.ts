import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GoogleAnalyticsDirective, MaterialModule } from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockComponents, MockDirective } from 'ng-mocks';
import { EMPTY, of, Subject } from 'rxjs';
import { ArtworkGeneratorService } from '../services/artwork-generator-service/artwork-generator.service';
import { ArtworkGeneratorComponent } from './artwork-generator.component';
import { ColorPickerDropdownComponent } from './color-picker/color-picker-dropdown/color-picker-dropdown.component';
import { GeneratorCarouselComponent } from './generator-template-carousel/generator-template-carousel.component';
import { GeneratorTemplateComponent } from './generator-template/generator-template.component';

describe('ArtworkGeneratorComponent', () => {
  let component: ArtworkGeneratorComponent;
  let fixture: ComponentFixture<ArtworkGeneratorComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      declarations: [
        ArtworkGeneratorComponent,
        MockComponents(
          GeneratorCarouselComponent,
          GeneratorTemplateComponent,
          ColorPickerDropdownComponent
        ),
        MockDirective(GoogleAnalyticsDirective),
      ],
      providers: [
        {
          provide: MatBottomSheet,
          useValue: {},
        },
        {
          provide: ArtworkGeneratorService,
          useValue: {
            generatorForm: new FormGroup({
              headline: new FormControl(),
              subhead: new FormControl(),
              third: new FormControl(),
            }),
            headlineMax: null,
            subheadMax: 0,
            thirdMax: 0,
            genAdSizes: [],
            selectedTemplate$: EMPTY,
            generatorInfo$: of({
              headline: null,
              subhead: null,
              third: null,
              imageURL: null,
              font: null,
              primary: null,
            }),
            rendering$: EMPTY,
            showSizes$: EMPTY,
            charCount$: EMPTY,
          },
        },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtworkGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.genFonts).toEqual([
      'Arbutus Slab',
      // 'Baloo Da',
      'Barlow',
      // 'Exo',
      'Lato',
      'Merriweather',
      'Montserrat',
      // 'Oswald',
    ]);
  });
});

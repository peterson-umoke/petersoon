import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FitTextDirective,
  GeneratorTemplate,
  MaterialModule,
  TemplateClassPipe,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { MockDirective, MockPipe } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { ArtworkGeneratorService } from '../../services/artwork-generator-service/artwork-generator.service';
import { GeneratorTemplateComponent } from './generator-template.component';

describe('GeneratorTemplateComponent', () => {
  let component: GeneratorTemplateComponent;
  let fixture: ComponentFixture<GeneratorTemplateComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, TranslateModule.forRoot()],
      declarations: [
        GeneratorTemplateComponent,
        MockPipe(TemplateClassPipe),
        MockDirective(FitTextDirective),
      ],
      providers: [
        {
          provide: ArtworkGeneratorService,
          useValue: {
            generatorInfo$: of({
              headline: null,
              subhead: null,
              third: null,
              font: null,
              clone: () => {},
            }),
            selectedTemplate$: EMPTY,
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratorTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the colors', () => {
    expect(component.getColor(GeneratorTemplate.BASIC, 'primary')).toBe(
      'primary'
    );
    expect(component.getColor(GeneratorTemplate.BASIC, 'secondary')).toBe(
      'secondary'
    );
    expect(component.getColor(GeneratorTemplate.BASIC_INVERT, 'primary')).toBe(
      'primary'
    );
    expect(
      component.getColor(GeneratorTemplate.BASIC_INVERT, 'secondary')
    ).toBe('primary');
    expect(component.getColor(GeneratorTemplate.SPLIT_INVERT, 'primary')).toBe(
      'secondary'
    );
    expect(
      component.getColor(GeneratorTemplate.SPLIT_INVERT, 'secondary')
    ).toBe('primary');
  });
});

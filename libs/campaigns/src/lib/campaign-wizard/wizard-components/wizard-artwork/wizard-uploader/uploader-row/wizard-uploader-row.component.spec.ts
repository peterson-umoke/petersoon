import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  AbbreviateStatePipe,
  AdUploadComponent,
  MaterialModule,
} from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockModule, MockPipe } from 'ng-mocks';
import { WizardUploaderRowComponent } from './wizard-uploader-row.component';

describe('WizardUploaderRowComponent', () => {
  let component: WizardUploaderRowComponent;
  let fixture: ComponentFixture<WizardUploaderRowComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          WizardUploaderRowComponent,
          MockComponent(AdUploadComponent),
          MockPipe(AbbreviateStatePipe),
        ],
        imports: [MaterialModule, MockModule(TranslateModule)],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardUploaderRowComponent);
    component = fixture.componentInstance;
    component.size = { width: 0, height: 0 };
    component.signs = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

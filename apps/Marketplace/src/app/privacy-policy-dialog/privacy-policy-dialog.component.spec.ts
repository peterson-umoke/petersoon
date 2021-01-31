import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MaterialModule } from '@marketplace/core';
import { TranslateModule } from '@ngx-translate/core';
import { PrivacyPolicyDialogComponent } from './privacy-policy-dialog.component';

describe('PrivacyPolicyDialogComponent', () => {
  let component: PrivacyPolicyDialogComponent;
  let fixture: ComponentFixture<PrivacyPolicyDialogComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MaterialModule, TranslateModule.forRoot()],
        declarations: [PrivacyPolicyDialogComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyPolicyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

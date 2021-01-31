import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  AppRoutes,
  AuthService,
  LoadingService,
  TermsAndConditionsComponent,
} from '@marketplace/core';
import { tz } from 'moment-timezone';

const PHONE_REGEX = /^\([0-9]{3}\) [0-9]{3} - [0-9]{4}$/;

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  @ViewChild('name', { static: false }) nameInput: ElementRef;

  public loading = true;
  public loginRoute = AppRoutes.LOGIN;
  public submitted = false;
  public registerForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [
      Validators.required,
      Validators.pattern(PHONE_REGEX),
    ]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
    timezone: new FormControl(tz.guess()),
  });

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    public loadingService: LoadingService // Used in HTML
  ) {
    this.authService.initialize();
    this.setFocus();
  }

  public openTerms() {
    this.dialog.open(TermsAndConditionsComponent, {
      minWidth: '50vw',
      maxWidth: '60vw',
    });
  }

  public facebook(): void {
    this.authService.facebook();
  }

  public google(): void {
    this.authService.google();
  }

  public async register() {
    if (this.registerForm.invalid) {
      this.authService.invalidCredentials();
      return;
    }
    this.authService.register(this.registerForm.value);
  }

  private setFocus() {
    if (this.nameInput && this.nameInput.nativeElement) {
      this.nameInput.nativeElement.focus();
    } else {
      setTimeout(() => {
        this.setFocus();
      });
    }
  }
}

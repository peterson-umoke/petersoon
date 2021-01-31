import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TranslationService } from '../../../services';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-change-dialog',
  templateUrl: './change-dialog.component.html',
  styleUrls: ['./change-dialog.component.scss'],
})
export class ChangeDialogComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  public translations = { action: '', type: '' };

  constructor(
    private translationService: TranslationService,
    public dialogRef: MatDialogRef<ChangeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.subscription = this.translationService
      .getTranslation([this.data.action, this.data.type])
      .subscribe((text: Array<string>) => {
        if (text) {
          this.translations.action = text[this.data.action].toLowerCase();
          this.translations.type = text[this.data.type].toLowerCase();
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public close(): void {
    this.dialogRef.close();
  }
}

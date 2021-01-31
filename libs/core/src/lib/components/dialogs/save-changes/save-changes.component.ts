import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-save-changes',
  templateUrl: './save-changes.component.html',
  styleUrls: ['./save-changes.component.scss'],
})
export class SaveChangesComponent {
  constructor(private dialogRef: MatDialogRef<SaveChangesComponent>) {}

  public close(): void {
    this.dialogRef.close(false);
  }
}

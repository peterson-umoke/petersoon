import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[appDragDrop]',
})
export class DragDropDirective {
  @Output() fileOver = new EventEmitter<boolean>();
  @Output() fileDropped = new EventEmitter<Array<File>>();

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver.next(true);
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver.next(false);
  }

  // Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver.next(false);

    const { dataTransfer } = evt;
    if (dataTransfer.items) {
      const files = [];
      for (let i = 0; i < dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (dataTransfer.items[i].kind === 'file') {
          files.push(dataTransfer.items[i].getAsFile());
        }
      }
      dataTransfer.items.clear();
      this.fileDropped.emit(files);
    } else {
      const files = [];
      const transferFiles = dataTransfer.files;
      dataTransfer.clearData();
      for (let i = 0; i < transferFiles.length; i++) {
        files.push(transferFiles.item(i));
      }
      this.fileDropped.emit(files);
    }
  }

  constructor() {}
}

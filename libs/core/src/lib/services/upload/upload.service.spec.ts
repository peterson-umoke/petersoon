import { HttpClient } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { configureTestSuite } from 'ng-bullet';
import { LoadingService, SnackBarService, TranslationService } from '..';
import { Environment } from '../../models';
import { FileUploader, UploadService } from './upload.service';

describe('UploadService', () => {
  let httpTestingController: HttpTestingController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpTestingController,
        { provide: AngularFirestore, useValue: {} },
        { provide: AngularFireStorage, useValue: {} },
        { provide: LoadingService, useValue: {} },
        { provide: SnackBarService, useValue: {} },
        { provide: TranslationService, useValue: {} },
        { provide: HttpClient, useValue: {} },
        { provide: Environment, useValue: {} },
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  const createFile = (fileName: string): File => {
    const blob = new Blob([''], { type: 'text/html' });
    blob['lastModifiedDate'] = '';
    blob['name'] = fileName;

    return <File>blob;
  };

  const createFileList = (files: Array<File>): FileList => {
    return {
      length: files.length,
      item: (index: number) => files[index],
      *[Symbol.iterator]() {
        for (let i = 0; i < files.length; i++) {
          yield files[i];
        }
      },
      ...files,
    };
  };

  describe('New Uploader', () => {
    it('should add files using setFiles', inject(
      [UploadService],
      async (service: UploadService) => {
        const uploader: FileUploader = await service.newUploader();
        let files = createFileList([createFile('TestFile')]);
        uploader.setFiles(files);
        expect(uploader.files.length).toBe(1);
        expect(uploader.adId).toBe('');

        // Setting new files removes all previous files
        files = createFileList([
          createFile('TestFile1'),
          createFile('TestFile2'),
          createFile('TestFile3'),
        ]);
        uploader.setFiles(files);
        expect(uploader.files.length).toBe(3);
      }
    ));

    it('should clear files', inject(
      [UploadService],
      async (service: UploadService) => {
        const uploader: FileUploader = await service.newUploader();
        const files = createFileList([createFile('TestFile')]);
        uploader.setFiles(files);
        expect(uploader.files.length).toBe(1);

        uploader.clearQueue();
        expect(uploader.files.length).toBe(0);
      }
    ));

    it('should correctly remove files', inject(
      [UploadService],
      async (service: UploadService) => {
        const uploader: FileUploader = await service.newUploader();
        const file = createFile('TestFile');
        let files = createFileList([file]);
        uploader.setFiles(files);
        expect(uploader.files.length).toBe(1);

        uploader.removeFromQueue(file);
        expect(uploader.files.length).toBe(0);

        // Remove one file from a list of 3
        files = createFileList([
          createFile('TestFile2'),
          file,
          createFile('TestFile3'),
        ]);
        uploader.setFiles(files);
        expect(uploader.files.length).toBe(3);

        uploader.removeFromQueue(file);
        expect(uploader.files.length).toBe(2);
      }
    ));

    it('should correctly set ad id', inject(
      [UploadService],
      async (service: UploadService) => {
        const id = 'someId';
        const uploader: FileUploader = await service.newUploader(id);
        expect(uploader.adId).toBe(id);
      }
    ));

    // TODO: Update this when using new Jest testing service
    // it('should correctly upload an ad and call onCompleteAll()',
    //   inject([UploadService], async (service: UploadService) => {
    //     const adId = 'someId';
    //     const uploader: FileUploader = await service.newUploader(adId);
    //     const file = createFile('TestFile');
    //     const files = createFileList([file]);
    //     uploader.setFiles(files);
    //     uploader.onCompleteAll();
    //     await uploader.uploadAll();
    //     uploader.onCompleteAll = () => {
    //       expect(uploader.progress).toBe(100);
    //       expect(uploader.files[0]['progress']).toBe(100);
    //     };

    //     const req = httpTestingController.expectOne(`${environment.API_URL}/api/da/${adId}/image/upload`);
    //     expect(req.request.method).toEqual('POST');

    //     const formData: FormData = new FormData();
    //     formData.append('file', file);
    //     formData.append('file_name', file.name);
    //     formData.append('file_type', file.type);
    //     req.flush(formData);
    //   }));
  });
});

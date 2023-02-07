import { Component } from '@angular/core';

declare var M: any;

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})

export class ImageUploadComponent {
  public page_title: string;

  constructor(

  ) {
    this.page_title= 'Upload image file';
  }

  onSubmit(form: any) {
    console.log("SUBMIT FORM");
  }
}

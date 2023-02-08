import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { ArticleService } from "../../services/article.service";
import { DataService } from "../../services/data.service";

declare var M: any;

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css'],
  providers: [ArticleService]
})

export class ImageUploadComponent {
  public article: any;
  public page_title: string;
  public image: any;

  constructor(
    private _articleService: ArticleService,
    private _dataService: DataService,
    private _router: Router
  ) {
    this.page_title= 'Upload image file';
  }

  onChange(event: any) {
    this.image = event.target.files[0];
  }

  onSubmit(form: any) {
    const id = this._dataService.article._id;

    this._articleService.upload(this.image, id).subscribe(
      response => {
        if (response.status == 'success') {
          M.toast({
            html: 'Imagen del articulo actualizada correctamente!',
            classes: 'green accent-4'
          });
          this._router.navigate(['/home']);
        }
      },
      error => {
        M.toast({
          html: `${error.error.message}`,
          classes: 'red accent-4'
        });
      }
    );
  }
}

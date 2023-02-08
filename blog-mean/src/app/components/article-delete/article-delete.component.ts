import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { ArticleService } from "../../services/article.service";
import { DataService } from "../../services/data.service";

declare var M:any;

@Component({
  selector: 'app-article-delete',
  templateUrl: './article-delete.component.html',
  styleUrls: ['./article-delete.component.css']
})

export class ArticleDeleteComponent {
  public page_title: string;

  constructor(
    private _articleService: ArticleService,
    private _dataService: DataService,
    private _router: Router
  ) {
    this.page_title = 'Are you sure to  delete the article: ';
    setTimeout(() => {
      this.page_title += `${_dataService.article.title} ?`;
    }, 100)
  }

  delete() {
    const id = this._dataService.article._id;

    this._articleService.delete_article(id).subscribe(
      response => {
        console.log(response);
        if (response.status == 'success') {
          M.toast({
            html: 'Article successfully removed!',
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

import { Component } from '@angular/core';
import { ArticleService } from "../../services/article.service";
import { Article } from "../../models/article";

declare var M: any;

@Component({
  selector: 'app-article-new',
  templateUrl: './article-new.component.html',
  styleUrls: ['./article-new.component.css'],
  providers: [ArticleService]
})

export class ArticleNewComponent {
  public page_title: string;
  public article: Article;

  constructor(
    private _articleService: ArticleService
  ) {
    this.page_title = 'Add a new article';
    this.article = new Article(NaN, '', '', '', 'default.png');
  }

  onSubmit(form: any) {
    this._articleService.create(this.article).subscribe(
      response => {
        if (response.status == 'success') {
          M.toast({
            html: `${response.message}`,
            classes: 'green accent-4'
          });
        }
        console.log(response);
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

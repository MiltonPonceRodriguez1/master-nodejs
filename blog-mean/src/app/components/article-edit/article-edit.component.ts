import { Component } from '@angular/core';
import { ArticleService } from "../../services/article.service";
import { DataService } from "../../services/data.service";
import { Article } from "../../models/article";

declare var M: any;
declare var $: any;

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css'],
  providers: [ArticleService]
})

export class ArticleEditComponent {
  public article: Article;
  public page_title: string;

  constructor(
    private _articleService: ArticleService,
    private _dataService: DataService
  ) {
    this.article = new Article(NaN, '', '', Date.now(), 'default.png');
    this.page_title = 'Update article: ';

    setTimeout(() => {
      this.article  = this._dataService.article;
      this.page_title += this.article.title;

      // ? REDIMENSIONAR TEXTAREA
      $('#content').val(this.article.content);
      M.textareaAutoResize($('#content'));
    }, 100);
  }

  onSubmit(form: any) {
    this._articleService.update(this.article).subscribe(
      response => {
        if (response.status == 'success') {
          this.page_title = `Update article: ${this.article.title}`;
          M.toast({
            html: `${response.message}`,
            classes: 'green accent-4'
          });
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

import { Component, OnInit } from '@angular/core';
import { ArticleService } from "../../services/article.service";
import { Article } from "../../models/article";

@Component({
  selector: 'app-article-new',
  templateUrl: './article-new.component.html',
  styleUrls: ['./article-new.component.css'],
  providers: [ArticleService]
})

export class ArticleNewComponent implements OnInit {
  public page_title: string;
  public article: Article;

  constructor(
    private _articleService: ArticleService
  ) {
    this.page_title = 'Add a new article';
    this.article = new Article(NaN, '', '', '', 'default.png');
  }

  ngOnInit(): void {
    let date = Date.now();
    console.log(date.toLocaleString());

  }

  onSubmit(form: any) {
    this._articleService.create(this.article).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(<any>error);
      }
    );
    console.log(this.article);
  }
}

import { Component, OnInit } from '@angular/core';
import { ArticleService } from "../../services/article.service";
import { global } from "../../services/global";
import { Article } from "../../models/article";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ArticleService]
})
export class HomeComponent implements OnInit {
  public page_title: string;
  public articles: any = null;
  public url: string = global.url;

  constructor (
    private _articleService: ArticleService
  ) {
    this.page_title = 'Home Page';
  }

  ngOnInit(): void {
    console.log(this._articleService.test());

    this._articleService.test_api().subscribe(
      response => {
        if (response.status == 'success') {
          this.articles = response.articles;
          console.log(this.articles);
        }
        console.log(response);
      },
      error => {
        console.log(<any>error);
      }
    );
  }
}

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
    this._articleService.get_articles().subscribe(
      response => {
        console.log(response);

        if (response.status == 'success') {
          this.articles = response.articles;
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  format_date(date: any) {
    return new Date(date).toLocaleDateString('en-us', {
      weekday:"long",
      year:"numeric",
      month:"short",
      day:"2-digit"
    });
  }
}

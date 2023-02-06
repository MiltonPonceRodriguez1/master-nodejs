import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ArticleService } from "../../services/article.service";
import { Article } from "../../models/article";
import { global } from "../../services/global";

declare var M: any;

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css'],
  providers: [ArticleService]
})
export class ArticleDetailComponent implements OnInit {
  public article: Article;
  public url: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _articleService: ArticleService
  ) {
    this.url = global.url;
    this.article = new Article(NaN, '', '', null, 'default.png');
    document.addEventListener('DOMContentLoaded', function() {
      let test_var = "milton";
      const elems = document.querySelectorAll('.fixed-action-btn');
      const instances = M.FloatingActionButton.init(elems, {direction: 'left'});
      console.log(elems);
      console.log(test_var);

    });
  }

  ngOnInit(): void {


    console.log("XD");
    this._route.params.subscribe(params => {
      let id = params['id'];
      console.log(id);

      this._articleService.get_article(id).subscribe(
        response => {
          if (response.status == 'success') {
            this.article = response.article;
            console.log(this.article);
          }
        },
        error => {
          console.log(<any>error);
        }
      );

    });
  }

}

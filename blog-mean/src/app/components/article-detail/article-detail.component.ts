import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ArticleService } from "../../services/article.service";
import { DataService } from "../../services/data.service";
import { Article } from "../../models/article";
import { global } from "../../services/global";

declare var M: any;

const init_materilize_compos = () => {
  let elems = document.querySelectorAll('.tooltipped');
  M.Tooltip.init(elems, {});

  elems = document.querySelectorAll('.fixed-action-btn');
  M.FloatingActionButton.init(elems, {});

  elems = document.querySelectorAll('.modal');
  M.Modal.init(elems, {});
}

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
    private _articleService: ArticleService,
    private _dataService: DataService
  ) {
    this.url = global.url;
    this.article = new Article(NaN, '', '', null, 'default.png');
  }

  ngOnInit(): void {
    init_materilize_compos();

    this._route.params.subscribe(params => {
      let id = params['id'];

      this._articleService.get_article(id).subscribe(
        response => {
          if (response.status == 'success') {
            this.article = response.article;
            this._dataService.article = response.article;
            console.log("DETAIL: ", this._dataService.article);
          }
        },
        error => {
          console.log(<any>error);
        }
      );

    });
  }

}

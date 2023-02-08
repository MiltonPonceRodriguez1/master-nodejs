import { Component } from '@angular/core';
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
    private _dataService: DataService
  ) {
    this.page_title = 'Are you sure to  delete the article: ';
    setTimeout(() => {
      this.page_title += `${_dataService.article.title} ?`;
      console.log(_dataService.article);

    }, 100)


  }
}

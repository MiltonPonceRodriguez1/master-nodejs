import { Injectable } from "@angular/core";
import { Article } from "../models/article";

@Injectable({
    providedIn: 'root'
})

export class DataService {
    public article: Article;

    constructor() {
        this.article = new Article(NaN, '', '', Date.now(), '');
    }
}
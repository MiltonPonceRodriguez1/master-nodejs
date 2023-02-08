import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { global } from "./global";
import { Article } from "../models/article";


@Injectable()
export class ArticleService {
    public url: string;

    constructor (
        public _http: HttpClient
    ) {
        this.url = global.url;
    }

    get_articles(): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(`${this.url}articles`, {headers: headers});
    }

    create(article: any): Observable<any> {
        article.date = Date.now();
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(`${this.url}create`, article, {headers: headers});
    }

    get_article(id: any): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(`${this.url}article/${id}`, {headers: headers});
    }

    upload(file: any, id:any): Observable<any> {
        const formData = new FormData();
        formData.append('file0', file, file.name);
        return this._http.post(`${this.url}image-upload/${id}`, formData);
    }

    delete_article(id: any): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.delete(`${this.url}article/${id}`, {headers: headers});
    }

    update(article: Article): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.put(`${this.url}article/${article._id}`, article, {headers: headers});
    }
}
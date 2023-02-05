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

    test () {
        return "Hola mundo desde un servicio!";
    }

    test_api (): Observable<any> {
        let data = {}
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.get(`${this.url}articles`, {headers: headers});
    }
}
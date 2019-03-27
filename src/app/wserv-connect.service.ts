import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient, HttpHeaders, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WservConnectService{

  //https://forum.ionicframework.com/t/how-can-i-make-an-http-post-request-to-my-server/104219
  //https://www.techiediaries.com/ionic-http-post/

  constructor(public http: Http) {}

  post(data: string) {
    return this.http.post("http://190.66.24.90:4111/w1/webservices_copia.php", data,{}).map(res => res.json());  
  }
}




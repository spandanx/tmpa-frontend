import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetmusicService {

  // private baseUrl = 'http://localhost:8081/api';
  private baseUrl = '/api';

  constructor(private http: HttpClient) { }

  getAllMusic() :Observable<any>{
    return this.http.get(this.baseUrl+"/get-all-music");
  }

  getAllWidgets(): Observable<any>{
    return this.http.get(this.baseUrl+"/getDashBoard/1");
  }

  getAllMusicOfWidget(data:any): Observable<any>{
    return this.http.post(this.baseUrl+"/customQuery", data);
  }

}

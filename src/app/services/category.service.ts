import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl = '/api';
  constructor(private http: HttpClient) { }

  getLanguages(): Observable<any> {
    return this.http.get(this.baseUrl+'/distinct-language');
  }
  getCategoryNames(): Observable<any> {
    return this.http.get(this.baseUrl+'/categoryNames');
  }

  getCategoryValues(language:string, categoryName:string): Observable<any> {
    return this.http.get(this.baseUrl+'/categoryValues'+'/'+language+'/'+categoryName);
  }
}

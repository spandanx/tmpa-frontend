import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  // private baseUrl = 'http://localhost:8081/api';
  private baseUrl = '/api';

  constructor(private http:HttpClient) { }

  checkLogin(username:string, password:string): Observable<any> {
    const body = {'username':username, 'password':password};
    return this.http.post(this.baseUrl+'/authenticate', body);
  }

  register(username:string, password:string){
    const body = {'username':username, 'password':password};
    return this.http.post(this.baseUrl+'/register', body);
  }
}

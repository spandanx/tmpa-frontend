import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  
  private baseUrl = '/api';

  constructor(private http: HttpClient) { }

  uploadAudio(file: File, name:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('name', name);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload-audio`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  uploadThumbnail(file: File, name:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('name', name);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload-thumbnail`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  uploadDetails(json: JSON): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', `${this.baseUrl}/upload-details`, json, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }




  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }
}

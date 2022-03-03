import { Injectable } from '@angular/core';
import { Music_data } from '../data/music';
// import MUSIC from '';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  constructor() { }

  getHeroes(): any[] {
    return Music_data;
  }
}

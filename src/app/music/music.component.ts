import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Music } from '../classes/music';
import { GetmusicService } from '../services/getmusic.service';
import { MusicService } from '../services/music.service';
import { Track } from 'ngx-audio-player';

// interface Music {  
//   id: Number;  
//   name: String;  
//   email: String;  
//   gender: String;  
// }

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.css']
})
export class MusicComponent implements OnInit {

  activeMusic: Music | undefined;
  activeIndex:any = 0;
  music: Music[]=[];
  allMusic: Music[] = [];
  permissionElement:String = "music-play";
  audioAPI = "/api/audio/";
  thumbnailAPI = '/api/thumbnail/';

  //##################new audio layout
  playButton:boolean = true;
  audioFile = new Audio();
  musicBarHeight = 0;
  volumebarHeight = 100;
  skipTime = 10;
  audioIndices: number[] = [];
  mute:boolean = false;
  lastAudioVolume = 0;
  repeat = 0;

  totalMinute = 0;
  totalSecond = 0;
  totalMinuteString = this.zfill(this.totalMinute, 2);
  totalSecondString = this.zfill(this.totalMinute, 2);
  currentMinute = 0;
  currentSecond = 0;
  currentMinuteString = this.zfill(this.currentMinute, 2);
  currentSecondString = this.zfill(this.currentSecond, 2);

  //##################new audio layout
  //
// audio.addEventListener("play", function() {
//     audio.currentTime = 10;  // jump to 00:10
// });
// audio.play();

  currentWidgetQuery:any;

msaapDisplayTitle = true;
msaapDisplayPlayList = true;
msaapPageSizeOptions = [2,4,6];
msaapDisplayVolumeControls = true;
msaapDisplayRepeatControls = true;
msaapDisplayArtist = true;
msaapDisplayDuration = true;
msaapDisablePositionSlider = true;
// Material Style Advance Audio Player Playlist
playlist: Track[] = [
  // {
  //   title: 'Audio One Title',
  //   link: '/api/audio/1632335163181.mp3', 
  //   artist: 'Audio One Artist',
  //   duration: 20
  // },
  // {
  //   title: 'Audio Two Title',
  //   link: 'Link to Audio Two URL',
  //   artist: 'Audio Two Artist',
  //   duration: 60
  // },
  // {
  //   title: 'Audio Three Title',
  //   link: 'Link to Audio Three URL',
  //   artist: 'Audio Three Artist',
  //   duration: 70
  // },
];



  constructor(
    private musicservice: MusicService,
    private getmusicService : GetmusicService,
    private router:Router
    ) {
    this.music = this.musicservice.getHeroes();
    this.getCurrentWidget();
    // this.getAllMusic();
    this.getAllMusicOfWidget();
    this.audioFile.addEventListener("timeupdate", (currentTime)=>{
        this.changeBar();
      });
    const click = <HTMLElement>document.getElementById("length");
    // .addEventListener("click", function (e) {
    //   console.log(e);
      
    // });
  }

  func(){
  }
  ngOnInit(): void {
    // this.checkPermission();
  }
  
  checkPermission(){
    const permissions = sessionStorage.getItem("permissions")
    if (permissions!=undefined || permissions!=null){
      let permissionList:String[] = permissions.split(',');
      let status:boolean = false;
      permissionList.forEach( (permission)=>{
        if (permission==this.permissionElement){
          status = true;
        }
      }
      );
      if (!status){
        this.router.navigate(['/error']);
      }
    }
    else{
      this.router.navigate(['/error']);
    }
  }

  getCurrentWidget(){
    console.log("Calling getCurrentWidget()");
    this.currentWidgetQuery = sessionStorage.getItem("currentWidgetQuery");
    console.log("Query:");
    console.log(this.currentWidgetQuery);
  }

  getAllMusicOfWidget(){
    console.log("Calling getAllMusicOfWidget()");
    console.log(this.currentWidgetQuery);    
    let query = JSON.parse(this.currentWidgetQuery);
    console.log(query);
    
    this.getmusicService.getAllMusicOfWidget(query).subscribe(
      res=>{
        // for (let m of res){
        //   let localMusic:Music = m;
        //   let local:Track = new Track();
        //   local.link = this.audioAPI+localMusic.audioFilePath;
        //   // local.startOffset = 30;
        //   local.title = localMusic.name;
        //   local.artist = localMusic.artists;
        //   this.playlist.push(local);
        // }
        this.allMusic = res;
        this.audioIndices  = Array.from(Array(this.allMusic.length).keys());

        if (this.allMusic.length>0){
          this.activeMusic = this.allMusic[0];
          this.activeIndex = 0;
          this.audioFile.src = "http://www.sousound.com/music/healing/healing_01.mp3";//this.audioAPI + this.activeMusic.audioFilePath;
          // this.audioFile.src = "http://www.sousound.com/music/healing/healing_01.mp3";//this.audioAPI+ this.activeMusic.audioFilePath;
          // this.audioFile = new Audio(this.audioAPI + this.activeMusic.audioFilePath);
          // this.audioFile.play();
        }
        // console.log("this.allMusic");
        // console.log(this.allMusic);
        // console.log("this.activeMusic");
        // console.log(this.activeMusic);
        console.log("Got all music");
        console.log(res);
      },
      err=>{
        console.log("Error on getting all music");
        
      }
    );
  }

  name = 'Angular';
  getAllMusic(){
    this.getmusicService.getAllMusic().subscribe(
      res=>{
        for (let m of res){
          let localMusic:Music = m;
          let local:Track = new Track();
          local.link = this.audioAPI+localMusic.audioFilePath;
          
          // local.startOffset = 30;
          this.playlist.push(local);
        }
        this.allMusic = res;
        console.log("Got all music");
        console.log(res);
      },
      err=>{
        console.log("Error on getting all music");
        
      }
    );
  }
  repeatShift(){
    this.repeat++;
    this.repeat = this.repeat%3;
  }
  randomize(){
    [this.allMusic[this.activeIndex], this.allMusic[0]] = [this.allMusic[0], this.allMusic[this.activeIndex]];
    this.activeIndex = 0;
    let currentIndex = this.allMusic.length-1;
    while (currentIndex>0){
      let randomIndex = Math.max(1, Math.floor(Math.random() * currentIndex));

      [this.allMusic[currentIndex], this.allMusic[randomIndex]] = [this.allMusic[randomIndex], this.allMusic[currentIndex]];
      currentIndex--;
    }
  }

  zfill(num:any, size:any) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
  }

  stopAudio(){
    console.log("stopAudio() called");
    
    this.audioFile.pause();
    this.audioFile.currentTime = 0;
    this.playButton = true;
    this.musicBarHeight = 0;

    // this.pauseAudio();
  }
  changeBar(){
    this.musicBarHeight = (this.audioFile.currentTime / this.audioFile.duration)*100; 
    if (Number.isNaN(this.audioFile.duration)){
      // console.log("True");
      this.totalMinute = 0;
      this.totalSecond = 0;
    }
    else{
      // console.log("false");
      this.totalMinute = Math.floor(this.audioFile.duration/60);
      this.totalSecond = Math.floor(this.audioFile.duration%60);
    }
    this.totalMinuteString = this.zfill(this.totalMinute, 2);
    this.totalSecondString = this.zfill(this.totalSecond, 2);
    this.currentMinute = Math.floor(this.audioFile.currentTime/60);
    this.currentSecond = Math.floor(this.audioFile.currentTime%60);
    this.currentMinuteString = this.zfill(this.currentMinute, 2);
    this.currentSecondString = this.zfill(this.currentSecond, 2);

    this.audioFile.onended = () => {
      console.log("Ended");
      console.log("activeIndex: "+this.activeIndex);
      console.log(this.allMusic.length-1);
      if (this.repeat==2){
        this.stopAudio();
        this.playAudio();
      }
      else{
        if (this.activeIndex<this.audioIndices.length-1){
          console.log("nextTrack getting called");
          this.nextTrack();
        }
        else{
          console.log("stopAudio getting called");
          if (this.repeat==1){
            this.stopAudio();
            this.activeIndex = 0;
            this.audioFile.src = this.audioAPI + this.allMusic[this.activeIndex].audioFilePath;
            this.playAudio();
          }
          else{
            this.stopAudio();
          }
        }
    }
   };
  }

  changeAudioTime(event:any){
    let outerDiv = <HTMLDivElement>document.getElementById('progress');
    // console.log("----------------------");
    // console.log("OffsetLeft"+outerDiv.offsetLeft);
    let totalLength = outerDiv.offsetWidth;
    let currentLength = event.offsetX;
    this.audioFile.currentTime = currentLength/totalLength * this.audioFile.duration;
    // console.log("currentTime: "+this.audioFile.currentTime);
  }
  changeAudioVolume(event:any){
    console.log("Volume changing");
    let outerDiv = <HTMLDivElement>document.getElementById('volume');
    let currentLength = event.offsetX;
    let totalLength = outerDiv.offsetWidth;
    this.audioFile.volume = currentLength/totalLength;
    this.volumebarHeight = this.audioFile.volume*100;
    console.log("current Volume"+(this.audioFile.volume));
    console.log(outerDiv.offsetWidth);
    console.log(event);
    this.mute = false;
  }

  muteAudio(){
    this.mute = true;
    this.lastAudioVolume = this.audioFile.volume;
    this.audioFile.volume = 0;
    this.volumebarHeight = 0;
  }
  unmuteAudio(){
    this.mute = false;
    this.audioFile.volume = this.lastAudioVolume;
    this.volumebarHeight = this.lastAudioVolume*100;
  }

  previousTrack(){
    this.stopAudio();
    this.activeIndex = Math.max(this.activeIndex-1, 0);
    this.activeMusic = this.allMusic[this.activeIndex];
    this.audioFile.src = this.audioAPI + this.activeMusic.audioFilePath;
    this.playAudio();
  }
  backward(){
    this.audioFile.currentTime = Math.max(this.audioFile.currentTime - this.skipTime, 0);
  }
  playAudio(){
    console.log("play called");
    this.audioFile.play();
    this.playButton = false;
    this.volumebarHeight = this.audioFile.volume*100;
  }
  pauseAudio(){
    // console.log(document.getElementById('track'));
    // var audio = (<HTMLAudioElement>document.getElementById('track'));
    // audio.pause();
    console.log("Pause called");
    this.audioFile.pause();
    this.playButton = true;
    // this.audioFile.pause();
  }
  forward(){
    this.audioFile.currentTime = Math.min(this.audioFile.currentTime + this.skipTime, this.audioFile.duration);
  }
  nextTrack(){
    console.log("nextTrack() called");
    this.stopAudio();
    this.activeIndex = Math.min(this.activeIndex+1, this.audioIndices.length-1);
    this.activeMusic = this.allMusic[this.activeIndex];
    this.audioFile.src = this.audioAPI + this.activeMusic.audioFilePath;
    this.playAudio();
  }
  playCustom(index:any){
    this.stopAudio();
    this.activeIndex = index;
    this.activeMusic = this.allMusic[this.activeIndex];
    this.audioFile.src = this.audioAPI + this.activeMusic.audioFilePath;
    this.playAudio();
  }
  changeTime(){
    // this.audioFile.pause();
    // this.audioFile.currentTime = 4.0;
    // this.audioFile.play();
    // console.log(document.getElementById('track'));
    // var audio = (<HTMLAudioElement>document.getElementById('track'));
    // console.log(audio.currentTime);
    // audio.pause();
    // this.audioFile;
    this.audioFile.currentTime = 8.0;
    // audio.fastSeek(8.0);
    // audio.addEventListener('canplaythrough', function() {
    //   this.currentTime = 12;
    //   this.play();
    // });
    // audio.play();
    
  //   inputValue.oncanplay = function() {
  //     inputValue.currentTime = 30;
  // };
  // inputValue.onprogress = function() {
  //   if (inputValue.currentTime == 0) {
  //     inputValue.currentTime = 10;
  //   }
  // }
  }
  // this.audioFile.addEventListener("timeupdate", (currentTime)=>{
  //   // Code to update progress bar goes here
  //   });
}

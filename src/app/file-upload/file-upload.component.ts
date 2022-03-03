import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FileUploadService } from '../services/file-upload.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  progress = 0;
  message = '';
  fileInfos: Observable<any>;
  currentFile: any;
  selectedAudioFiles: any;
  selectedThumbnailFile:any;

  musicform: FormGroup;
  permissionElement:String = "file-upload";

  constructor(
    private fileUploadService: FileUploadService,
    private formBuilder: FormBuilder,
    private router: Router) {

    this.fileInfos = this.fileUploadService.getFiles();
    
    this.musicform = this.formBuilder.group({
      name: ['', Validators.required],
      artists: ['', Validators.required],
      category: ['', Validators.required],
      language: ['', Validators.required],
      audiofile:['', Validators.required],
      thumbnailfile: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.checkPermission()
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

  selectAudioFile(event:any) {
    // console.log("calling selectAudioFile()");
    this.selectedAudioFiles = event.target.files;
    // console.log(event.target.files);
    console.log(event.target.files.item(0));
    console.log(event.target.files.item(0).duration);
    
    // var file = event.target.files.item(0);
    // var reader = new FileReader();
    // reader.onload = function() {
    //     var aud = new Audio(reader.readAsDataURL);
    //     aud.onloadedmetadata = function(){
    //       console.log(aud.duration);
    //     };    
    // };
    // reader.readAsDataURL(file);
    
    // audio.src = event.target.files.item(0).name;
    // let durationElement = <HTMLAudioElement>(document.getElementById("selectedFile"));
    // console.log(durationElement);
    
    // let duration = 0.0;
    // durationElement.addEventListener('canplaythrough', function(event:any){
    //   duration = event.currentTarget.duration;
    //   console.log(event);
    //  });

    //  event.target.files.item(0).addEventListener('canplaythrough', function(event:any){
    //   duration = event.currentTarget.duration;
    //   console.log(event);
    //  });
    //  console.log("Duration: "+duration);
    // console.log(durationElement);
  }

  selectThumbnailFile(event:any){
    this.selectedThumbnailFile = event.target.files;
  }

  upload() {
    //Upload audio
    const now = new Date();
    let epoctime = now.valueOf().toString();
    console.log("now:");
    console.log(now);
    console.log("epocvalue:");
    console.log(epoctime);
    
    this.progress = 0;
    let audioFile:File = this.selectedAudioFiles.item(0);
    this.currentFile = audioFile;
    let duration = 0.0;
    // let durationElement = <HTMLAudioElement>(document.getElementById("selectedFile"));
    // console.log(durationElement);
    
    // durationElement.addEventListener('canplaythrough', function(event:any){
    //   duration = event.currentTarget.duration;
    //   console.log(event);
    //  });
    

    let filenamearray:any[]  = audioFile.name.split('.');
    let audioFileName = epoctime+"."+filenamearray[filenamearray.length-1];
    this.fileUploadService.uploadAudio(this.currentFile, audioFileName).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = (event.total!=undefined)? Math.round(100 * event.loaded / event.total) : 0;
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
          this.fileInfos = this.fileUploadService.getFiles();
          console.log("Audio uploaded");

          //upload Thumbnail
          let thumbnailfile:File = this.selectedThumbnailFile.item(0);
          console.log(thumbnailfile.name);
          console.log(thumbnailfile);
          let filenamearray:any[]  = thumbnailfile.name.split('.');
          let thumbnailFileName = epoctime +"."+ filenamearray[filenamearray.length-1];
          this.fileUploadService.uploadThumbnail(thumbnailfile, thumbnailFileName).subscribe(
            thumbnailevent => {
              if (thumbnailevent.type === HttpEventType.UploadProgress) {
                this.progress = (thumbnailevent.total!=undefined)? Math.round(100 * thumbnailevent.loaded / thumbnailevent.total) : 0;
              } else if (thumbnailevent instanceof HttpResponse) {
                this.message = thumbnailevent.body.message;
                this.fileInfos = this.fileUploadService.getFiles();
                console.log("Thumbnail uploaded");

                
                
                let json:JSON = <JSON><unknown>{
                  "name": this.form.name.value,
                  "artists": this.form.artists.value,
                  "category": this.form.category.value,
                  "language": this.form.language.value,
                  "audioFilePath": audioFileName,
                  "imageFilePath": thumbnailFileName,
                  "length": duration,
                  "uploadDate": now
                };
                this.fileUploadService.uploadDetails(json).subscribe(
                  esevent=>{
                    console.log("Data uploaded successfully");
                  },
                  error=>{
                    console.log("problem in data uploading");
                    
                  }
                );

            }
          }
          );
        }
      },
      err => {
        this.progress = 0;
        this.message = 'Could not upload the file!';
        this.currentFile = undefined;
      });
  
    this.selectedAudioFiles = undefined;
  }

  get form(){
    return this.musicform.controls;
  }
}

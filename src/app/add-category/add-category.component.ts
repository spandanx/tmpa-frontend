import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { FileUploadService } from '../services/file-upload.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

  progress = 0;
  message = '';
  // fileInfos: Observable<any>;
  currentFile: any;
  selectedAudioFiles: any;
  selectedThumbnailFile:any;

  categoryForm: FormGroup;
  permissionElement:String = "file-upload";
  languages:string[] = [];
  categoryNames:string[] = [];
  categoryValues:string[] = [];

  selectedLanguage:any = "";
  selectedCategoryName:any = "";
  selectedCategoryValue:any = "";


  constructor(
    private fileUploadService: FileUploadService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private router: Router) {
    // this.fileInfos = this.fileUploadService.getFiles();
    
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      artists: ['', Validators.required],
      category: ['', Validators.required],
      audiofile:['', Validators.required],
      thumbnailfile: ['', Validators.required]
    });

     }

    ngOnInit(): void {
      this.checkPermission();
      this.getLanguages();
      this.getCategoryNames();
      console.log(this.c);
      
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
  
    selectThumbnailFile(event:any){
      this.selectedThumbnailFile = event.target.files;
    }

    getLanguages(){
      this.categoryService.getLanguages().subscribe(
        res => {
          res.forEach((language: string) => {
            this.languages.push(language);
          });
        }
      );
    }
    getCategoryNames(){
      this.categoryService.getCategoryNames().subscribe(
        res=>{
          res.forEach((cat:string) => {
              this.categoryNames.push(cat);
          });
        }
      );
    }
    setLanguage(event:any){
      this.selectedLanguage = event.target.value;
    }
    setCategory(event:any){
      this.selectedCategoryName = event.target.value;
      this.categoryValues = [];
      let catVals = this.categoryService.getCategoryValues(this.selectedLanguage, this.selectedCategoryName);
      catVals.forEach((val:string)=>{
        this.categoryValues.push(val);
      })
    }

    setCategoryValue(event:any){
      this.selectedCategoryValue = event.target.value;
    }

    get c(){
      return this.categoryForm.controls;
    }
}

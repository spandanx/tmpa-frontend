import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetmusicService } from '../services/getmusic.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // array = [
  //   {
  //       firstName: 'first1',
  //       lastName: 'last1'
  //   },
  //   {
  //       firstName: 'first2',
  //       lastName: 'last2'
  //   }];
  widgetsArray:any = [];

    permissionElement:String = "music-play";
  constructor(
    private router:Router,
    private getmusicService : GetmusicService
        ) { }

  ngOnInit(): void {
    this.checkPermission();
    this.getWidgets();
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

  getWidgets(){
    this.getmusicService.getAllWidgets().subscribe(res=>{
      console.log("Calling getWidgets() of component");
      console.log(res);
      
      for (let widget of res){
        console.log(widget);
        
        this.widgetsArray.push(widget);
      }
    });
  }
  redirect(item:any){
    console.log("calling redirect()");
    console.log(item);
    sessionStorage.setItem("currentWidgetQuery", item.query);
    sessionStorage.setItem("currentWidgetName", item.widgetName);
    this.router.navigate(["/music"]);
  }

}

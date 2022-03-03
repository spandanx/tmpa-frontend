import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private router:Router) { 
    // this.logout();
    console.log("LOGOUT Contructor called");
    
  }

  ngOnInit(): void {
    console.log("LOGOUT ngoninit called");
  }

  logout(){
    console.log("Calling logout");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("permissions");
    this.router.navigate([""]);
  }

}

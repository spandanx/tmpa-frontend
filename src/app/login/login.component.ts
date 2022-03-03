import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, timeout } from 'rxjs/operators';
import { LoginService } from '../services/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  errorLogin = false;
  errorMessage = "";

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private loginservice: LoginService) 
    { 
      this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });
    this.errorLogin = false;
  }

  ngOnInit(): void {}

  // get f() { return this.loginForm.controls; }

  login(){
    // const base64data = Utilities.base64Encode(text, Utilities.Charset.UTF_8);
    // let pass = this.f.password.value;
    // console.log("Encrypted password");
    // let encpass = this.encrypt(pass);
    // console.log(encpass);
    // console.log("Decrypted password");
    // console.log(this.decrypt(encpass));
    let user = this.f.username.value;
    let pass = this.encrypt(this.f.password.value);
    console.log("user: "+user);
    console.log("pass: "+pass);
    this.loginservice.checkLogin(user, pass).subscribe((res)=>{
      console.log("Login successful");
      console.log(res);
      this.errorLogin = false;
      sessionStorage.setItem("username", user);
      sessionStorage.setItem("role", res.role);
      sessionStorage.setItem("permissions", res.permissions);
      this.onSubmit();
    },
    (err)=>{
      console.log("Login failed");
      console.log(err);
      console.log(err.error);
      this.errorMessage = err.error;
      
      this.errorLogin = true;
    }
    );
  }

  CryptoJS = require("crypto-js");

  encrypt = (text: String) => {
    return this.CryptoJS.enc.Base64.stringify(this.CryptoJS.enc.Utf8.parse(text));
  };

  decrypt = (data: String) => {
    return this.CryptoJS.enc.Base64.parse(data).toString(this.CryptoJS.enc.Utf8);
  };

  onSubmit():void {
    console.log("inside onSubmit()");
    if (this.loginForm.invalid) {
      return;
    }
    console.log("going after check1");
    this.submitted = true;
    this.loading = true;
    if (sessionStorage.getItem("role")!=undefined && sessionStorage.getItem("role")=="admin"){
      console.log("Going to file upload page");
      this.router.navigate(['/file-upload']);
    }
    else if (sessionStorage.getItem("role")!=undefined && sessionStorage.getItem("role")=="user"){
      console.log("Going to music page");
      this.router.navigate(['/dashboard']);
    }
  }
  registerPage(){
    console.log("Calling registerPage()");
    this.router.navigate(['/register']);
  }

  get f() { return this.loginForm.controls; }
}

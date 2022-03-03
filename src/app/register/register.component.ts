import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  errorMessage:String = "";
  errorLogin:boolean = false;
  loading:boolean = false;
  submitted:boolean = false;
  details:any = null;

  constructor(private formBuilder: FormBuilder,
    private loginservice: LoginService,
    private router: Router
    ) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.compose([
        Validators.required,
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
      ])],
      passwordVerify: ['', Validators.required, this.verify()]
  });
  this.details = this.r.password;
   }

  ngOnInit(): void {
    // console.log(this.r.username);
    console.log(this.registerForm);
    
  }

  register(){
    let user = this.r.username.value;
    let pass = this.encrypt(this.r.password.value);
    this.loginservice.register(user, pass).subscribe((res)=>{
      console.log("Successfully registered");
      this.router.navigate(['']);
    },
    (err)=>{
      console.log("error in register");
      this.errorLogin = true;
      this.errorMessage = err.error;      
    });
  }
  verify(){
    if (this.registerForm){
      return this.r.password.value==this.r.passwordVerify.value;
    }
    else{
      return false;
    }
  }

  CryptoJS = require("crypto-js");

  encrypt = (text: String) => {
    return this.CryptoJS.enc.Base64.stringify(this.CryptoJS.enc.Utf8.parse(text));
  };

  decrypt = (data: String) => {
    return this.CryptoJS.enc.Base64.parse(data).toString(this.CryptoJS.enc.Utf8);
  };

  loginPage(){
    this.router.navigate(['/']);
  }

  get r() { return this.registerForm.controls; }
}

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
  }
  login(){
    this.authService.login("carlos@mail.com", "123").subscribe(data=> console.log('GO!'))
  }
}

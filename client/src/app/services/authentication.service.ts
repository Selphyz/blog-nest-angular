import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {map} from 'rxjs/operators'
export interface LoginForm{
  email: string;
  password: string;
}
export interface IUser{
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private http: HttpClient) { }
  login(loginForm: LoginForm){
    return this.http.post<any>('api/users/login', {email: loginForm.email, password: loginForm.password}).pipe(
      map((token)=>{
        localStorage.setItem('blog-token', token.access_token)
        return token;
      })
    )
  }
  register(user: IUser){
    return this.http.post<any>('/api/users/register', user).pipe(
      map(user=>user)
    )
  }
}

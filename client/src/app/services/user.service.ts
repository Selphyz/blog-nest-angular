import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
export interface UserData{
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: string;
}
export interface IUsersData {
  items: UserData[];
  meta:  {
    totalItems:   number;
    itemCount:    number;
    itemsPerPage: number;
    totalPages:   number;
    currentPage:  number;
  },
  links: {  
    first:    string;
    previous: string;
    next:     string;
    last:     string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  findAll(page: number, size: number){
    let params = new HttpParams();
    params = params.append('page', String(page));
    params = params.append('size', String(size));
    return this.http.get('/api/users', {params}).pipe(
      map((userData: IUsersData) => userData),
      catchError(err => throwError(err))
    )
  }
}

import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { map, tap } from 'rxjs/operators';
import { IUsersData, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  dataSource: IUsersData = null;
  displayedColumns: string[] = ['id', 'name', 'username', 'email', 'role']
  pageEvent: PageEvent;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.initDataSource();
  }
  initDataSource(){
    this.userService.findAll(1, 10).pipe(
      tap(users => console.log(users)),
      map((userData: IUsersData)=>this.dataSource=userData)
    ).subscribe();
  }
  onPaginateChange(event: PageEvent){
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page +1;
    this.userService.findAll(page, size).pipe(
      map((userData: IUsersData)=>this.dataSource=userData)
    ).subscribe();
  }
}

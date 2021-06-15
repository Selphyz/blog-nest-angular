import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from './models/user.interface';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() user: User): Observable<User | Object> {
    return this.userService.create(user).pipe(
      map((user: User) => user),
      catchError((err) => of({ err: err.message })),
    );
  }

  @Post('login')
  login(@Body() user: User): Observable<Object> {
    return this.userService.login(user).pipe(
      map((jwt: string) => {
        return { access_token: jwt };
      }),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: number): Observable<User> {
    return this.userService.findOne(id);
  }

  @Get()
  findAll(): Observable<User[]> {
    return this.userService.findAll();
  }

  @Put(':id')
  updateOne(@Param() id: number, @Body() user: User): Observable<User> {
    return this.userService.updateOne(id, user);
  }

  @Delete(':id')
  deleteOne(@Param() id: number): Observable<any> {
    return this.userService.deleteOne(id);
  }
}

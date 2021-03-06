import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { hasRoles } from 'src/auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from './models/user.entity';
import { User } from './models/user.interface';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
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
  index( @Query('page') page: number = 1, @Query('limit') limit: number = 10,): Observable<Pagination<User>> {
      limit = limit > 100 ? 100 : limit;
      return this.userService.pagination({page: Number(page), limit: Number(limit), route: 'http://localhost:4000/api/users'});
  }

  @Put(':id')
  updateOne(@Param() id: number, @Body() user: User): Observable<User> {
    return this.userService.updateOne(id, user);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/role')
  updateUserRole(@Param() id: number, @Body() user: User): Observable<User> {
    return this.userService.updateUserRole(id, user);
  }

  @Delete(':id')
  deleteOne(@Param() id: number): Observable<any> {
    return this.userService.deleteOne(id);
  }
}

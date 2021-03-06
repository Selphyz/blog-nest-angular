import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { UserEntity, UserRole } from './models/user.entity';
import { User } from './models/user.interface';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private authService: AuthService,
  ) {}
  create(user: User): Observable<User> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((passwordHash: string) => {
        const newUser = new UserEntity();
        newUser.name = user.name;
        newUser.username = user.username;
        newUser.role = user.role;
        newUser.email = user.email;
        newUser.password = passwordHash;
        newUser.role = UserRole.USER;
        return from(this.userRepo.save(newUser)).pipe(
          map((user: User) => {
            const { password, ...res } = user;
            return res;
          }),
          catchError((err) => throwError(err)),
        );
      }),
    );
  }
  findOne(id: number): Observable<User> {
    return from(this.userRepo.findOne({ id })).pipe(
      map((user: User) => {
        console.log(user);        
        const { password, ...res } = user;
        return res;
      }),
    );
  }
  findAll(): Observable<User[]> {
    return from(this.userRepo.find()).pipe(
      map((users: User[]) => {
        users.forEach((v) => {
          delete v.password;
        });
        return users;
      }),
    );
  }
  updateOne(id: number, user: User): Observable<any> {
    delete user.email;
    delete user.password;
    delete user.role;
    return from(this.userRepo.update(id, user));
  }
  updateUserRole(id: number, user: User): Observable<any> {
    return from(this.userRepo.update(id, user));
  }
  deleteOne(id: number): Observable<any> {
    return from(this.userRepo.delete(id));
  }
  login(user: User): Observable<string> {
    return this.validateUser(user.email, user.password).pipe(
      switchMap((user: User) => {
        if (user) {
          return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt));
        } else {
          return 'Wrong credentials';
        }
      }),
    );
  }
  pagination(options: IPaginationOptions): Observable<Pagination<User>> {
    return from(paginate<User>(this.userRepo, options)).pipe(
        map((usersPageable: Pagination<User>) => {
            usersPageable.items.forEach(function (v) {delete v.password});
            return usersPageable;
        })
    )
  }
  validateUser(email: string, password: string): Observable<User> {
    return this.findByMail(email).pipe(
        switchMap((user: User) => this.authService.comparePasswords(password, user.password).pipe(
            map((match: boolean) => {
                if(match) {
                    const {password, ...result} = user;
                    return result;
                } else {
                    throw Error;
                }
            })
        )
      )
    )
  }

  findByMail(email: string): Observable<User> {
    return from(this.userRepo.findOne({email}));
  }
}

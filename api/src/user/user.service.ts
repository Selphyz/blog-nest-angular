import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { UserEntity } from './models/user.entity';
import { User } from './models/user.interface';

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
        newUser.email = user.email;
        newUser.password = passwordHash;
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
  validateUser(email: string, password: string): Observable<User> {
    return this.findByMail(email).pipe(
      switchMap((user: User) =>
        this.authService.comparePasswords(password, user.password).pipe(
          map((match: boolean) => {
            if (match) {
              const { password, ...res } = user;
              return res;
            } else {
              throw Error;
            }
          }),
        ),
      ),
    );
  }
  findByMail(email: string): Observable<User> {
    return from(this.userRepo.findOne({ email }));
  }
}

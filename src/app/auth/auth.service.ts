import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { AuthData } from './auth-data.model';
import { UIService } from '../shared/ui.service';
import { IUser } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  user: IUser | any;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private uiService: UIService
  ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        console.log(user.displayName);
        this.user = {
          name: user?.displayName,
          email: user?.email,
          uid: user?.uid,
        };

        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['']);
      } else {
        this.user = null;
        this.authChange.next(false);
        this.router.navigate(['']);
        this.isAuthenticated = false;
      }
    });
  }

  registerUser(authData: AuthData, name: string) {
    this.uiService.loadingStateChanged.next(true);
    this.afAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((res) => {
        this.uiService.loadingStateChanged.next(false);
        res.user?.updateProfile({
          displayName: name,
        });
      })
      .catch((error) => {
        console.log(error);
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.afAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((res) => {
        this.uiService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        console.log(error);
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  logout() {
    this.user = null;
    this.afAuth.signOut();
    this.router.navigate(['']);
  }

  isAuth() {
    return this.isAuthenticated;
  }

  getUser() {
    return { ...this.user };
  }
}

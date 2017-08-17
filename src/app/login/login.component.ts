import {Component, EventEmitter, Output} from '@angular/core';
import { Router } from '@angular/router';
import { TdDialogService} from '@covalent/core';
import { ViewContainerRef } from '@angular/core';
import { TdLoadingService } from '@covalent/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';

@Component({
  selector: 'qs-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  selectedValue: string;
  password: string;
  states: FirebaseListObservable<any>;
  // @Output() state = new EventEmitter<string>();

  constructor(
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _dialogService: TdDialogService,
    private _viewContainerRef: ViewContainerRef,
    private af: AngularFire) {
    this.states = af.database.list('/user');
    // this.states.subscribe((queriedItems) => {
    //   console.log(queriedItems);
    // });
  }

  login(): void {
    const user: FirebaseObjectObservable<any> = this.af.database.object('/user/' + this.selectedValue);
    user.subscribe((snapshot) => {
      if (this.password === snapshot.password) {
        let storage = window.sessionStorage;
        storage.setItem('user', this.selectedValue);
        this._loadingService.register();
        setTimeout(() => {
          this._router.navigate(['/']);
          this._loadingService.resolve();
        }, 1200);
      }else {
        this._dialogService.openAlert({
          message: 'You have entered wrong username or password. Please contact your manager.',
          disableClose: false,
          viewContainerRef: this._viewContainerRef,
          title: 'Alert',
          closeButton: 'Close',
        });
      }
    });

    // if (this.selectedValue === 'admin1080' && this.password === 'Admin1080') {
    //   this._loadingService.register();
    //   setTimeout(() => {
    //     this._router.navigate(['/']);
    //     this._loadingService.resolve();
    //   }, 1200);
    // }else {
    //   this._dialogService.openAlert({
    //     message: 'You have entered wrong username or password. Please contact your manager.',
    //     disableClose: false,
    //     viewContainerRef: this._viewContainerRef,
    //     title: 'Alert',
    //     closeButton: 'Close',
    //   });
    // }
  }
}

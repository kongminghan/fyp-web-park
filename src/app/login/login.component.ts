import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TdDialogService} from '@covalent/core';
import { ViewContainerRef } from '@angular/core';
import { TdLoadingService } from '@covalent/core';

@Component({
  selector: 'qs-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  username: string;
  password: string;

  constructor(
    private _router: Router,
    private _loadingService: TdLoadingService,
    private _dialogService: TdDialogService,
    private _viewContainerRef: ViewContainerRef) {}

  login(): void {
    if (this.username === 'admin1080' && this.password === 'Admin1080') {
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
  }
}

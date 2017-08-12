import {Component, AfterViewInit, Input} from '@angular/core';
import { Title }     from '@angular/platform-browser';
import { TdDigitsPipe, TdDialogService} from '@covalent/core';

import { ItemsService, UsersService } from '../../../services';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'qs-product-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  viewProviders: [ ItemsService, UsersService ],
})
export class ProductOverviewComponent implements AfterViewInit {

  items: Object[];
  users: Object[];

  // @Input('state') state: string;
  storage = window.sessionStorage;

  // FireBase
  afItems: FirebaseListObservable<any>;
  afRate: FirebaseObjectObservable<any>;
  reverseList: any[] = [];
  carNumber: number;
  carPayment: number = 0.0;
  lastUpdatedCar: Date;
  lastUpdatedPayment: Date;
  // Parking rate
  rate: any = {
    'firstHour': 0,
    'nextHour': 0,
  };

  constructor(private _titleService: Title,
              private _dialogService: TdDialogService,
              af: AngularFire) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    this.afItems = af.database.list('/mall/' + this.storage.getItem('user'), {
      query: {
        orderByChild: 'timestamp',
        limitToLast: 10,
        startAt: currentDate.getTime(),
      },
    });
    this.afItems.subscribe((snapshots) => {
      snapshots.map((item) => {
        this.reverseList.push({
          CarNumber: item.CarNumber,
          LastEnterDate: item.LastEnterDate,
          LastEnterTime: item.LastEnterTime,
          timestamp: item.timestamp});
      });
      this.reverseList = this.reverseList.reverse();
    });

    // this.reverseList = this.afItems.map((arr) => {
    //   return arr.reverse(); });

    this.afRate = af.database.object('/user/' + this.storage.getItem('user') + '/rate');
    this.afRate.subscribe((snapshot) => {
      this.rate.firstHour = snapshot.firstHour;
      this.rate.nextHour = snapshot.nextHour;
      if (this.rate.firstHour === undefined) {
        this.rate.firstHour = 0;
      }
      if (this.rate.nextHour === undefined) {
        this.rate.nextHour = 0;
      }
    });

    const totalAmount = af.database.list('/stat/' + this.storage.getItem('user') , {
      query: {
        orderByChild: 'timestamp',
        startAt: currentDate.getTime(),
      },
    }).subscribe(snapshots => {
      this.carPayment = 0;
      snapshots.forEach(snapshot => {
        this.carPayment += snapshot.amount;
        this.lastUpdatedPayment = snapshot.timestamp;
      });
    });

    this.afItems.map(arr => arr).subscribe((arr) => {
      this.carNumber = arr.length;
      arr.forEach(a => {
        this.lastUpdatedCar = a.timestamp;
      });
    });
  }

  ngAfterViewInit(): void {
    this._titleService.setTitle( 'Product Name' );
    // this._loadingService.register('items.load');
    // this._itemsService.query().subscribe((items: Object[]) => {
    //   this.items = items;
    //   setTimeout(() => {
    //     this._loadingService.resolve('items.load');
    //   }, 2000);
    // }, (error: Error) => {
    //   this._itemsService.staticQuery().subscribe((items: Object[]) => {
    //     this.items = items;
    //     setTimeout(() => {
    //       this._loadingService.resolve('items.load');
    //     }, 2000);
    //   });
    // });
    // this._loadingService.register('users.load');
    // this._usersService.query().subscribe((users: Object[]) => {
    //   this.users = users;
    //   setTimeout(() => {
    //     this._loadingService.resolve('users.load');
    //   }, 2000);
    // }, (error: Error) => {
    //   this._usersService.staticQuery().subscribe((users: Object[]) => {
    //     this.users = users;
    //     setTimeout(() => {
    //       this._loadingService.resolve('users.load');
    //     }, 2000);
    //   });
    // });
  }
  // ngx transform using covalent digits pipe
  axisDigits(val: any): any {
    return new TdDigitsPipe().transform(val);
  }

  openPrompt(rate: any, type: string): void {
    this._dialogService.openPrompt({
      message: 'Enter the parking rate',
      value: rate,
    }).afterClosed().subscribe((value: any) => {
      if (value !== undefined) {
        if (isNaN(value)) {
          this._dialogService.openAlert({
            message: 'Please enter number only.',
            disableClose: false,
            title: 'Alert',
            closeButton: 'Close',
          });
        }else {
          if (type === 'first') {
            this.rate.firstHour = value;
            this.afRate.update({ firstHour: +value });
          }else {
            this.rate.nextHour = value;
            this.afRate.update({ nextHour: +value });
          }
        }
      }
    });
  }
}

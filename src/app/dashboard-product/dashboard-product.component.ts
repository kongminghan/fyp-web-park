import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from '@covalent/core';

@Component({
  selector: 'qs-dashboard-product',
  templateUrl: './dashboard-product.component.html',
  styleUrls: ['./dashboard-product.component.scss'],
})
export class DashboardProductComponent implements AfterViewInit {

  title: string;
  mall: string;
  constructor(private _titleService: Title,
              public media: TdMediaService,
              private _router: Router) { }

  ngAfterViewInit(): void {
    // broadcast to all listener observables when loading the page
    this.media.broadcast();

    // this._titleService.setTitle( 'Dashboard' );
    // this.title = this._titleService.getTitle();
    let storage = window.sessionStorage;
    this.mall = storage.getItem('user');
  }
  logout(): void {
    let storage = window.sessionStorage;
    storage.clear();
    this._router.navigate(['/login']);
  }
}

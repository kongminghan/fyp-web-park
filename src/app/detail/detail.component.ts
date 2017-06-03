import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { ItemsService } from '../../services';
import {AngularFire, FirebaseListObservable} from "angularfire2";

@Component({
  selector: 'qs-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  viewProviders: [ ItemsService ],
})
export class DetailComponent implements OnInit {

  carNumber: string;
  lastPark: string;
  afItems: FirebaseListObservable<any>;

  constructor(private _router: Router, private _itemsService: ItemsService, private _route: ActivatedRoute, af: AngularFire) {
    this._route.params.subscribe((params: {id: string}) => {
      this.carNumber = params.id;
      this.afItems = af.database.list('/record/' + this.carNumber + '/record', {
        query: {
          orderBy: 'timestamp',
        },
      });
      this.afItems.subscribe(snapshots => {
        this.lastPark = snapshots[snapshots.length - 1].LastEnterDate;
      });
    });
  }

  goBack(): void {
    this._router.navigate(['../../']);
  }

  ngOnInit(): void {
  }
}

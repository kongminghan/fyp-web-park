import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA} from '@angular/material';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
@Component({
  selector: 'app-dialog-detail',
  templateUrl: './dialog-detail.component.html',
  styleUrls: ['./dialog-detail.component.scss']
})
export class DialogDetailComponent implements OnInit {

  carNumber: string;
  lastPark: string;
  afItems: FirebaseListObservable<any>;

  constructor(@Inject(MD_DIALOG_DATA) public data: any,
              af: AngularFire) {
    this.afItems = af.database.list('/record/' + data + '/record', {
      query: {
        orderBy: 'timestamp',
      },
    });
    this.afItems.subscribe((snapshots) => {
      this.lastPark = snapshots[snapshots.length - 1].LastEnterDate;
    });
    this.carNumber = data;
  }

  ngOnInit() {
  }

}

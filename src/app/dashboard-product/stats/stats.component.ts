import {Component, AfterViewInit} from '@angular/core';
import {Title}     from '@angular/platform-browser';
import { TdDataTableSortingOrder, TdDataTableService, ITdDataTableSortChangeEvent, TdDigitsPipe,
} from '@covalent/core';
import {IPageChangeEvent} from '@covalent/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { MomentModule } from 'angular2-moment';

const NUMBER_FORMAT: any = (v: { value: number }) => v.value;
const DECIMAL_FORMAT: any = (v: { value: number }) => v.value.toFixed(2);

@Component({
  selector: 'qs-product-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class ProductStatsComponent implements AfterViewInit {
  columns: any[] = [
    {name: 'name', label: 'Car Plate Number'},
    {name: 'date', label: 'Last Enter Date'},
    {name: 'time', label: 'Last Enter Time'},
    // {name: 'usage', label: 'CPU Time (m)', numeric: true, format: NUMBER_FORMAT},
    // {name: 'users', label: 'Users (K)', numeric: true, format: DECIMAL_FORMAT},
    // {name: 'load', label: 'load (%)', numeric: true, format: NUMBER_FORMAT},
  ];

  data: any[] = [];

  // chart
  firebaseData: any[] = [{
    name: 'Number of cars',
    series: [],
  }];
  multi: any[] = [];
  afItems: FirebaseListObservable<any>;
  afTable: FirebaseListObservable<any>;

  // Generic Chart options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  autoScale: boolean = true;
  showLegend: boolean = false;
  showXAxisLabel: boolean = false;
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'X Axis';
  yAxisLabel: string = 'Number of cars';

  colorScheme: any = {
    domain: [
      '#01579B', '#0091EA', '#FFB74D', '#E64A19',
    ],
  };

  filteredData: any[] = this.data;
  filteredTotal: number = this.data.length;
  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 5;
  sortBy: string = 'name';
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

  storage = window.sessionStorage;

  constructor(private _titleService: Title,
              private _dataTableService: TdDataTableService,
              private af: AngularFire,
              moment: MomentModule) {
    this.afItems = af.database.list('/car', {query: {orderBy: 'timestamp'}});

    const today: Date = new Date();
    today.setHours(0, 0, 0, 0);
    // today.setDate(today.getDate() - 4);
    this.updateChartData(today);

    // const chartData = af.database.list('/usage/' + this.storage.getItem('user'), {
    //   query: {
    //     orderByChild: 'timestamp',
    //     startAt: today.getTime(),
    //   },
    // });
    // chartData.subscribe((snapshots) => {
    //   snapshots.forEach((snapshot) => {
    //     this.firebaseData[0].series.push({
    //       'value': snapshot.count,
    //       'name': new Date(snapshot.timestamp).toLocaleTimeString(),
    //     });
    //   });
    //   this.multi = this.firebaseData;
    // });

    this.afTable = af.database.list('/car');
    this.afTable.subscribe((snapshots) => {
      snapshots.forEach((snapshot) => {
        this.data.push({
          'name': snapshot.CarNumber,
          'date': snapshot.LastEnterDate,
          'time': snapshot.LastEnterTime,
        });
        this.filteredData = this.data;
        this.filter();
      });
    });
  }

  ngAfterViewInit(): void {
    this._titleService.setTitle('Product Stats');
    this.filter();
  }

  sort(sortEvent: ITdDataTableSortChangeEvent): void {
    this.sortBy = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter();
  }

  search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filter();
  }

  page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }

  filter(): void {
    let newData: any[] = this.data;
    newData = this._dataTableService.filterData(newData, this.searchTerm, true);
    this.filteredTotal = newData.length;
    newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
    newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.filteredData = newData;
  }

  updateChart(value: string): void {
    if (value === 'today') {
      let today: Date = new Date();
      today.setHours(0, 0, 0, 0);
      this.updateChartData(today);
    }else if (value === 'ytd') {
      let today: Date = new Date();
      today.setHours(0, 0, 0, 0);
      today.setDate(today.getDate() - 1);
      this.updateChartData(today);
    }else if (value === 'week') {
      let today: Date = new Date();
      today.setHours(0, 0, 0, 0);
      today.setDate(today.getDate() - 6);
      this.updateChartData(today);
    }else if (value === 'month') {
      let today: Date = new Date();
      today.setHours(0, 0, 0, 0);
      today.setDate(today.getDate() - 30);
      this.updateChartData(today);
    } else {
      let today: Date = new Date();
      today.setHours(0, 0, 0, 0);
      today.setDate(today.getDate() - 365);
      this.updateChartData(today);
    }
  }

  updateChartData(date: Date): void {
    this.firebaseData = [{
      name: 'Number of cars',
      series: [],
    }];

    const chartData = this.af.database.list('/usage/' + this.storage.getItem('user'), {
      query: {
        orderByChild: 'timestamp',
        startAt: date.getTime(),
        // endAt: endOfDay.getTime(),
      },
    });
    chartData.subscribe((snapshots) => {
      snapshots.forEach((snapshot) => {
        this.firebaseData[0].series.push({
          'value': snapshot.count,
          'name': new Date(snapshot.timestamp),
        });
      });
      this.multi = [];
      this.multi = this.firebaseData;
      this.multi[0].series.push({
        'value': 0,
        'name': new Date(),
      });
      // console.log(this.multi);
    });
  }

  // getDate(date: Date): string {
  //   let mm: number = date.getMonth() + 1; // getMonth() is zero-based
  //   let dd: number = date.getDate();
  //
  //   let strDate: string =  [date.getFullYear(),
  //     (mm > 9 ? '' : '0') + mm,
  //     (dd > 9 ? '' : '0') + dd,
  //   ].join('/');
  //
  //   let strTime: string = date.getHours().toString() + date.getMinutes().toString();
  //   return strTime + ' ' + strDate;
  // };

  // ngx transform using covalent digits pipe
  axisDigits(val: any): any {
    return new TdDigitsPipe().transform(val);
  }
}

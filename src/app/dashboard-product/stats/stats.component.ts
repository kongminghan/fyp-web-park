import {Component, AfterViewInit} from '@angular/core';
import {Title}     from '@angular/platform-browser';
import { TdDataTableSortingOrder, TdDataTableService, ITdDataTableSortChangeEvent, TdDigitsPipe,
} from '@covalent/core';
import {IPageChangeEvent} from '@covalent/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';

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

  constructor(private _titleService: Title,
              private _dataTableService: TdDataTableService,
              af: AngularFire) {
    this.afItems = af.database.list('/car', {query: {orderBy: 'timestamp'}});

    const startOfDay: Date = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfStart: Date = new Date();
    endOfStart.setHours(0, 0, 0, 0);
    endOfStart.setMinutes(startOfDay.getMinutes() + 20);
    const after15: Date = new Date();
    after15.setHours(0, 0, 0, 0);
    const endOfDay: Date = new Date();

    do {
      const chartData = af.database.list('/statCar', {
        query: {
          orderByChild: 'timestamp',
          startAt: startOfDay.getTime(),
          endAt: endOfStart.getTime(),
        },
      }).subscribe((snapshots) => {
        this.firebaseData[0].series.push({
          'value': snapshots.length,
          'name': after15,
        });
        after15.setMinutes(after15.getMinutes() + 20);

        this.multi = this.firebaseData.map((group: any) => {
          group.series = group.series.map((dataItem: any) => {
            dataItem.name = new Date(dataItem.name);
            return dataItem;
          });
          return group;
        });
      });
      startOfDay.setMinutes(startOfDay.getMinutes() + 20);
      endOfStart.setMinutes(endOfStart.getMinutes() + 20);
    } while (startOfDay < endOfDay);

    this.afTable = af.database.list('/car');
    this.afTable.subscribe((snapshots) => {
      snapshots.forEach((snapshot) => {
        this.data.push({
          'name': snapshot.CarNumber,
          'date': snapshot.LastEnterDate,
          'time': snapshot.LastEnterTime,
        });
        this.filteredData = this.data;
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

  // ngx transform using covalent digits pipe
  axisDigits(val: any): any {
    return new TdDigitsPipe().transform(val);
  }
}

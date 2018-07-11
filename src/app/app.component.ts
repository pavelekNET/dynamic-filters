import {Component, OnInit} from '@angular/core';
import {IAgent, IODataColumn, OdataService} from './odata.service';
import {Observable} from 'rxjs';
import {MatSelectChange} from '@angular/material/select/typings/select';

export interface IODataFilter {
  column: IODataColumn;
  operator: string;
  value: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public columns: IODataColumn[];
  public selectedColumns: IODataColumn[] = [];
  public selectedFilters: IODataFilter[] = [];
  public emptyColumn: IODataColumn = {name: 'empty', type: null, columnDef: 'empty', operators: []};
  public emptyFilter: IODataFilter = {column: Object.assign({}, this.emptyColumn), operator: null, value: null};
  public agents$: Observable<IAgent[]>;
  public displayedColumns: string[];

  constructor(private readonly odata: OdataService) {
    this.selectedColumns.push(Object.assign({}, this.emptyColumn));
    this.selectedFilters.push(Object.assign({}, this.emptyFilter));
  }

  ngOnInit() {
    this.odata.getAgentColumns()
      .subscribe(columns => {
        this.columns = columns;
      });
    this.agents$ = this.odata.Query().Exec();
  }

  public addColumn() {
    if (this.selectedColumns.length >= this.columns.length || this.selectedColumns[this.selectedColumns.length - 1].columnDef === this.emptyColumn.columnDef) return;
    this.selectedColumns.push(Object.assign({}, this.emptyColumn));
  }

  public addFilter() {
    if (this.selectedFilters.length >= this.columns.length || this.selectedFilters[this.selectedFilters.length - 1].column.columnDef === this.emptyColumn.columnDef) return;
    this.selectedFilters.push(Object.assign({}, this.emptyFilter));
  }

  public removeColumn(selectedColumn: IODataColumn) {
    if (this.selectedColumns.length === 1) return;
    this.selectedColumns.splice(this.selectedColumns.indexOf(selectedColumn), 1);
    this.remapDisplayedColumns();
  }

  public removeFilter(selectedFilter: IODataFilter) {
    if (this.selectedFilters.length === 1) return;
    this.selectedFilters.splice(this.selectedFilters.indexOf(selectedFilter), 1);
  }

  public applyFilters() {
    const filter = this.selectedFilters.reduce<string>((accumulator, current, index, arr) => {
      if (index !== 0) {
        accumulator += ' and ';
      }

      const valueInt = Number.parseInt(current.value);
      console.log(`${accumulator}${current.column.columnDef} ${current.operator} ${isNaN(valueInt) ? '\'' + current.value + '\'' : valueInt}`);
      return `${accumulator}${current.column.columnDef} ${current.operator} ${isNaN(valueInt) ? '\'' + current.value + '\'' : valueInt}`;
    }, '');
    this.agents$ = this.odata
      .Query()
      .Select(this.displayedColumns)
      .Filter(filter)
      .Exec();
  }

  public columnSelected(e: MatSelectChange) {
    this.remapDisplayedColumns();
    this.agents$ = this.odata.Query().Select(this.displayedColumns).Exec();
  }

  private remapDisplayedColumns() {
    this.displayedColumns = this.selectedColumns.filter(c => c.columnDef !== this.emptyColumn.columnDef).map(c => c.columnDef);
  }
}

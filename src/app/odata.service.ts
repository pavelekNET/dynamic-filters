import {Injectable, Type} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {ODataService, ODataServiceFactory} from 'angular-odata-es5';
import {ODataQuery} from 'angular-odata-es5/angularODataQuery';

export interface IODataColumn {
  columnDef: string;
  name: string;
  type: string;
  operators: IODataOperator[];
}

export interface IAgent {
  id: number;
  name: string;
  priority: string;
}

export interface IODataOperator {
  name: string;
  odataOperator: string;
}

@Injectable({
  providedIn: 'root'
})
export class OdataService {
  private odata: ODataService<IAgent>;


  constructor(private http: HttpClient, private odataFactory: ODataServiceFactory) {
    this.odata = this.odataFactory.CreateService<IAgent>('Agents');
  }

  public getAgentColumns(): Observable<IODataColumn[]> {
    return this.http.get('http://localhost:51023/odata/$metadata#Agents', {responseType: 'text'})
      .pipe(
        map((res: any) => {
          const columns: IODataColumn[] = [];
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(res, 'application/xml');
          const entityType = xmlDoc.getElementsByTagName('EntityType')[0];
          console.log(entityType);
          const properties = entityType.getElementsByTagName('Property');
          for (let i = 0; i < properties.length; i++) {
            const columnDef = properties.item(i).getAttribute('Name');
            const columnType = properties.item(i).getAttribute('Type');
            columns.push({columnDef, name: columnDef, type: columnType, operators: this.getOperators(columnType)});
          }
          console.log(columns);
          return columns;
        })
      );
  }

  public Query(): ODataQuery<IAgent> {
    return this.odata
      .Query();
  }
  public getOperators(type: string) {
    const operators: IODataOperator[] = [];
    if (type === 'Edm.String' || type.startsWith('Edm.Int') || type === 'Edm.Boolean') {
      operators.push({name: '=', odataOperator: 'eq'});
      operators.push({name: '<>', odataOperator: 'ne'});
    }
    if (type === 'Edm.String') {
      operators.push({name: 'LIKE', odataOperator: 'contains'});
    }
    if (type.startsWith('Edm.Int')) {
      operators.push({name: '>', odataOperator: 'gt'});
      operators.push({name: '>=', odataOperator: 'ge'});
      operators.push({name: '<', odataOperator: 'lt'});
      operators.push({name: '<=', odataOperator: 'le'});
    }
    return operators;
  }
}

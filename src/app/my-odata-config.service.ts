import { Injectable } from '@angular/core';
import {ODataConfiguration} from 'angular-odata-es5';

@Injectable({
  providedIn: 'root'
})
export class MyODataConfigService extends ODataConfiguration {
  public baseUrl = 'http://localhost:51023/odata/';
}

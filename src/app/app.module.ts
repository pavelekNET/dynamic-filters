import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {MatButtonModule, MatExpansionModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTableModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {MyODataConfigService} from './my-odata-config.service';
import {ODataConfiguration, ODataServiceFactory} from 'angular-odata-es5';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatExpansionModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    HttpClientModule,
    MatTableModule
  ],
  providers: [
    {provide: ODataConfiguration, useClass: MyODataConfigService},
    ODataServiceFactory
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

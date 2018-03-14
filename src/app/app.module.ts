import { NgModule, Type } from '@angular/core';
import { BrowserModule, Title }  from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CovalentCoreModule, CovalentPagingModule } from '@covalent/core';
import { CovalentHttpModule, IHttpInterceptor } from '@covalent/http';
import { CovalentHighlightModule } from '@covalent/highlight';
import { CovalentMarkdownModule } from '@covalent/markdown';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { UsersComponent } from './users/users.component';
// import { UsersFormComponent } from './users/form/form.component';
// import { LogsComponent } from './logs/logs.component';
// import { FormComponent } from './form/form.component';
import { DetailComponent } from './detail/detail.component';
import { LoginComponent } from './login/login.component';
import { DashboardProductComponent } from './dashboard-product/dashboard-product.component';
import { ProductOverviewComponent } from './dashboard-product/overview/overview.component';
import { ProductStatsComponent } from './dashboard-product/stats/stats.component';
import { ProductFeaturesComponent } from './dashboard-product/features/features.component';
import { FeaturesFormComponent } from './dashboard-product/features/form/form.component';
// import { TemplatesComponent } from './templates/templates.component';
// import { DashboardTemplateComponent } from './templates/dashboard/dashboard.component';
// import { EmailTemplateComponent } from './templates/email/email.component';
// import { EditorTemplateComponent } from './templates/editor/editor.component';
import { appRoutes, appRoutingProviders } from './app.routes';

import { RequestInterceptor } from '../config/interceptors/request.interceptor';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AngularFireModule} from 'angularfire2';
import { MomentModule } from 'angular2-moment';
import {MdDialogModule} from "@angular/material";
import { DialogDetailComponent } from './dialog-detail/dialog-detail.component';
import { ManageUserComponent } from './manage-user/manage-user.component';

const httpInterceptorProviders: Type<any>[] = [
  RequestInterceptor,
];

export const firebaseConfig = {
  apiKey: KEY,
  authDomain: URL,
  databaseURL: DB_URL,
  storageBucket: STORAGE_URL,
  messagingSenderId: ID,
};

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    DashboardComponent,
    DashboardProductComponent,
    ProductOverviewComponent,
    ProductStatsComponent,
    ProductFeaturesComponent,
    FeaturesFormComponent,
    // UsersComponent,
    // UsersFormComponent,
    // LogsComponent,
    // FormComponent,
    DetailComponent,
    LoginComponent,
    DialogDetailComponent,
    ManageUserComponent,
    // TemplatesComponent,
    // DashboardTemplateComponent,
    // EmailTemplateComponent,
    // EditorTemplateComponent,
  ], // directives, components, and pipes owned by this NgModule
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CovalentCoreModule,
    CovalentPagingModule,
    CovalentHttpModule.forRoot({
      interceptors: [{
        interceptor: RequestInterceptor, paths: ['**'],
      }],
    }),
    CovalentHighlightModule,
    CovalentMarkdownModule,
    appRoutes,
    NgxChartsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    MomentModule,
    MdDialogModule,
  ], // modules needed to run this module
  providers: [
    appRoutingProviders,
    httpInterceptorProviders,
    Title,
  ], // additional providers needed for this module
  entryComponents: [DialogDetailComponent ],
  bootstrap: [ AppComponent ],
})
export class AppModule {}

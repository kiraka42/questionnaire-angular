import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Ng2Webstorage, LocalStorageService } from 'ngx-webstorage';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './/app-routing.module';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { SlideMenuModule } from 'cuppa-ng2-slidemenu/cuppa-ng2-slidemenu';

import { AppComponent } from './app.component';
import { QuestionComponent } from './question/question.component';
import { AnswerComponent } from './answer/answer.component';
import { StatementComponent } from './statement/statement.component';
import { AppDataService } from './app-data.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeadBandComponent } from './head-band/head-band.component';
import { ThemeComponent } from './theme/theme.component';
import { DashboardHomepageComponent } from './dashboard-homepage/dashboard-homepage.component';
import { ResultComponent } from './result/result.component';
import { StatementHeaderComponent } from './statement-header/statement-header.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { ResultPageComponent } from './result-page/result-page.component'
import { ImageResultComponent } from './image-result/image-result.component';
import { SuggestionsComponent } from './suggestions/suggestions.component';
import { SituationComponent } from './situation/situation.component';
import { IntroductionComponent } from './introduction/introduction.component';


@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent,
    AnswerComponent,
    StatementComponent,
    DashboardComponent,
    HeadBandComponent,
    ThemeComponent,
    DashboardHomepageComponent,
    ResultComponent,
    StatementHeaderComponent,
    ButtonsComponent,
    ResultPageComponent,
    ImageResultComponent,
    SuggestionsComponent,
    ButtonsComponent,
    SituationComponent,
    IntroductionComponent,
  ],
  imports: [
    BrowserModule,
    Ng2Webstorage,
    FormsModule,
    AppRoutingModule,
    SlideMenuModule
  ],
  providers: [
    AppDataService,
    LocalStorageService,
    {provide: LocationStrategy, useClass: HashLocationStrategy} //Solves the refresh problem
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

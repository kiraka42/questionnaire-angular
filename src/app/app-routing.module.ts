import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StatementComponent } from './statement/statement.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { DashboardHomepageComponent } from './dashboard-homepage/dashboard-homepage.component'
import { ResultPageComponent } from './result-page/result-page.component';
import { SituationComponent } from './situation/situation.component';
import { SuggestionsComponent } from './suggestions/suggestions.component';
import { IntroductionComponent } from './introduction/introduction.component';

// List of available routes
const routes: Routes = [
  { path: '', redirectTo: '/introduction', pathMatch: 'full' },
  { path: 'theme/:id', component: StatementComponent },
  { path: 'dashboard', component: DashboardHomepageComponent },
  { path: 'result/:id', component: ResultPageComponent },
  { path: 'situation/:id', component: SituationComponent },
  { path: 'suggestion/:id', component: SuggestionsComponent },
  { path: 'introduction', component: IntroductionComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {
  
}

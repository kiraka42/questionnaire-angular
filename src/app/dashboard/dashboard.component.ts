/*
 * NOT USED COMPONENT
 */

import { Component, OnInit } from '@angular/core';
import { AppDataService } from '../app-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  themeList: {
    title: string,
    description: string
  }[];

  constructor(private appDataService: AppDataService) { }

  ngOnInit() {
    this.getThemesInfos();
  }

  getThemesInfos(): void {
    this.themeList = this.appDataService.getThemesInfos();
  }

  themeChoice(themeId: number) {
    this.appDataService.setThemeId(themeId);
  }

}

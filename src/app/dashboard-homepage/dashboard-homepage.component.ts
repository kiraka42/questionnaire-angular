/*
 *      DASHBOARD HOMEPAGE COMPONENT
 * Groups all dashboard-related components
 * /dashboard 
 */

import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { AppDataService } from '../app-data.service';

@Component({
  selector: 'app-dashboard-homepage',
  templateUrl: './dashboard-homepage.component.html',
  styleUrls: ['./dashboard-homepage.component.css']
})
export class DashboardHomepageComponent implements OnInit {

  themeBackground: string[];

  constructor(
    private sanitizer: DomSanitizer,
    private appDataService: AppDataService
  ) { }

  ngOnInit() {
    // --TO CHANGE-- // Make it so it's dynamic according to the number of themes
    this.themeBackground = [
      "../../assets/Illus1.jpg", 
      "../../assets/Illus2.jpg", 
      "../../assets/Illus3.jpg", 
      "../../assets/Illus4.jpg"
    ];
  }

}

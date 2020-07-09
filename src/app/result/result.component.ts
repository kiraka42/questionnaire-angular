/*
 * Component name not relevant
 * This component is the "My management" title box in the homepage
 * /dashboard
 */

import { Component, OnInit } from '@angular/core';
import { AppDataService } from '../app-data.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  title: string;

  constructor(private appDataService: AppDataService) { }

  ngOnInit() {
    this.setLanguage();
  }

  // Adpat the title language according to the selected language
  setLanguage() {
    if (this.appDataService.getLangLocalStorage() === null) {
      this.appDataService.getLanguage() === 'FR' ? this.title = "Mon management" : this.title = "My management";
      this.appDataService.langChange.subscribe((value) => {
        this.appDataService.getLanguage() === 'FR' ? this.title = "Mon management" : this.title = "My management";
      })
    } else {
      this.appDataService.getLangLocalStorage() === 'FR' ? this.title = "Mon management" : this.title = "My management";
      this.appDataService.langChange.subscribe((value) => {
        this.appDataService.getLangLocalStorage() === 'FR' ? this.title = "Mon management" : this.title = "My management";
      })
    }
  }

}

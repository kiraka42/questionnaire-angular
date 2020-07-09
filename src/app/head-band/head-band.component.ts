/*
 *                           HEAD BAND COMPONENT
 * Displays the header bar in the homepage (Orange's logo + language selector)
 * /dashboard 
 */
import { Component, OnInit } from '@angular/core';
import { AppDataService } from '../app-data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-head-band',
  templateUrl: './head-band.component.html',
  styleUrls: ['./head-band.component.css']
})
export class HeadBandComponent implements OnInit {

  FRStyle: string;
  ENStyle: string;
  menuItemsArray: any[] = [
    { "title": "Introduction", "link": "/introduction" },
    { "title": "Situations", "link": "/dashboard" },
    { "title": "AM I IN?", "link": "/suggestion/-1" },
  ];
  config: any = {
    closeOnCLick: true
  };

  noscroll() {
    //window.scrollTo(0, 0);
  }

  public onMenuClose() {
    // Remove listener to disable scroll
    window.removeEventListener('scroll', this.noscroll);
  }
  public onMenuOpen() {
    // add listener to disable scroll
    window.addEventListener('scroll', this.noscroll);
  }
  public onItemSelect(item: any) {
    this.router.navigate([item.link]);
  }

  constructor(private appDataService: AppDataService,
  private router: Router) { }

  ngOnInit() {
    // On component render, verifies if a language is already saved in the local storage
    // If not, the default language is selected
    if (this.appDataService.getLangLocalStorage() === null) {
      this.setLangStyle(this.appDataService.getLanguage());
      this.appDataService.setLangLocalStorage(this.appDataService.getLanguage());
    } else {
      this.setLangStyle(this.appDataService.getLangLocalStorage());
    }
  }

  // Changes the class name of the language selector according to the language selected
  setLangStyle(currentLang: string) {
    switch (currentLang) {
      case "FR":
        this.FRStyle = "headband-block-language-selected";
        this.ENStyle = "headband-block-language-not-selected";
        break;
      case "EN":
        this.ENStyle = "headband-block-language-selected";
        this.FRStyle = "headband-block-language-not-selected";
        break;
      default:
        break;
    }
  }

  // On a language clicked
  setLanguage(lang: string) {
    this.appDataService.changeLanguage(lang);
    this.setLangStyle(lang);
    this.appDataService.setLangLocalStorage(lang); // Saves the selected language in the local storage
    this.appDataService.langChange.next(lang); // Updates the changes to other components
  }


}

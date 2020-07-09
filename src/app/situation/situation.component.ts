/*
 *                            SITUATION COMPONENT
 * Display a short description of the selected theme before begining the questions
 * /situation/:id 
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppDataService } from '../app-data.service';

@Component({
  selector: 'app-situation',
  templateUrl: './situation.component.html',
  styleUrls: ['./situation.component.css']
})
export class SituationComponent implements OnInit {

  title: string;
  description: string;
  themeId: number;
  state: string = "Non commencée";
  bgColor: string = "black";
  txtColor: string = "#ff7900";
  image: string = 'url(\"../../assets/Illus1.jpg\")';
  isFR: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appDataService: AppDataService
  ) { }

  ngOnInit() {
    this.themeId = +this.route.snapshot.paramMap.get('id'); // Gets the theme id from the url
    this.checkId(this.themeId);
    this.title = this.appDataService.getThemesInfos()[this.themeId].title;
    this.description = this.appDataService.getThemesInfos()[this.themeId].description;
    this.checkThemeFinished(); 
    this.changeButtonNames();
    this.image = 'url(\"../../assets/Illus' + (this.themeId + 1) + '.jpg\")';
  }

  checkId(id: any) {
    if (id < 0 || id > 4 || isNaN(id)){
      this.themeId = 0; //remove console error
      this.router.navigate(['/dashboard']);
    }
  }

  // Apply the corresponding style according to the selected language and the state of the theme (finished or not)
  checkThemeFinished() {
    if (this.appDataService.getThemeFinished(this.themeId)) {
      this.appDataService.getLangLocalStorage() === 'FR' ? this.state = "Terminée" : this.state = "Finished";
      this.bgColor = "#ff7900"
      this.txtColor = "white";
    } else {
      this.appDataService.getLangLocalStorage() === 'FR' ? this.state = "Non commencée" : this.state = "Not started";
      this.bgColor = "black"
      this.txtColor = "#ff7900";
    }
  }

  // Edit the buttons' name according to the selected language
  changeButtonNames() {
    this.appDataService.getLangLocalStorage() === 'FR' ? this.isFR = true : this.isFR = false;
  }

  // On 'Homepage' button clicked
  begin() {
    this.router.navigate(['dashboard']);
  }

  // On 'Start' button clicked (both methods' name are inverted)
  backHomepage() {
    this.router.navigate(['theme/' + this.themeId]);
  }

}

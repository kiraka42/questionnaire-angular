/*
 *                THEME COMPONENT
 *  Clickable component to choose the desired theme
 *  /dashboard
 */

import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AppDataService } from '../app-data.service';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.css']
})
export class ThemeComponent implements OnInit {

  @Input() nb: number;
  @Input() urlImage: any;

  title: string;
  state: string = "Non commencée";
  bgColor: string = "black";
  txtColor: string = "#ff7900";
  scoreImage: string;

  constructor(
    private sanitizer: DomSanitizer,
    private appDataService: AppDataService
  ) { }

  ngOnInit() {
    this.urlImage = this.sanitizer.bypassSecurityTrustStyle(`url('${this.urlImage}')`);
    this.checkThemeFinished();
    this.title = this.appDataService.getThemesInfos()[this.nb - 1].title;
    this.getThemeLevel();

    // Each time the appDataService's 'lang' variable is updated, this method is called
    this.appDataService.langChange.subscribe((value) => {
      this.checkThemeFinished();
      this.title = this.appDataService.getThemesInfos()[this.nb - 1].title;
    })
  }

  // Sets the right character
  getThemeLevel() {
    this.appDataService.getLocalStorage(this.nb - 1)
      .subscribe(theme => {
        if (theme) {
          this.scoreImage = "../../assets/svg/personnages/Chara" + this.nb + "." + theme.niveauInclusivite + ".png";
        }else{
          this.scoreImage = "../../assets/svg/personnages/Chara" + this.nb + ".0.png";
        }
      })
  }

  // Changes the component texts and colors according to if the theme is completed or not
  // Also changes the text according to the selected language
  checkThemeFinished() {
    if (this.appDataService.getThemeFinished(this.nb - 1)) {
      this.appDataService.getLangLocalStorage() === 'FR' ? this.state = "Terminée" : this.state = "Finished";
      this.bgColor = "#ff7900"
      this.txtColor = "white";
    } else {
      this.appDataService.getLangLocalStorage() === 'FR' ? this.state = "Non commencée" : this.state = "Not started";
      this.bgColor = "black"
      this.txtColor = "#ff7900";
    }
  }


}

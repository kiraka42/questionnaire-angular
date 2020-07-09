/*
 *               SUGGESTION COMPONENT
 *  Component that displays the current theme's results
 *  /suggestion/:id
 */

import { Component, OnInit } from '@angular/core';
import { AppDataService } from '../app-data.service';
import { ActivatedRoute, Router } from '@angular/router';

import { INFOS_EN, INFOS_FR, OTHER_INFOS_EN, OTHER_INFOS_FR } from '../mock_suggestions_texts';
import { LINK1_FR, LINK2_FR, SUGGESTION1_FR, SUGGESTION2_FR } from '../mock_suggestions_texts';
import { LINK1_EN, LINK2_EN, SUGGESTION1_EN, SUGGESTION2_EN } from '../mock_suggestions_texts';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.css']
})
export class SuggestionsComponent implements OnInit {

  themeId: number;
  themeScore: number;
  totalScore: number;
  niveauInclusivite: number; // 1 to 4 levels
  niveauInclusiviteTotal: number; // 1 to 4 levels

  // Path to the characters' pictures
  path: string = "../../assets/svg/personnages/";
  persos: string[] = [
    this.path + this.selectPerson(1, 0),
    this.path + this.selectPerson(2, 0),
    this.path + this.selectPerson(3, 0),
    this.path + this.selectPerson(4, 0)
  ]

  title: string;

  infos: string[] = []; // Result variable
  otherInfos: string[] = []; // In case of additional information

  suggestion1: string[][] = [];
  link1: string[][] = []; // Url for first suggestion
  suggestion2: string[][] = [];
  link2: string[][] = []; // Url for first suggestion
  linkButtonText: string;

  isFR: boolean; // True if french, false if english
  isNotLastTheme: boolean = true; // To remove Next theme button if it's the last theme
  isSuggestions: boolean = true;

  constructor(
    private router: Router,
    private appDataService: AppDataService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.themeId = +this.route.snapshot.paramMap.get('id'); // We get the theme ID from the URL
    this.checkId(this.themeId);
    // this.appDataService.setThemeFinished(true); // We set the theme to finished
    this.themeScore = this.appDataService.getThemeScore(this.themeId);
    this.niveauInclusivite = this.getNiveauIncusivite(this.themeScore);
    this.totalScore = this.appDataService.getScoreTotal();
    this.isSuggestions = this.themeId !== -1 && this.niveauInclusivite !== 0;
    this.getNiveauTotalInclusivite();
    this.changePerson();
    this.displayInfo();
    this.displaySuggestions();
    this.setTitle();
    this.checkLastTheme();
    this.changeTextLinkButtons();
    this.saveNiveauInclusivite();
    this.blurSelectedCharacter();
    this.displayTotalSuggestion();
  }

  checkId(id: any) {
    if (id < -1 || id > 4 || isNaN(id)){
      this.themeId = 0; //remove console error
      this.router.navigate(['/dashboard']);
    }
  }

  // Saves the inclusivity score in the local storage
  saveNiveauInclusivite() {
    this.appDataService.getLocalStorage(this.themeId)
      .subscribe(theme => {
        if (theme) {
          theme.niveauInclusivite = this.niveauInclusivite;
          this.appDataService.setLocalStorage(this.themeId, theme);
        }
      })
  }

  // Deduces the inclusivity level with the calculated score
  getNiveauIncusivite(themeScore: number): number {
    if (themeScore === 0) {
      return 0;
    }
    if (themeScore < 60.4) {
      return 1;
    } else if (themeScore < 91) {
      return 2;
    } else if (themeScore < 111.2) {
      return 3;
    } else {
      return 4;
    }
  }

  // The total inclusivity level depends on the number of completed themes and the sum of all completed themes' score
  getNiveauTotalInclusivite() {
    let numberThemeCompleted = this.appDataService.getNumberThemeCompleted();
    if (this.totalScore === 0) {
      this.niveauInclusiviteTotal = 0;
    } else if (this.totalScore < 60.4 * numberThemeCompleted) {
      this.niveauInclusiviteTotal = 1;
    } else if (this.totalScore < 91 * numberThemeCompleted) {
      this.niveauInclusiviteTotal = 2;
    } else if (this.totalScore < 111.2 * numberThemeCompleted) {
      this.niveauInclusiviteTotal = 3;
    } else {
      this.niveauInclusiviteTotal = 4;
    }
  }

  // Change the visual characters according to the different themes' score
  changePerson() {
    let scores: number[] = [];
    scores = this.appDataService.getScores();
    this.persos = [
      this.path + this.selectPerson(1, this.getNiveauIncusivite(scores[0])),
      this.path + this.selectPerson(2, this.getNiveauIncusivite(scores[1])),
      this.path + this.selectPerson(3, this.getNiveauIncusivite(scores[2])),
      this.path + this.selectPerson(4, this.getNiveauIncusivite(scores[3]))
    ]
  }

  // Displays the right text according to the inclusivity level
  displayInfo() {
    if (this.appDataService.getLangLocalStorage() === 'FR') {
      this.infos = INFOS_FR;
      this.otherInfos = OTHER_INFOS_FR;
    } else { // Add conditions if there are more languages (default EN)
      this.infos = INFOS_EN;
      this.otherInfos = OTHER_INFOS_EN;
    }
  }

  // Displays the right suggestions according to the inclusivity level
  displaySuggestions() {
    if (this.appDataService.getLangLocalStorage() === 'FR') {
      this.suggestion1 = SUGGESTION1_FR;
      this.suggestion2 = SUGGESTION2_FR;
      this.link1 = LINK1_FR;
      this.link2 = LINK2_FR;
    } else {// Add conditions if there are more languages (default EN)
      this.suggestion1 = SUGGESTION1_EN;
      this.suggestion2 = SUGGESTION2_EN;
      this.link1 = LINK1_EN;
      this.link2 = LINK2_EN;
    }
  }

  displayTotalSuggestion() {
    if (this.themeId === -1) {
      this.getNiveauTotalInclusivite();
      this.niveauInclusivite = this.niveauInclusiviteTotal;
      this.displayInfo()
    }
  }

  // Set the title according to the selected language
  setTitle() {
    switch (this.appDataService.getLangLocalStorage()) {
      case "FR":
        this.title = "Mon management";
        this.isFR = true;
        break;
      case "EN":
        this.title = "My management";
        this.isFR = false;
        break;
      case null:
        if (this.appDataService.getLanguage() === 'FR') {
          this.title = "Mon management";
          this.isFR = true;
        }
        else {
          this.isFR = false;
          this.title = "My management";
        }
        break;
      default:
        break;
    }
  }

  // Return the name of the desired character's picture
  selectPerson(themeId: number, niveau: number): string {
    return "Chara" + themeId + "." + niveau + ".png";
  }

  // Navigates to the next theme
  backHomepage() {
    this.router.navigate(['situation/' + (this.themeId + 1)])
  }

  // Navigates back to the homepage (both methods' name is reversed)
  nextTheme() {
    this.router.navigate(['dashboard']);
  }

  // Verifies if the current theme is the last one so we remove the next theme button
  checkLastTheme() {
    if (this.themeId === 3 || this.themeId === -1) { // --TO CHANGE-- // Change the number '3' to be dynamic according to the number of themes - 1
      this.isNotLastTheme = false;
    }
  }

  // Changes the text in the external links buttons according to the selected language
  changeTextLinkButtons() {
    if (this.appDataService.getLangLocalStorage() === 'FR') {
      this.linkButtonText = "En savoir plus";
    } else if (this.appDataService.getLangLocalStorage() === 'EN') {
      this.linkButtonText = "Find more about";
    }
  }

  blurSelectedCharacter() {
    if (this.themeId === -1) {
      for (let i = 0; i < 4; i++) {
        $("#i" + i).attr('class', 'charaSelected');
      }
    } else {
      $("#i" + this.themeId).attr('class', 'charaSelected');
    }
  }
}

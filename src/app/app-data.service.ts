import { Injectable, Inject, Input, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';

import { Theme } from './theme';
import { QuestionComponent } from './question/question.component';
import { AnswerComponent } from './answer/answer.component'

import * as data from '../assets/quizzQuestion_FR.json';

@Injectable()
export class AppDataService {

  currentTheme: Theme; //Chosen theme by the user
  @Input() themeId: number = 0;
  scores: number[] = [0, 0, 0, 0];

  statementId: number = 0; //ID of the current statement
  //To make the changes of the previous variable common to all components having this service injected
  statementIdChange: Subject<number> = new Subject<number>();

  /**Reads the JSON file according to the navigator language**/
  //Gets the language from the local storage. If there isn't, gets it from the navigatir language
  lang: string = this.getLangLocalStorage() === null ?
    navigator.language.slice(3, 5) === 'EN' ?
      'EN' : 'FR'
    : this.getLangLocalStorage();
  langChange: Subject<string> = new Subject<string>();
  content: typeof data = require('../assets/quizzQuestions_' + this.lang + '.json');

  constructor(
    private localStorage: LocalStorageService,
    private route: Router
  ) { }

  //Returns the current language
  getLanguage(): string {
    return this.lang;
  }

  //Changes the current language and read the Json accordingly
  changeLanguage(lang: string) {
    this.lang = lang;
    this.content = require('../assets/quizzQuestions_' + lang + '.json');
  }

  //Converts the JSON data into a TypeScript Object and returns the selected theme
  getTheme(): Observable<Theme> {
    this.currentTheme = new Theme().deserialize((<any>this.content).themes[this.themeId]);
    return of(this.currentTheme);
  }

  // --TO CHANGE-- //
  // Returns a list with all themes' title & description 
  getThemesInfos(): {
    title: string,
    description: string
  }[] {
    let themesList: {
      title: string,
      description: string
    }[] = [];
    (<any>this.content).themes.forEach(element => {
      themesList.push({ title: element.title, description: element.description });
    });
    return themesList;
  }

  // Returns the current theme
  getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  // Edit the the current theme to update its statement's values with given values
  setAnswersValue(statementId: number, values: number[]) {
    for (let i = 0; i < this.currentTheme.statements[statementId].answers.length; i++) {
      this.currentTheme.statements[statementId].answers[i].value = values[i];
    }
  }

  // Increments the statement's id & store answer in the local storage
  nextStatement(): boolean {
    // We check if it isn't the last question
    if (this.statementId < this.currentTheme.statements.length - 1) {

      // We get the theme stored in the local storage
      let tempTheme: Theme;
      this.getLocalStorage(this.themeId)
        .subscribe(theme => tempTheme = theme);

      // We check if there is one
      if (tempTheme !== null) {
        // If there is one, we update what we've stored
        tempTheme.statements[this.statementId] = this.currentTheme.statements[this.statementId];
        // and we re-store it
        this.setLocalStorage(this.themeId, tempTheme);
      } else {
        // If there isn't, we store the current theme
        this.setLocalStorage(this.themeId, this.currentTheme);
      }

      this.statementId++;
      this.statementIdChange.next(this.statementId); //Applies the changes to other components

      window.scrollTo(0, 0);
      return true;
    }
    else {
      // If it was the last question
      // We do the same than above
      let tempTheme: Theme;

      this.getLocalStorage(this.themeId)
        .subscribe(theme => tempTheme = theme);
      if (tempTheme !== null) {
        tempTheme.statements[this.statementId] = this.currentTheme.statements[this.statementId];
        this.setLocalStorage(this.themeId, tempTheme);
      } else {
        this.setLocalStorage(this.themeId, this.currentTheme);
      }
      this.setThemeFinished(true);
      // and we navigate to the result page
      this.route.navigate(['suggestion/' + this.themeId]);
      return false;
    }
  }

  //Decrements the statement's id
  prevStatement(): boolean {
    if (this.statementId > 0) {
      this.statementId--;
      this.statementIdChange.next(this.statementId);
      window.scrollTo(0, 0);
      return true;
    }
    else {
      this.route.navigate(['situation/' + this.themeId]);
      return false;
    }
  }

  // Returns the current question ID
  getStatementId(): number {
    return this.statementId;
  }

  // Returns the current theme ID
  getThemeId(): number {
    return this.themeId;
  }

  // Change the current theme ID
  setThemeId(themeId: number): void {
    this.themeId = themeId;
    this.getTheme().subscribe(); // Read from Json
    this.statementId = 0; // Get back to the first question
    this.statementIdChange.next(this.statementId);
  }

  /*
   * Local Storage functions
   */

  // Stores the given theme in the local storage
  setLocalStorage(themeId: number, theme: Theme) {
    if (this.hasStorage) {
      this.localStorage.store(themeId.toString(), theme);
    } else
      alert("No local storage found. Progression won't be saved");
  }

  // Edits a stored theme when the theme is completed
  setThemeFinished(isFinished: boolean) {
    this.getLocalStorage(this.themeId)
      .subscribe(theme => {
        if (theme !== null) {
          theme.isFinished = isFinished;
          this.setLocalStorage(this.themeId, theme);
        }
      });
  }

  // Returns true if the theme is completed, false if not
  getThemeFinished(themeId: number): boolean {
    let isFinished: boolean = false;
    this.getLocalStorage(themeId)
      .subscribe(theme => {
        if (theme)
          isFinished = theme.isFinished;
      });
    return isFinished;
  }

  // Returns an Observable of the stored theme
  getLocalStorage(themeId: number): Observable<Theme> {
    if (this.hasStorage()) {
      return of(this.localStorage.retrieve(themeId.toString()));
    } else
      return of(null);
  }

  // Deletes a stored theme
  delLocalStorage(themeId: number) {
    if (this.hasStorage)
      this.localStorage.clear(themeId.toString());
    else
      alert("No local storage found");
  }

  // Returns the number of completed themes
  getNumberThemeCompleted(): number {
    let cptr: number = 0;
    for (let i = 0; i < 4; i++) { // --TO CHANGE -- // Change the '4' (number of themes) so it becomes dynamic
      this.getLocalStorage(i)
        .subscribe(theme => {
          if (theme && theme.isFinished) {
            cptr++;
          }
        });
    }
    return cptr;
  }

  // Verifies if the navigator's local storage works
  hasStorage(): boolean {
    try {
      this.localStorage.store("test", "t");
      this.localStorage.clear("test");
      return true;
    } catch (exception) {
      return false;
    }
  }

  // Calculates the theme's score
  getThemeScore(themeId: number): number {
    let total: number = 0.0;
    this.getLocalStorage(themeId)
      .subscribe(theme => {
        if (theme && theme.isFinished) {
          for (let i = 0; i < theme.statements.length; i++) {
            for (let j = 0; j < theme.statements[i].answers.length; j++) {
              total +=
                (theme.statements[i].answers[j].value / 100.0) *
                theme.statements[i].answers[j].weight;
            }
          }
        }
      });
    return total;
  }

  // Calculates the total score of all themes
  getScoreTotal(): number {
    for (let i = 0; i < 4; i++) { // --TO CHANGE -- // Change the '4' (number of themes) so it becomes dynamic
      this.scores[i] = this.getThemeScore(i);
    }
    return this.scores.reduce(function (acc, val) { return acc + val; }); // Returns the sum of all array's values
  }

  // Returns the array of theme's scores
  getScores(): number[] {
    return this.scores;
  }

  // Stores in the local storage the selected language
  setLangLocalStorage(lang: string) {
    if (this.hasStorage) {
      this.localStorage.store("lang", lang);
    } else
      alert("No local storage found.");
  }

  // Returns from the local storage the selected language
  getLangLocalStorage(): string {
    if (this.hasStorage) {
      return this.localStorage.retrieve("lang");
    } else {
      return null;
    }
  }
}

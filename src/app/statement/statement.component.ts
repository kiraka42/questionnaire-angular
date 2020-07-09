/*
 * STATEMENT COMPONENT
 * 
 * Contains :
 *       - x answers
 *       - x sliders
 *       - x checkboxes
 *       - prev/next buttons
 * 
 * /statement/:id
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

import { QuestionComponent } from '../question/question.component';
import { AnswerComponent } from '../answer/answer.component';
import { AppDataService } from '../app-data.service';
import { Theme } from '../theme';

import "ion-rangeslider";

@Component({
  selector: 'app-statement',
  templateUrl: './statement.component.html',
  styleUrls: ['./statement.component.css']
})
export class StatementComponent implements OnInit {

  statementId: number = 0;
  themeId: number;

  numberOfAnswers: number = 0;

  sliders: any[] = []; // Array of sliders element
  value: number[] = []; // Values of each slider
  numberOfDisabledSliders: number = 0;
  sliderToChangeId: number = 0;
  valueBeforeClick: number[] = []; // Initial values (updated when the user releases a slider)
  isSliding: boolean = false; // To counter the simple click on the slider's cursor
  delta: number;
  isLocked: boolean[] = [];
  total: number = 0; // Sum of all sliders value
  max_value: number = 100;
  min_value: number = 0;
  isFR: boolean; // To adapt the buttons' text

  constructor(
    private appDataService: AppDataService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {
  }

  ngOnInit() {

    this.getNumberOfAnswers();
    this.themeId = +this.route.snapshot.paramMap.get('id');
    this.checkId(this.themeId);
    this.appDataService.setThemeId(this.themeId);

    // Check the selected language
    this.appDataService.getLangLocalStorage ?
      this.appDataService.getLangLocalStorage() === 'FR' ? this.isFR = true : this.isFR = false
      : this.isFR = this.appDataService.getLanguage() === 'FR';

    // This method is called each time the appDataService's statementId variable is updated
    this.appDataService.statementIdChange.subscribe((value) => {
      this.statementId = value; // We update it with the recovered value
      this.resetSliders();
      this.getNumberOfAnswers();
      this.createSliders();
    });

    this.createSliders();
  }

  checkId(id: any) {
    if (id < 0 || id > 4 || isNaN(id)){
      this.themeId = 0; //remove console error
      this.router.navigate(['/dashboard']);
    }
  }

  // Returns the value of the slider selected by its ID
  getValue(index: number): number {
    return $("#" + index).data("from");
  }

  // Sets the number of answers from the current theme and the statement ID
  getNumberOfAnswers(): void {
    this.numberOfAnswers = this.appDataService.getCurrentTheme().statements[this.statementId].answers.length;
  }

  //Next question 
  nextStatement(): void {
    this.appDataService.nextStatement();
  }

  //Previous question
  prevStatement(): void {
    this.appDataService.prevStatement();
  }

  // Loads sliders value from local storage
  getSavedAnswer(): number[] {
    let currentTheme: Theme;
    this.appDataService.getLocalStorage(this.appDataService.getThemeId())
      .subscribe(theme => currentTheme = theme);
    let sum: number = 0;
    if (currentTheme !== null) {
      // Calculates the total of the values of the current statement (they are initiated to 0)
      for (let i = 0; i < this.numberOfAnswers; i++) {
        sum += currentTheme.statements[this.statementId].answers[i].value
      }
    }

    // Checks if the sum is 0 (< 100)
    if (currentTheme === null || sum < 100) {
      return this.equilibrate(this.numberOfAnswers); // Means that there is no values stored so we equilibrate
    } else { // If there are values stored
      let values: number[] = [];
      for (let i = 0; i < this.numberOfAnswers; i++) { // We get them
        values.push(currentTheme.statements[this.statementId].answers[i].value);
      }
      return values;
    }

  }

  /* *****************
   * 
   * Slider methods 
   * 
   * ****************/

  // Method to create a slider using the ion.RangeSlider plugin
  // http://ionden.com/a/plugins/ion.rangeSlider/en.html
  createSliders() {
    this.valueBeforeClick = this.getSavedAnswer(); // --TO CHANGE-- // Same use of variable
    this.value = this.getSavedAnswer(); // --TO CHANGE-- // Same use of variable
    for (let i = 0; i < this.numberOfAnswers; i++) { // Create sliders according to the number of answers
      this.isLocked.push(false); // Initially the slider is unlocked
      this.sliders.push($("#" + i)); // --TO VERIFY-- // Not sure if the sliders array is pertinent
      let that = this;
      setTimeout(() => { // Need to time out 0 the call to the plugin. If not, the slider is not rendered
        (<any>$("#" + i)).ionRangeSlider({ // Converts the inputs to sliders
          grid: true,
          min: "0",
          step: 5,
          from: that.valueBeforeClick[i],
          hide_from_to: true,
          hide_min_max: true,
          onChange: function (data) { // Callback called when a change is detected on the slider
            if (that.isSliding) { // Cancels the first call to the callback because a simple click on the cursor calls it
              that.value[i] = data.from; // Updates the value
              that.delta = that.valueBeforeClick[i] - data.from; // Calculates the direction of the moving cursor
              if (that.sliderToChange(that.sliders, i) && that.delta !== 0) { // If it's moving and another slider is movable
                let slider = $("#" + that.sliderToChangeId).data("ionRangeSlider"); // Select the slider to update
                slider.update({ // Updates it
                  from: $("#" + that.sliderToChangeId).data("from") + that.delta
                });
                that.calculateTotal();
                that.valueBeforeClick[i] = data.from; // Updates the array of values
              }
            } else {
              that.isSliding = true;
            }
          },
          onStart: function (data) { // Callback called when the slider is rendered
            let values: number[] = [];
            for (let i = 0; i < that.numberOfAnswers; i++) { // Gets the initial values // --TO CHECK-- // Maybe useless
              values.push($("#" + i).data("from"));
            }
            // Edit the the current theme to update its statement's values with given values
            that.appDataService.setAnswersValue(that.statementId, values);
          },
          onFinish: function (data) { // Callback called when the user releases the slider's cursor 
            that.calculateTotal();
            that.isSliding = false;

            // Little (temporary) hack to prevent a problem with moving the sliders too fast
            // Problem : When a slider is moved too fast, the total can be superior to 100
            // So when the user releases the slider, we adjust the released slider to make the total = 100
            if (that.total > 100) {
              let slider = $("#" + i).data("ionRangeSlider");
              slider.update({
                from: data.from - (that.total - 100)
              });
              that.calculateTotal();
            } else if (that.total > 100) {
              let slider = $("#" + i).data("ionRangeSlider");
              slider.update({
                from: data.from + (that.total - 100)
              });
              that.calculateTotal();
            }

            let values: number[] = [];
            for (let i = 0; i < that.numberOfAnswers; i++) { // Updates the array of the values
              values.push($("#" + i).data("from"));
            }
            // Edit the the current theme to update its statement's values with given values
            that.appDataService.setAnswersValue(that.statementId, values);
          },
          onUpdate: function (data) { // Callback called when a slider is updated
            that.value[i] = data.from;
            that.valueBeforeClick[i] = data.from;
          }
        });
      }, 0);
    }
  }

  // Sets the defaults values of all sliders according to the number of answers
  equilibrate(quantity: number): number[] {
    let values: number[] = [];
    for (let i = 0; i < quantity; i++) {
      values.push(0);
    }
    for (let i = 0; i < 100; i++) {
      values[i % quantity]++;
    }
    return values;
  }

  // Defines which slider will be updated next when a slider is moved
  sliderToChange(sliders: any, i: number): boolean {
    if (this.numberOfDisabledSliders === this.numberOfAnswers - 1) { // If all sliders except one are locked, we don't update any slider
      return false;
    }
    // For each call, we select the next slider in the classic order
    // We keep looping until :
    //    - the slider is not locked
    //    - the slider is not the one being moved
    //    - the slider has not reached one of both extremities (according to delta value)
    do {
      this.sliderToChangeId = (this.sliderToChangeId + 1) % this.numberOfAnswers;
      //this.adjustSlidersValue(this.sliderToChangeId);
    } while ($("#" + this.sliderToChangeId).data("ionRangeSlider").input.disabled === true || this.sliderToChangeId === i
    || (this.valueBeforeClick[this.sliderToChangeId] === 0 && this.delta < 0)
      || (this.valueBeforeClick[this.sliderToChangeId] === 100 && this.delta > 0))
    return true;
  }

  // Calculates the sum of all sliders' value
  calculateTotal() {
    this.total = 0;
    for (let i = 0; i < this.numberOfAnswers; i++) {
      this.total += $("#" + i).data("from");
    }
  }

  // Reset all sliders
  resetSliders() {
    for (let i = 0; i < this.numberOfAnswers; i++) {
      $("#" + i).remove();
    }
    this.numberOfDisabledSliders = 0;
    this.delta = 0;
    this.isSliding = false;
    this.isLocked = [];
    this.value = [];
    this.sliders = [];
  }

  // Called when the user enables/disables a checkbox
  lockChecked(sliderId: number) {

    this.isLocked[sliderId] = !this.isLocked[sliderId];
    let slider = $("#" + sliderId).data("ionRangeSlider"); // Selects the slider
    slider.update({
      disable: this.isLocked[sliderId] // Disables it
    })

    if (this.countDisabledSliders() === this.numberOfAnswers - 1) { // If all sliders are disabled but one
      for (let i = 0; i < this.numberOfAnswers; i++) { // We loop to find which one is not disabled
        if ($("#" + i).data("ionRangeSlider").input.disabled === false) {
          let slider = $("#" + i).data("ionRangeSlider"); // We select it
          slider.update({
            from_fixed: true // We fix it's cursor so it can't be moved
          })
        }
      }
    } else if (this.countDisabledSliders() < this.numberOfAnswers - 1) { // If there is at least two sliders enabled
      for (let i = 0; i < this.numberOfAnswers; i++) {
        let slider = $("#" + i).data("ionRangeSlider");
        slider.update({
          from_fixed: false // We unfix all all sliders
        })
      }
    }

    // If a slider is disabled, the other sliders have their max value updated
    // The new max value is the sum of the value of the remained sliders
    this.max_value = 0;
    for (let i = 0; i < this.numberOfAnswers; i++) {
      if (!$("#" + i).data("ionRangeSlider").input.disabled) {
        this.max_value += $("#" + i).data("from");
      }
    }
    // We applie the new max value on all enabled sliders
    for (let i = 0; i < this.numberOfAnswers; i++) {
      let slider = $("#" + i).data("ionRangeSlider");
      if (!slider.input.disabled) {
        slider.update({
          from_max: this.max_value
        })
      }
    }
  }

  // Returns the number of disabled sliders
  countDisabledSliders(): number {
    let numLocked: number = 0;
    for (let i = 0; i < this.numberOfAnswers; i++) {
      if ($("#" + i).data("ionRangeSlider").input.disabled === true) {
        numLocked++;
      }
    }
    return numLocked;
  }

  //////// Amélioration de l'algo pour préserver le total des sliders à 100 ///////

  /*adjustSlidersValue(sliderId: number) {
    this.calculateTotal();
    if (this.total > 100) {
      //let overflow = this.total - 100;
      let slider = $("#" + sliderId).data("ionRangeSlider");
      slider.update({
        from:  $("#" + sliderId).data("from") - 5 //overflow
      });
    }else if (this.total > 100) {
      let slider = $("#" + sliderId).data("ionRangeSlider");
      slider.update({
        from: $("#" + sliderId).data("from") + 5
      });
    }
  }*/
}

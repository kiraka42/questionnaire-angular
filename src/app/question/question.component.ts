/*
 *           QUESTION COMPONENT
 * Component which displays the question
 * /statement/:id 
 */

import { Component, OnInit } from '@angular/core';
import { AppDataService } from '../app-data.service';

import { Theme } from '../theme';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  currentQuestion: string;
  statementId: number = 0;


  constructor(private appDataService: AppDataService) { }

  ngOnInit() {
    this.getCurrentQuestion();

    // Subscribe the questionId to the statementId of the app-data service
    // This method is called each time the statement id is updated
    this.appDataService.statementIdChange.subscribe((value) => {
      this.statementId = value;
      this.getCurrentQuestion();
    });

  }

  // Gets the current question to be displayed
  getCurrentQuestion(): void {
     this.currentQuestion = this.appDataService.getCurrentTheme().statements[this.statementId].question;
  }
}

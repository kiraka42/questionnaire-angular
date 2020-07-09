/*
 *  ANSWER COMPONENT
 * Displays one answer
 * /statement/:id 
 */

import { Component, OnInit, Input } from '@angular/core';
import { AppDataService } from '../app-data.service';

import { Theme } from '../theme';
import { Answer } from '../answer';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css']
})
export class AnswerComponent implements OnInit {

  currentAnswer: Answer;
  statementId: number = 0;
  @Input()
  answerId: number = 0;

  constructor(private appDataService: AppDataService) { }

  ngOnInit() {
    this.getStatementId();
    this.getCurrentAnswers();
    
    // Subscribe the answersId to the statementId of the app-data service
    // This method is called each time the statement id is updated
    this.appDataService.statementIdChange.subscribe((value) => {
      this.statementId = value;
      this.getCurrentAnswers();
    });
  }

  // Gets the current answers to be displayed
  getCurrentAnswers(): void {
    this.currentAnswer =
      this.appDataService.getCurrentTheme().statements[this.statementId].answers[this.answerId];
  }

  // Gets the current statement id
  getStatementId(): void {
    this.statementId = this.appDataService.getStatementId();
  }

}

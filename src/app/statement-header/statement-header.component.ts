/*
 *     STATEMENT HEADER COMPONENT
 * 
 * Header in the statements' page
 * Contains :
 *      - The name of the current theme
 *      - The progression bar
 *      - The title of the question
 * 
 * /statement/:id
 */

import { Component, OnInit } from '@angular/core';
import { AppDataService } from '../app-data.service';

@Component({
  selector: 'app-statement-header',
  templateUrl: './statement-header.component.html',
  styleUrls: ['./statement-header.component.css']
})
export class StatementHeaderComponent implements OnInit {

  statementId: number = 0;
  leftWidth: string;
  id: number;

  constructor(private appDataService: AppDataService) { }

  ngOnInit() {
    /// Progression bar
    // Changes the width of the green div according to the statement's ID
    this.leftWidth = (100 / 4) * (this.statementId + 1) + '%';
    this.appDataService.statementIdChange.subscribe((value) => {
      this.statementId = value;
      this.leftWidth = (100 / 4) * (this.statementId + 1) + '%';
    });
    this.id = this.appDataService.getThemeId() + 1;
  }

}

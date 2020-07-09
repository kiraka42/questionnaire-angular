import { Component, OnInit } from '@angular/core';

import { P1_EN, P1_EN_bold, P2_EN, P3_EN, P4_EN } from '../mock_introduction_texts'
import { P1_FR, P1_FR_bold, P2_FR, P3_FR, P4_FR } from '../mock_introduction_texts'
import { TITLE1_EN, TITLE2_EN, TITLE3_EN } from '../mock_introduction_texts'
import { TITLE1_FR, TITLE2_FR, TITLE3_FR } from '../mock_introduction_texts'

import { AppDataService } from '../app-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css']
})
export class IntroductionComponent implements OnInit {

  lang: string;
  FALSE: boolean = false;

  paragraphs: string[][];
  titles: string[];

  constructor(
    private appDataService: AppDataService,
    private router: Router
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.lang = this.appDataService.getLangLocalStorage();
    this.setText();

    this.appDataService.langChange.subscribe((value) => {
      this.lang = value;
      this.setText();
    });
  }

  setText() {
    this.paragraphs = [];
    this.titles = [];
     
    if (this.lang === 'FR') {
      this.paragraphs.push(P1_FR);
      this.paragraphs.push(P1_FR_bold);
      this.paragraphs.push(P2_FR);
      this.paragraphs.push(P3_FR);
      this.paragraphs.push(P4_FR);

      this.titles.push(TITLE1_FR);
      this.titles.push(TITLE2_FR);
      this.titles.push(TITLE3_FR);
    } else {
      this.paragraphs.push(P1_EN);
      this.paragraphs.push(P1_EN_bold);
      this.paragraphs.push(P2_EN);
      this.paragraphs.push(P3_EN);
      this.paragraphs.push(P4_EN);

      this.titles.push(TITLE1_EN);
      this.titles.push(TITLE2_EN);
      this.titles.push(TITLE3_EN);
    }
  }

  situationPage() {
    this.router.navigate(['/dashboard']);
  }
}

/**
 *  NOT USED COMPONENT
 */

import { Component, OnInit } from '@angular/core';
import { AppDataService } from '../app-data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-result-page',
  templateUrl: './result-page.component.html',
  styleUrls: ['./result-page.component.css']
})
export class ResultPageComponent implements OnInit {

  themeId: number;
  themeScore: number;
  niveauInclusivite: number;

  constructor(
    private appDataService: AppDataService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.themeId = +this.route.snapshot.paramMap.get('id');
    this.themeScore = this.appDataService.getThemeScore(this.themeId);
    this.getNiveauIncusivite();
  }

  getNiveauIncusivite() {
    if (this.themeScore < 60.4) {
      this.niveauInclusivite = 1;
    } else if (this.themeScore < 91) {
      this.niveauInclusivite = 2;
    } else if (this.themeScore < 111.2) {
      this.niveauInclusivite = 3;
    } else {
      this.niveauInclusivite = 4;
    }
  }
}

import { Component } from '@angular/core';
import { AppDataService } from './app-data.service'

import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Location, PopStateEvent } from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];

  constructor(
    private appDataService: AppDataService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    // Serialize the Json file at application start
    this.appDataService.getTheme()
      .subscribe();

    // Scroll top when navigating back and forth
    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });
    this.router.events.subscribe((ev: any) => {
      if (ev instanceof NavigationStart) {
        $(".cuppa-menu-overlay").remove()
        if (ev.url != this.lastPoppedUrl)
          this.yScrollStack.push(window.scrollY);
      } else if (ev instanceof NavigationEnd) {
        if (ev.url == this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
          window.scrollTo(0, this.yScrollStack.pop());
        } else
          window.scrollTo(0, 0);
      }
    });
  }
}

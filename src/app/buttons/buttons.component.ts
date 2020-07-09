/*
 *                BUTTONS COMPONENT
 * One or two button with customable texts and events
 * /situation/:id 
 * /statement/:id
 * /suggestion/:id
 */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.css']
})
export class ButtonsComponent implements OnInit {

  @Input() 
  leftButton: string = "";
  @Input() 
  rightButton: string = "";
  @Output()
  next: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  prev: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  isDuo: boolean;
  @Input()
  isLeft: boolean;
  @Input()
  isRight: boolean;

  constructor() { }

  ngOnInit() {
  }
}

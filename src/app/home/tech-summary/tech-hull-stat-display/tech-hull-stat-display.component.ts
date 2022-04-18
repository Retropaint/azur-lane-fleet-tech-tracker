import { Component, Input, OnInit } from '@angular/core';
import { HoverTitlesService } from 'src/app/services/hover-titles.service';

@Component({
  selector: 'app-tech-hull-stat-display',
  templateUrl: './tech-hull-stat-display.component.html',
  styleUrls: ['./tech-hull-stat-display.component.scss', '../../home.page.scss'],
})
export class TechHullStatDisplayComponent implements OnInit {

  objectKeys = Object.keys;

  @Input() statsObject: any;
  @Input() anchor: string = "center"; // left, center, right
  @Input() isLastTech: boolean = false;
  @Input() emptyMsg: string;

  constructor(public hoverTitles: HoverTitlesService) { }

  ngOnInit() {
  }

}

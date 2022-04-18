import { Component, Input, OnInit } from '@angular/core';
import { HoverTitlesService } from 'src/app/services/hover-titles.service';

@Component({
  selector: 'app-hull-icon',
  templateUrl: './hull-icon.component.html',
  styleUrls: ['./hull-icon.component.scss'],
})
export class HullIconComponent implements OnInit {

  @Input() hull: string;
  @Input() width: number = 35;

  constructor(public hoverTitle: HoverTitlesService) { }

  ngOnInit() {
  }
}

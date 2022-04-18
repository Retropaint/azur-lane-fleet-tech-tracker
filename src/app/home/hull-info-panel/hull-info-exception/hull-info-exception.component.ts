import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hull-info-exception',
  templateUrl: './hull-info-exception.component.html',
  styleUrls: ['./hull-info-exception.component.scss', '../hull-info-panel.component.scss', '../../home.page.scss'],
})
export class HullInfoExceptionComponent implements OnInit {

  @Input() name: string;
  @Input() hull: string;
  @Input() isLast: boolean = false;

  constructor() { }

  ngOnInit() {}

}

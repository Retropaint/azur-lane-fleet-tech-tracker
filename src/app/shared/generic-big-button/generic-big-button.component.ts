import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-generic-big-button',
  templateUrl: './generic-big-button.component.html',
  styleUrls: ['./generic-big-button.component.scss', '../../home/home.page.scss'],
})
export class GenericBigButtonComponent {

  @Input() text: string;
  @Input() toggle: string = "unselected";
  @Input() extraCSS: string = "";

  constructor() { }

}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-toggle-flag',
  templateUrl: './toggle-flag.component.html',
  styleUrls: ['./toggle-flag.component.scss'],
})
export class ToggleFlagComponent implements OnInit {

  @Input() toggle: boolean = false;

  constructor() { }

  ngOnInit() {}

}

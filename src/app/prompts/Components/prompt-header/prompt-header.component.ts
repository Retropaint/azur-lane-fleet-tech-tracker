import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-prompt-header',
  templateUrl: './prompt-header.component.html',
  styleUrls: ['./prompt-header.component.scss'],
})
export class PromptHeaderComponent implements OnInit {

  @Input() header: string;
  @Input() component: any;

  constructor() { }

  ngOnInit() {}

  exit() {
    this.component.exit();
  }
}

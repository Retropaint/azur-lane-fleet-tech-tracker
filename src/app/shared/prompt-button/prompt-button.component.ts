import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-prompt-button',
  templateUrl: './prompt-button.component.html',
  styleUrls: ['./prompt-button.component.scss'],
})
export class PromptButtonComponent implements OnInit {

  @Input() text: string;
  @Input() color: string;
  @Input() extraCSS: string;

  constructor() { }

  ngOnInit() {}

}

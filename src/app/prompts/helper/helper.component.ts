import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PromptService } from 'src/app/services/prompt.service';

@Component({
  selector: 'app-helper',
  templateUrl: './helper.component.html',
  styleUrls: ['./helper.component.scss'],
})
export class HelperComponent implements OnInit {

  @Input() type: string;
  title: string;

  constructor(private prompt: PromptService, private modalController: ModalController) { }

  ngOnInit() {
    switch(this.type) {
      case "sort":
        this.prompt.init(300);
        this.title = "SORT";
      break; case "filter":
        this.prompt.init(325);
        this.title = "FILTER";
      break; case "icon-ui":
        this.prompt.init(300);
        this.title = "ICON UI";
      break; case "sheet-ui":
        this.title = "SHEET UI";
        this.prompt.init(325);
      break;
    }
  }

  exit() {
    this.modalController.dismiss();
  }

  ngOnDestroy() {
    this.prompt.exit();
  }
}

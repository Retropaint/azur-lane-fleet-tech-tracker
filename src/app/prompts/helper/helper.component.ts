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

  constructor(private prompt: PromptService, private modalController: ModalController) { }

  ngOnInit() {
    switch(this.type) {
      case "sort":
        this.prompt.init(300);
      break; case "filter":
        this.prompt.init(325);
      break; case "icon-ui":
        this.prompt.init(300);
      break; case "sheet-ui":
        this.prompt.init(300);
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

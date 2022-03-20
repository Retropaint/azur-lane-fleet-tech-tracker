import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { HelperComponent } from 'src/app/prompts/helper/helper.component';
import { HomePage } from '../home.page';

@Component({
  selector: 'app-help-button',
  templateUrl: './help-button.component.html',
  styleUrls: ['./help-button.component.scss'],
})
export class HelpButtonComponent implements OnInit {

  @Input() helpType: string;

  constructor(private modalController: ModalController, private storage: Storage, public home: HomePage) {}

  ngOnInit() {}

  async openHelper() {
    const modal = await this.modalController.create({
      component: HelperComponent,
      animated: false,
      componentProps: {
        "type": this.helpType
      }
    })
    modal.present();
  }
}

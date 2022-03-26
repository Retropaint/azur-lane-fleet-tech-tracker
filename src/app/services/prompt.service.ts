import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ConfirmationComponent } from '../prompts/confirmation/confirmation.component';

@Injectable({
  providedIn: 'root'
})
export class PromptService {

  constructor(private modalController: ModalController) { }

  init(promptHeight: number) {
    let modalIndex = 0;
    while(document.getElementById('ion-overlay-' + modalIndex) == null) {
      modalIndex++;
    }
    document.getElementById('ion-overlay-' + modalIndex).shadowRoot.children[0].setAttribute('style', 'cursor: default');
    this.changeHeight(promptHeight);
    document.documentElement.style.setProperty('--background-blur', '10px');
    return modalIndex;
  }

  exit() {
    document.documentElement.style.setProperty('--background-blur', '0px');
  }

  changeHeight(height: number) {
    document.documentElement.style.setProperty('--prompt-height', height + "px");
  }

  async openConfirmation(modalIndex: number, title: string, body: string) {
    const prevHeight = document.documentElement.style.getPropertyValue("--prompt-height");
    document.getElementById('ion-overlay-' + modalIndex).setAttribute('style', 'display: none');
    const modal = await this.modalController.create({
      component: ConfirmationComponent,
      animated: false,
      backdropDismiss: false, // closing from backdrop closes editor as well
      componentProps: {
        "title": title,
        "body": body
      }
    })
    await modal.present();
    return await modal.onDidDismiss().then(async value => {
      document.documentElement.style.setProperty('--prompt-height', prevHeight);
      document.getElementById('ion-overlay-' + modalIndex).setAttribute('style', '');
      return await value.data;
    })
  }
}

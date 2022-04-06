import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ConfirmationComponent } from '../prompts/confirmation/confirmation.component';

@Injectable({
  providedIn: 'root'
})
export class PromptService {

  constructor(private modalController: ModalController) { }

  init(promptHeight: number, addExtraHeight: boolean = false) {
    // get modal index, and prevent backdrop from setting cursor to pointer
    let modalIndex = 0;
    while(document.getElementById('ion-overlay-' + modalIndex) == null) {
      modalIndex++;
    }
    document.getElementById('ion-overlay-' + modalIndex).shadowRoot.children[0].setAttribute('style', 'cursor: default');

    // extra height accounts for the prompt's own top and bottom 
    if(addExtraHeight) {
      this.changeHeight(promptHeight + 60 + 130);
    } else {
      this.changeHeight(promptHeight);
    }
    
    document.documentElement.style.setProperty('--background-blur', '10px');
    return modalIndex;
  }

  async openConfirmation(modalIndex: number, title: string, body: string, wasFromModal: boolean = true) {
    // remember what the initial prompt's height is
    const prevHeight = document.documentElement.style.getPropertyValue("--prompt-height");
    
    if(wasFromModal) {
      // make initial prompt invisible
      document.getElementById('ion-overlay-' + modalIndex).setAttribute('style', 'display: none');
    }
    
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
      // set universal height to now be the prompt that initally opened
      document.documentElement.style.setProperty('--prompt-height', prevHeight);

      if(wasFromModal) {
        // make initial prompt visible again
        document.getElementById('ion-overlay-' + modalIndex).setAttribute('style', '');
      } else {
        this.exit();
      }
      return await value.data;
    })
  }

  // works similar to openConfirmation(), but with even less stuff
  async openAnotherPrompt(modalIndex: number, promptComponent: any) {
    const prevHeight = document.documentElement.style.getPropertyValue("--prompt-height");
    document.getElementById('ion-overlay-' + modalIndex).setAttribute('style', 'display: none');
    
    const modal = await this.modalController.create({
      component: promptComponent,
      animated: false,
      backdropDismiss: false
    })
    
    await modal.present();
    
    return await modal.onDidDismiss().then(async value => {
      document.documentElement.style.setProperty('--prompt-height', prevHeight);
      document.getElementById('ion-overlay-' + modalIndex).setAttribute('style', '');

      return await value.data;
    })
  }

  changeHeight(height: number) {
    document.documentElement.style.setProperty('--prompt-height', height + "px");
  }

  exit() {
    document.documentElement.style.setProperty('--background-blur', '0px');
  }
}

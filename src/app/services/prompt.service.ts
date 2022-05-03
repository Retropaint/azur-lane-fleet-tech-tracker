import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { ConfirmationComponent } from '../prompts/confirmation/confirmation.component';
import { MiscService } from './misc.service';

@Injectable({
  providedIn: 'root'
})
export class PromptService {

  constructor(private modalController: ModalController, private misc: MiscService) { }

  init(promptHeight: number, addConstantHeight: boolean = false, forceIndexAtOne: boolean = false) {
    // get modal index, and prevent backdrop from setting cursor to pointer
    let modalIndex = 0;
    
    // mobile seems to be screwing things up constantly, sometimes I need this, sometimes I don't
    if(this.misc.isMobile && !forceIndexAtOne) {
      modalIndex = 1;
    }

    while(document.getElementById('ion-overlay-' + modalIndex) == null) {
      modalIndex++;
    }
    document.getElementById('ion-overlay-' + modalIndex).shadowRoot.children[0].setAttribute('style', 'cursor: default');

    // extra height accounts for the prompt's own top and bottom 
    if(addConstantHeight) {
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
    
    modal.present();
    
    return modal.onDidDismiss().then(async value => {
      // set universal height to now be the prompt that initally opened
      document.documentElement.style.setProperty('--prompt-height', prevHeight);

      if(wasFromModal) {
        // make initial prompt visible again
        document.getElementById('ion-overlay-' + modalIndex).setAttribute('style', '');
      } else {
        this.exit();
      }
      return value.data;
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
    
    modal.present();
    
    return modal.onDidDismiss().then(async value => {
      document.documentElement.style.setProperty('--prompt-height', prevHeight);
      document.getElementById('ion-overlay-' + modalIndex).setAttribute('style', '');
      return value.data;
    })
  }

  changeHeight(height: number) {
    document.documentElement.style.setProperty('--prompt-height', height + "px");
  }

  exit() {
    document.documentElement.style.setProperty('--background-blur', '0px');
  }

  async openPrompt(component: any) {
    const modal = await this.modalController.create({
      component: component,
      animated: false
    })
    modal.present();
  }
}

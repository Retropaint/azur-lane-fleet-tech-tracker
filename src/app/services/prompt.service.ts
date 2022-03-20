import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PromptService {

  constructor() { }

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
}

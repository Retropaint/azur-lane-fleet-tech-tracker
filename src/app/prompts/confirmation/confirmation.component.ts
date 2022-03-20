import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements AfterViewInit {

  @Input() title: string;
  @Input() body: string;

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  ngAfterViewInit() {
    document.documentElement.style.setProperty('--prompt-height', "280px");
  }

  async chose(isYes: boolean) {
    this.modalController.dismiss(isYes);
  }
}

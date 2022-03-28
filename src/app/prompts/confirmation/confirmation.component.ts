import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PromptService } from 'src/app/services/prompt.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements AfterViewInit {

  @Input() title: string;
  @Input() body: string;
  @ViewChild('autoResize') autoResize: ElementRef;

  constructor(private modalController: ModalController, private prompt: PromptService) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.prompt.init(this.autoResize.nativeElement.getBoundingClientRect().height + 30, true);
  }

  exit() {
    this.chose(false);
  }

  async chose(isYes: boolean) {
    this.modalController.dismiss(isYes);
  }
}

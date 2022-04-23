import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PromptService } from 'src/app/services/prompt.service';

@Component({
  selector: 'app-mobile-warning',
  templateUrl: './mobile-warning.component.html',
  styleUrls: ['./mobile-warning.component.scss'],
})
export class MobileWarningComponent implements AfterViewInit {

  @ViewChild('autoResize') autoResize: ElementRef;

  constructor(
    private prompt: PromptService,
    private modalController: ModalController
  ) { }

  ngAfterViewInit() {
    console.log("what")
    this.prompt.init(this.autoResize.nativeElement.getBoundingClientRect().height, true, true);
  }

  exit() {
    this.modalController.dismiss();
  }

  ngOnDestroy() {
    this.prompt.exit();
  }

}

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PromptService } from 'src/app/services/prompt.service';
import { Url } from 'url';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss'],
})
export class CreditsComponent implements OnInit, AfterViewInit {

  @ViewChild('autoResize') autoResize: ElementRef;

  constructor(private prompt: PromptService, private modalController: ModalController) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.prompt.init(this.autoResize.nativeElement.getBoundingClientRect().height, true);
  }

  exit() {
    this.modalController.dismiss();
  }
}

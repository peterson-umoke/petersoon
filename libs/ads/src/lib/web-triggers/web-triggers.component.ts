import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {
  ScraperApiService,
  SnackBarService,
  TranslationService,
  UrlBooleanRule,
} from '@marketplace/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-web-triggers',
  templateUrl: './web-triggers.component.html',
  styleUrls: ['./web-triggers.component.scss'],
})
export class WebTriggersComponent implements OnInit {
  private currentTabIndex = 0;

  @Input() model: UrlBooleanRule;
  @Output() modelChange = new EventEmitter<any>();

  public showMore = false;
  public webTriggersForm = new FormGroup({
    currentValue: new FormControl(null),
    on_above_threshold: new FormControl(false),
    on_by_default: new FormControl(false),
    expiration: new FormControl(60, [Validators.required, Validators.min(0)]),
    threshold: new FormControl(null),
    url: new FormControl(null, [Validators.required]),
    xpath: new FormControl(null),
  });
  public xpathArray: Array<string> = [];

  constructor(
    private scraperApi: ScraperApiService,
    private snackBarService: SnackBarService,
    private translationService: TranslationService
  ) {}

  ngOnInit() {
    if (this.model) {
      this.showMore = true;
      this.webTriggersForm.patchValue({
        currentValue: this.model.value,
        on_above_threshold: this.model.on_above_threshold,
        on_by_default: this.model.on_by_default,
        expiration: this.model.stale_time,
        threshold: this.model.threshold,
        url: this.model.url,
        xpath: this.model.xpath,
      });
    } else {
      this.reset();
    }
  }

  public aboveThresholdChange(change: MatSelectChange) {
    this.webTriggersForm.controls.on_above_threshold.setValue(change.value);
    this.assignRule();
  }

  /**
   * Emit the new rule
   */
  private assignRule() {
    if (this.validRule()) {
      this.modelChange.emit({
        on_above_threshold: this.webTriggersForm.controls.on_above_threshold
          .value,
        on_by_default: this.webTriggersForm.controls.on_by_default.value,
        stale_time: this.webTriggersForm.controls.expiration.value,
        threshold: this.webTriggersForm.controls.threshold.value,
        url: this.webTriggersForm.controls.url.value,
        value: this.webTriggersForm.controls.currentValue.value,
        path: this.webTriggersForm.controls.xpath.value,
        xpath: this.webTriggersForm.controls.xpath.value,
      });
    } else {
      this.modelChange.emit(null);
    }
  }

  private validRule() {
    if (
      this.webTriggersForm.controls.url.value &&
      this.webTriggersForm.controls.xpath.value &&
      this.webTriggersForm.controls.expiration.value &&
      this.webTriggersForm.controls.threshold.value
    ) {
      return true;
    }
    return false;
  }

  public findNumber() {
    if (this.webTriggersForm.invalid) {
      return;
    }

    this.webTriggersForm.disable();
    const obj = {
      url: this.webTriggersForm.controls.url.value,
      stale_time: this.webTriggersForm.controls.expiration.value,
      value: null,
      xpath: null,
      threshold: null,
      on_by_default: null,
    };

    if (this.webTriggersForm.controls.xpath.value) {
      obj.xpath = this.webTriggersForm.controls.xpath.value;
    }
    if (this.webTriggersForm.controls.currentValue.value) {
      obj.value = this.webTriggersForm.controls.currentValue.value;
    }
    if (this.webTriggersForm.controls.threshold.value) {
      obj.threshold = this.webTriggersForm.controls.threshold.value;
    }
    if (this.webTriggersForm.controls.on_by_default.value) {
      obj.on_by_default = this.webTriggersForm.controls.on_by_default.value;
    }

    this.scraperApi
      .scrape(obj)
      .then((resp) => {
        if (resp.paths.length === 0) {
          this.showMore = false;
          this.translationService
            .getTranslation('WEB_TRIGGERS.VALUE_NOT_FOUND', {
              value: obj.value,
            })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
        } else {
          this.showMore = true;
          if (resp.isXpath) {
            this.webTriggersForm.controls.currentValue.setValue(resp.paths);
          } else {
            this.webTriggersForm.controls.xpath.setValue(resp.paths[0]);
            this.xpathArray = resp.paths;
          }
          const value = this.webTriggersForm.controls.currentValue.value;
          this.translationService
            .getTranslation('WEB_TRIGGERS.VALUE_FOUND', { value: value })
            .subscribe((text: string) => {
              this.snackBarService.open(text);
            });
          this.webTriggersForm.controls.threshold.setValue(value);
          this.assignRule();
        }
      })
      .catch((errorMessage) => {
        this.snackBarService.open(errorMessage);
      })
      .then(() => {
        this.webTriggersForm.enable();
      });
  }

  public onByDefaultChange(change: MatSlideToggleChange) {
    this.webTriggersForm.controls.on_by_default.setValue(change.checked);
    this.assignRule();
  }

  /**
   * Ensure that the current value or xpath values are filled
   * depending on which tab is currently active
   */
  public optionalValueFilled(): boolean {
    return this.webTriggersForm.controls[
      this.currentTabIndex === 0 ? 'currentValue' : 'xpath'
    ].value
      ? true
      : false;
  }

  /**
   * Reset all values to null
   */
  public reset() {
    this.webTriggersForm.patchValue({
      currentValue: null,
      on_above_threshold: false,
      on_by_default: false,
      expiration: 60,
      threshold: null,
      url: null,
      xpath: null,
    });
    this.showMore = false;
    this.assignRule();
  }

  /**
   * Triggered when current value or xpath tab is clicked
   * @param change
   */
  public tabChange(change: MatTabChangeEvent) {
    this.currentTabIndex = change.index;
  }

  public xpathSelectChange(change: MatSelectChange) {
    this.webTriggersForm.controls.xpath.setValue(change.value);
    this.assignRule();
  }
}

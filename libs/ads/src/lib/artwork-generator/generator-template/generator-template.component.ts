import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { GeneratorTemplate } from '@marketplace/core';
import {
  BehaviorSubject,
  combineLatest,
  fromEvent,
  interval,
  merge,
  Observable,
  Subscription,
} from 'rxjs';
import {
  debounce,
  delay,
  distinctUntilChanged,
  map,
  shareReplay,
  skipWhile,
  startWith,
  take,
  timeout,
} from 'rxjs/operators';
import {
  ArtworkGeneratorService,
  GeneratorColorPair,
  GeneratorInfo,
  GenFont,
} from '../../services/artwork-generator-service/artwork-generator.service';

declare var window: any;
@Component({
  selector: 'ads-generator-template',
  templateUrl: './generator-template.component.svg',
  styleUrls: [
    './basic.scss',
    './basic_invert.scss',
    './basic_reflect.scss',
    './split.scss',
    './split_invert.scss',
  ],
})
export class GeneratorTemplateComponent implements OnInit, OnDestroy {
  @Input() width: number;
  @Input() height: number;
  @Input() genTemplate: GeneratorTemplate;
  @Input() gameTime = false;
  @Input() preview: boolean; // for the billboard preview
  @Output() loaded: EventEmitter<object> = new EventEmitter<object>();
  @ViewChild('template', { static: false }) template: ElementRef;
  @ViewChild('styleTag', { static: false }) styleTag: ElementRef;
  templateContainer: ElementRef;

  public fontChanged$: Observable<GenFont>;
  public headlineIsEmpty$: Observable<boolean>;
  subheadFontSize: BehaviorSubject<number> = new BehaviorSubject(76.8);
  subheadFontSize$: Observable<number>;

  public containerType: string;
  public generatorInfo$: Observable<GeneratorInfo>;
  public templateSize: string;
  public templatesWithSubheadAndThirdSwap = [
    GeneratorTemplate.SPLIT,
    GeneratorTemplate.SPLIT_INVERT,
  ];
  public viewBox: string;
  private fitTextEmittedValue: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(0);
  public subheadIsEmpty$: Observable<boolean>;
  public triggerResize$: Observable<any>;
  templateChanged$: Observable<GeneratorTemplate>;
  subscriptions = new Subscription();
  colors: { primary: GeneratorColorPair; secondary: GeneratorColorPair };
  windowResized$: Observable<any>;

  constructor(private artworkGeneratorService: ArtworkGeneratorService) {
    this.subheadFontSize$ = this.subheadFontSize
      .asObservable()
      .pipe(distinctUntilChanged());
  }

  ngOnInit() {
    const ratio =
      this.width && this.height
        ? Math.round((this.width / this.height) * 2) / 2
        : 3.5; // 3.5 is a common sign ratio
    this.containerType =
      ratio >= 1.5 ? 'horizontal-container' : 'vertical-container';

    this.generatorInfo$ = this.artworkGeneratorService.generatorInfo$.pipe(
      map((genInfo) => {
        const genInfoCopy = genInfo.clone();
        genInfoCopy.headline =
          genInfo.headline != null
            ? genInfo.headline
            : 'CAMPAIGN.CREATION.GENERATOR.HEADLINE';
        genInfoCopy.subhead =
          genInfo.subhead != null
            ? genInfo.subhead
            : 'CAMPAIGN.CREATION.GENERATOR.SUBHEAD';
        genInfoCopy.third =
          genInfo.third != null
            ? genInfo.third
            : 'CAMPAIGN.CREATION.GENERATOR.THIRD';
        return genInfoCopy;
      }),
      shareReplay(1)
    );

    this.subheadIsEmpty$ = this.generatorInfo$.pipe(
      map(
        (genInfo) => genInfo.subhead != null && genInfo.subhead.trim() === ''
      ),
      distinctUntilChanged(),
      shareReplay(1)
    );

    this.headlineIsEmpty$ = this.generatorInfo$.pipe(
      map(
        (genInfo) => genInfo.headline != null && genInfo.headline.trim() === ''
      ),
      distinctUntilChanged(),
      shareReplay(1)
    );

    this.fontChanged$ = this.generatorInfo$.pipe(
      map((genInfo) => genInfo.font),
      distinctUntilChanged(),
      shareReplay(1)
    );

    this.templateChanged$ = this.artworkGeneratorService.selectedTemplate$.pipe(
      startWith(GeneratorTemplate.BASIC),
      shareReplay(1)
    );

    this.windowResized$ = fromEvent(window, 'resize').pipe(
      distinctUntilChanged(),
      shareReplay(1)
    );

    this.triggerResize$ = merge(
      this.headlineIsEmpty$,
      this.subheadIsEmpty$,
      this.fontChanged$,
      this.templateChanged$,
      this.windowResized$
    ).pipe(
      delay(500),
      shareReplay(1)
    );

    combineLatest([
      this.generatorInfo$,
      this.fitTextEmittedValue.asObservable(),
    ])
      .pipe(
        debounce(() => interval(600)),
        skipWhile(([_genInfo, val]) => val === 0),
        delay(500),
        timeout(5000),
        take(1)
      )
      .subscribe(
        ([_genInfo, _]) => {
          if (this.gameTime) {
            this.loaded.emit({
              node: this.template.nativeElement,
              styleTag: this.styleTag.nativeElement,
              width: this.width,
              height: this.height,
            });
          }
        },
        (err) => {
          if (this.gameTime) {
            this.loaded.emit({
              node: this.template.nativeElement,
              styleTag: this.styleTag.nativeElement,
              width: this.width,
              height: this.height,
            });
          }
        }
      );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  fontResized(updatedFontSize: number) {
    if (updatedFontSize !== this.subheadFontSize.value) {
      this.subheadFontSize.next(Math.trunc(updatedFontSize * 0.8));
    }
    this.fitTextEmittedValue.next(updatedFontSize);
  }

  subheadOrThirdResized(updatedFontSize: number) {
    this.fitTextEmittedValue.next(updatedFontSize);
  }

  public getColor(
    template: GeneratorTemplate,
    type: 'primary' | 'secondary'
  ): 'primary' | 'secondary' {
    if (template === GeneratorTemplate.SPLIT_INVERT) {
      return type === 'primary' ? 'secondary' : 'primary';
    } else if (template === GeneratorTemplate.BASIC_INVERT) {
      // Basic invert is now just full color
      return 'primary';
    }
    return type;
  }
}

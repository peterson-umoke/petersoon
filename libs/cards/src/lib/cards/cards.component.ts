import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  AppRoutes,
  Card,
  ChangeDialogComponent,
  CurrencyService,
  PaymentService,
  UserService,
} from '@marketplace/core';
import * as _ from 'lodash';
import { combineLatest, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ChargeCardDialogComponent } from '../charge-card-dialog/charge-card-dialog.component';

const CARD_NAME_MAX = 60;
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardsComponent implements OnInit, OnDestroy {
  @ViewChild('newName', { static: false }) newNameInput: ElementRef;
  public cardNameMax = CARD_NAME_MAX;
  public displayedColumns: string[] = ['name'];
  public dataSource = new MatTableDataSource<any>([]);
  public cardLimit: number;
  public isSuperUser: boolean;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private currencyService: CurrencyService,
    private paymentService: PaymentService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      combineLatest([
        this.userService.$profile,
        this.userService.$selectedOrgInfo.pipe(
          filter((orgInfo) => !_.isNil(orgInfo))
        ),
      ]).subscribe(([profile, orgInfo]) => {
        this.checkForChanges();

        this.isSuperUser = profile.user.is_superuser;
        this.cardLimit = !_.isNil(orgInfo['card-limit'])
          ? orgInfo['card-limit']
          : 3;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public charge(cardId: string) {
    const dialogRef = this.dialog.open(ChargeCardDialogComponent);

    dialogRef.afterClosed().subscribe((amount: string) => {
      if (amount) {
        this.paymentService.chargeCard({
          cardId: cardId,
          amount: this.currencyService.toNumber(amount),
        });
      }
    });
  }

  /**
   * Rechecks data source for changes (ex. after card is added)
   */
  public checkForChanges() {
    this.paymentService
      .cards(true)
      .then((cards: Array<Card>) => {
        this.dataSource = new MatTableDataSource(cards);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /**
   * Bring up the delete confirm dialog
   * @param cardId
   */
  public delete(cardId: string) {
    const dialogRef = this.dialog.open(ChangeDialogComponent, {
      data: { action: 'DELETE.TEXT', type: 'CHANGE.DELETE_CARD' },
    });

    dialogRef.afterClosed().subscribe((deleteAd: boolean) => {
      if (deleteAd) {
        this.paymentService
          .deleteCard(cardId)
          .then(() => {
            const newCards = this.dataSource.data.filter((card: Card) => {
              return card.id !== cardId;
            });
            this.dataSource = new MatTableDataSource(newCards);
            this.userService.reloadOrganizationInfo();
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  }

  /**
   * Edit the name of the card
   * @param card
   */
  public edit(card: Card) {
    card['edit'] = true;
    card['newName'] = card.name;
    setTimeout(() => {
      this.newNameInput.nativeElement.focus();
    });
  }

  /**
   * Cancel editing name of card
   * @param card
   */
  public editClose(card: Card) {
    card['edit'] = false;
    delete card['newName'];
  }

  /**
   * Save new name of card
   * @param card
   */
  public editSave(card: Card) {
    const newCard = { ...card };
    newCard.name = newCard['newName'];
    this.paymentService
      .updateCard(newCard)
      .then(() => {
        card.name = newCard.name;
        this.editClose(card);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /**
   * Go to details page for cards
   * @param cardId
   */
  public viewDetails(cardId: string) {
    this.router.navigate([AppRoutes.cardDetails(cardId)]);
  }
}

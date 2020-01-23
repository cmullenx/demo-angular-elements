import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'

@Component({
  templateUrl: './order-number.component.html',
  styleUrls: ['./app.component.scss'],
  /**
   * Angular makes it easy to create the shadow DOM through the ViewEncapsulation API
   * which defines template and style encapsulation options
   */
  encapsulation: ViewEncapsulation.ShadowDom
})
export class OrderNumberComponent implements OnInit, OnChanges {
  @Input() ordernumber: string
  @Input() colortheme: string

  @Output() trackingNumber: EventEmitter<any> = new EventEmitter()

  orderLookupForm: FormGroup
  submitted = false
  loading = false
  initial = true
  error = false
  headerColor = { background: 'white' }
  orderDetails

  ngOnInit() {
    this.buildForm()
    if (this.ordernumber) {
      this.fetchOrderDetails()
    }
    if (this.colortheme) {
      this.headerColor['background'] = this.colortheme
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.ordernumber.currentValue && this.orderLookupForm) {
      this.fetchOrderDetails()
    }
  }

  private buildForm() {
    this.orderLookupForm = new FormGroup({
      orderNumber: new FormControl(this.ordernumber)
    })
  }

  private fetchOrderDetails() {
    this.submitted = true
    this.initial = false
    this.loading = false

    this.orderDetails = {
      shipmentTotal: '$153.99',
      trackingNumber: '1Z8864R20200088181',
      orderNumber: this.ordernumber,
      status: 'On The Way',
      shipTo: 'Daniel Lozano'
    }

    this.trackingNumber.emit(this.orderDetails.trackingNumber)

    return this.orderDetails
  }

  onSubmit() {
    this.fetchOrderDetails()
  }
}

import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'

import { AppService } from './app.service'

@Component({
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  /**
   * Angular makes it easy to create the shadow DOM through the ViewEncapsulation API
   * which defines template and style encapsulation options
   */
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AppComponent implements OnInit, OnChanges {
  @Input() trackingnumber: string
  @Input() colortheme

  upsTrackingForm: FormGroup
  upsTrackingData
  submitted = false
  loading = false
  initial = true
  error = false
  headerColor = { background: 'black' }

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.buildForm()
    if (this.trackingnumber) {
      this.fetchTrackingInfo()
    }
    if (this.colortheme) {
      this.headerColor['background'] = this.colortheme
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.trackingnumber.currentValue && this.upsTrackingForm) {
      this.upsTrackingForm.setValue({
        trackingNumber: changes.trackingnumber.currentValue
      })
      this.upsTrackingForm.updateValueAndValidity()
      this.fetchTrackingInfo()
    }
  }

  private buildForm() {
    this.upsTrackingForm = new FormGroup({
      trackingNumber: new FormControl(this.trackingnumber)
    })
  }

  private async fetchTrackingInfo() {
    this.loading = true
    const trackingNumberObj = this.upsTrackingForm.value
    const response: any = await this.appService.getTrackingInfo(
      trackingNumberObj
    )

    if (response.hasOwnProperty('TrackResponse')) {
      this.upsTrackingData = {
        ...response.TrackResponse.Shipment.Package,
        Activity: response.TrackResponse.Shipment.Package.Activity.map(
          activity => {
            return {
              ...activity,
              Status: {
                ...activity.Status,
                Type: this.mapActivityCode(activity.Status.Type)
              },
              Date: this.formatDate(activity.Date),
              Time: this.formatTime(activity.Time)
            }
          }
        )
      }
      this.submitted = true
      this.initial = false
      this.loading = false
    } else {
      this.error = true
      this.submitted = true
      this.initial = false
      this.loading = false
    }
  }

  onSubmit() {
    this.fetchTrackingInfo()
  }

  private insert = (str, index, value) =>
    str.substr(0, index) + value + str.substr(index)

  private formatDate = dateString => {
    let firstDashInserted = this.insert(dateString, 6, '-')
    let lastDashInserted = this.insert(firstDashInserted, 4, '-')
    return lastDashInserted
  }

  private formatTime = date => this.insert(date, 2, ':').slice(0, 5)

  private mapActivityCode = (code: string) => {
    switch (code) {
      case 'D':
        return 'Delivered'
      case 'I':
        return 'In Transit'
      case 'X':
        return 'Exception'
      case 'P':
        return 'Pickup'
      case 'M':
        return 'Manifest Pickup'
      default:
        return 'In Transit'
    }
  }
}

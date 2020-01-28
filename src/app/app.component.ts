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
  @Input() trackingnumber: string = '1Z871F000220005413'
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
    // const response: any = await this.appService.getTrackingInfo(
    //   trackingNumberObj
    // )

    const response = {
      TrackResponse: {
        Response: {
          ResponseStatus: { Code: '1', Description: 'Success' },
          TransactionReference: {
            CustomerContext: 'Your Test Case Summary Description'
          }
        },
        Shipment: {
          InquiryNumber: {
            Code: '01',
            Description: 'ShipmentIdentificationNumber',
            Value: '1Z12345E6205277936'
          },
          ShipmentType: { Code: '01', Description: 'Small Package' },
          ShipperNumber: '12345E',
          Service: { Code: '13', Description: 'NEXT DAY AIR SAVER' },
          Package: {
            TrackingNumber: '1Z12345E6205277936',
            Activity: [
              {
                ActivityLocation: {
                  Address: { City: 'BONN', CountryCode: 'DE' }
                },
                Status: {
                  Type: 'X',
                  Description: 'UPS INTERNAL ACTIVITY CODE',
                  Code: 'KB'
                },
                Date: '20100830',
                Time: '103900'
              },
              {
                ActivityLocation: {
                  Address: { City: 'BONN', CountryCode: 'DE' }
                },
                Status: {
                  Type: 'X',
                  Description: 'ADVERSE WEATHER CONDITIONS CAUSED THIS DELAY',
                  Code: 'DJ'
                },
                Date: '20100830',
                Time: '103200'
              },
              {
                ActivityLocation: {
                  Address: {
                    City: 'ANYTOWN',
                    StateProvinceCode: 'GA',
                    CountryCode: 'US'
                  }
                },
                Status: {
                  Description:
                    "THE RECEIVER'S LOCATION WAS CLOSED ON THE 2ND DELIVERY ATTEMPT. A 3RD DELIVERY ATTEMPT WILL BE MADE",
                  Code: 'X'
                },
                Date: '20100910',
                Time: '180300'
              },
              {
                ActivityLocation: {
                  Address: {
                    City: 'ANYTOWN',
                    StateProvinceCode: 'GA',
                    PostalCode: '30340',
                    CountryCode: 'US'
                  },
                  Code: 'MX',
                  Description: 'LEFT AT'
                },
                Status: { Type: 'D', Description: 'DELIVERED', Code: 'FS' },
                Date: '20100912',
                Time: '115700'
              },
              {
                ActivityLocation: {
                  Address: {
                    City: 'WEST CHESTER-MALVERN',
                    StateProvinceCode: 'GA',
                    CountryCode: 'US'
                  }
                },
                Status: { Type: 'P', Description: 'PICKUP SCAN', Code: 'PU' },
                Date: '20100404',
                Time: '144000'
              },
              {
                ActivityLocation: {
                  Address: { City: 'BONN', CountryCode: 'DE' }
                },
                Status: {
                  Type: 'X',
                  Description: 'UPS INTERNAL ACTIVITY CODE',
                  Code: 'KB'
                },
                Date: '20100830',
                Time: '131300'
              }
            ],
            PackageWeight: {
              UnitOfMeasurement: { Code: 'LBS' },
              Weight: '1.00'
            }
          }
        },
        Disclaimer:
          'You are using UPS tracking service on customer integration test environment, please switch to UPS production environment once you finish the test. The URL is https://onlinetools.ups.com/webservices/Track'
      }
    }

    console.log('this is response', response)

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

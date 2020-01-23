import { Injectable } from '@angular/core'
import { AWS_SECRET_KEY, AWS_ACCESS_KEY } from '../../aws-creds'
import * as AWS from 'aws-sdk'

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor() {}

  async getTrackingInfo(trackingNumber: any) {
    AWS.config.update({ region: 'us-east-1' })
    AWS.config.credentials = new AWS.Credentials(AWS_ACCESS_KEY, AWS_SECRET_KEY)
    const lambda = new AWS.Lambda({
      region: 'us-east-1',
      apiVersion: '2015-03-31'
    })

    const pullParams = {
      FunctionName: 'callUpsApi',
      InvocationType: 'RequestResponse',
      LogType: 'Tail',
      Payload: JSON.stringify(trackingNumber)
    }

    const promiseResult = new Promise((resolve, reject) => {
      lambda.invoke(pullParams, function(error, data) {
        if (error) {
          return reject(error)
        } else {
          let parsedResponse = JSON.parse(data.Payload as any)
          return resolve(JSON.parse(parsedResponse.body))
        }
      })
    })

    const getPromiseResult = async () => {
      return await promiseResult
    }

    return getPromiseResult()

    // console.log("RESPONSE", response);
    // return response;
    //dummy json
    //   return {
    //     TrackResponse: {
    //       Response: {
    //         ResponseStatus: { Code: "1", Description: "Success" },
    //         TransactionReference: {
    //           CustomerContext: "Your Test Case Summary Description"
    //         }
    //       },
    //       Shipment: {
    //         InquiryNumber: {
    //           Code: "01",
    //           Description: "ShipmentIdentificationNumber",
    //           Value: "1Z871F000220005413"
    //         },
    //         ShipperNumber: "871F00",
    //         ShipmentAddress: [
    //           {
    //             Type: { Code: "01", Description: "Shipper Address" },
    //             Address: {
    //               AddressLine: "8110 RED WILLOW",
    //               City: "AUSTIN",
    //               StateProvinceCode: "TX",
    //               PostalCode: "78736",
    //               CountryCode: "US"
    //             }
    //           },
    //           {
    //             Type: { Code: "02", Description: "ShipTo Address" },
    //             Address: {
    //               City: "KATY",
    //               StateProvinceCode: "TX",
    //               PostalCode: "77494",
    //               CountryCode: "US"
    //             }
    //           }
    //         ],
    //         ShipmentWeight: {
    //           UnitOfMeasurement: { Code: "LBS" },
    //           Weight: "0.00"
    //         },
    //         Service: { Code: "002", Description: "UPS 2nd Day Air" },
    //         ReferenceNumber: { Code: "01", Value: "DEMO1" },
    //         PickupDate: "20190927",
    //         Package: {
    //           TrackingNumber: "1Z871F000220005413",
    //           Activity: [
    //             {
    //               ActivityLocation: { Address: { CountryCode: "US" } },
    //               Status: {
    //                 Type: "MV",
    //                 Description: "Voided Information Received",
    //                 Code: "VP"
    //               },
    //               Date: "2019-09-27",
    //               Time: "09:50:23"
    //             },
    //             {
    //               ActivityLocation: { Address: { CountryCode: "US" } },
    //               Status: {
    //                 Type: "M",
    //                 Description: "Order Processed: Ready for UPS",
    //                 Code: "MP"
    //               },
    //               Date: "2019-09-27",
    //               Time: "08:17:27"
    //             }
    //           ],
    //           PackageWeight: {
    //             UnitOfMeasurement: { Code: "LBS" },
    //             Weight: "0.00"
    //           },
    //           ReferenceNumber: { Code: "01", Value: "DEMO1" }
    //         }
    //       },
    //       Disclaimer:
    //         "You are using UPS tracking service on customer integration test environment, please switch to UPS production environment once you finish the test. The URL is https://onlinetools.ups.com/webservices/Track"
    //     }
    //   };
  }
}

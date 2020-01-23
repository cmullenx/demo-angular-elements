import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'

import { AppComponent } from './app.component'
import { OrderNumberComponent } from './order-number.component'

import { createCustomElement } from '@angular/elements'
import { Injector } from '@angular/core'

@NgModule({
  declarations: [AppComponent, OrderNumberComponent],
  entryComponents: [AppComponent, OrderNumberComponent],
  imports: [BrowserModule, ReactiveFormsModule]
})
export class AppModule {
  constructor(private injector: Injector) {}
  // manually bootstrap
  ngDoBootstrap() {
    const injector = this.injector
    // Convert 'AppComponent' to a custom element
    const UpsTrackerElement = createCustomElement(AppComponent, {
      injector
    })

    const OrderNumberElement = createCustomElement(OrderNumberComponent, {
      injector
    })
    // Register the custom element with the browser
    customElements.define('ups-tracker', UpsTrackerElement)
    customElements.define('order-lookup', OrderNumberElement)
  }
}

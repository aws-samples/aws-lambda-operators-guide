/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

import Vue from 'vue'
import App from './App.vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.config.productionTip = false

// Visit https://developers.google.com/maps/documentation/javascript/get-api-key to request a key

Vue.use(VueGoogleMaps, {
  load: {
    key: '<<  ADD YOUR KEY HERE >>',
    libraries: 'places'
  }
})

new Vue({
  render: h => h(App),
}).$mount('#app')

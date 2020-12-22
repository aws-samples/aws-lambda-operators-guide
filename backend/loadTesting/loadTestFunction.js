/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

'use strict'

// Sets a bounding box around the NYC area
const bounds = {
  latMax: 40.799278,
  latMin: 40.705543,
  lngMax: -73.948268,
  lngMin: -74.011272
}

const generateRandomData = (userContext, events, done) => {
  const randomLat = ((bounds.latMax-bounds.latMin) * Math.random()) + bounds.latMin
  const randomLng = ((bounds.lngMax-bounds.lngMin) * Math.random()) + bounds.lngMin

  userContext.vars.lat = randomLat.toFixed(7)
  userContext.vars.lng = randomLng.toFixed(7)

  // console.log(userContext)

  return done()
}

module.exports = {
  generateRandomData
}

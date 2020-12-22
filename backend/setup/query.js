/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */
'use strict'

// Run 'node query' to see how many locations are within 1km (0.6 miles) of a location in NYC.

const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1'} )

const ddb = new AWS.DynamoDB() 
const ddbGeo = require('dynamodb-geo')

const config = new ddbGeo.GeoDataManagerConfiguration(ddb, 'ddbLocations')
config.hashKeyLength = 5

const myGeoTableManager = new ddbGeo.GeoDataManager(config)

myGeoTableManager.queryRadius({
  RadiusInMeter: 1000,
  CenterPoint: {
      latitude: 40.7769099,
      longitude: -73.9822532
  }
})
.then((locations) => {
  console.log('Locations found: ', locations.length)
  console.log(locations)
})
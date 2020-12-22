/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))

AWS.config.update({region: process.env.AWS_REGION})

const ddb = new AWS.DynamoDB() 
const ddbGeo = require('dynamodb-geo')
const config = new ddbGeo.GeoDataManagerConfiguration(ddb, process.env.TABLE_NAME)
config.hashKeyLength = 5

const myGeoTableManager = new ddbGeo.GeoDataManager(config)

exports.handler = async (event) => {
  if (process.env.LOG_EVENT) console.log(JSON.stringify(event))

  // Get lat/lng from request body
  let latitude, longtitude

  try {
    latitude = parseFloat(JSON.parse(event.body).lat)
    longitude = parseFloat(JSON.parse(event.body).lng)
  } catch (err) {
    return {
      statusCode: 422,
      body: JSON.stringify("Missing parameters")
    }    
  }

  console.log(`Searching for: ${latitude}, ${longitude} with ${process.env.RADIUS_METERS} radius`)

  // Get questions within geo range
  const result = await myGeoTableManager.queryRadius({
    RadiusInMeter: process.env.RADIUS_METERS,
    CenterPoint: {
      latitude,
      longitude
    }
  })

  console.log('Result: ', result)

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  }
}
/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

'use strict'

/* A hashKeyLength of 5 is ideal for searches with a 10km granuality,
   according to the tests in the NPM documentation  */

// For random numbers
const { v4: uuidv4 } = require('uuid')

const AWS = require('aws-sdk')
AWS.config.update({region: 'us-east-1'})

const ddb = new AWS.DynamoDB() 
const ddbGeo = require('dynamodb-geo')
const config = new ddbGeo.GeoDataManagerConfiguration(ddb, 'ddbLocations')

// Pick a hashKeyLength appropriate to your usage
config.hashKeyLength = 5
const myGeoTableManager = new ddbGeo.GeoDataManager(config)

// In LoadTable, you can adjust BATCH_SIZE and WAIT_BETWEEN_BATCHES_MS to 
// slow down the load if you don't want to burn through write capacity. */
const BATCH_SIZE = 25
const WAIT_BETWEEN_BATCHES_MS = 500       // << LOOK!


const setupTable = async () => {

  // Use GeoTableUtil to help construct a CreateTableInput.
  const createTableInput = ddbGeo.GeoTableUtil.getCreateTableRequest(config)

  // Tweak the schema as desired
  createTableInput.ProvisionedThroughput.ReadCapacityUnits = 5
  
  console.log('Creating table with schema:')
  console.dir(createTableInput, { depth: null })
  
  // Create the table
  return new Promise((resolve, reject) => {
    ddb.createTable(createTableInput).promise()
        // Wait for it to become ready
        .then(function () { return ddb.waitFor('tableExists', { TableName: config.tableName }).promise() })
        .then(function () {
          console.log('Table created and ready!')
          resolve()
        })
  })
}

// See https://github.com/rh389/dynamodb-geo.js/blob/master/example/index.js

const loadTable = async () => {
  const data = require('./locations')

  const putPointInputs = data.map(function (location) {
      return {
          RangeKeyValue: { S: uuidv4() }, // Use this to ensure uniqueness of the hash/range pairs.
          GeoPoint: {
              latitude: location.position.lat,
              longitude: location.position.lng
          },
          PutItemInput: {
              Item: {
                name: { S: location.name }, // Specify attribute values using { type: value } objects, like the DynamoDB API.
                address: { S: location.address }
              }
          }
      }
  })

  let currentBatch = 1

  function resumeWriting() {
    if (putPointInputs.length === 0) {
      return Promise.resolve()
    }
    const thisBatch = []
    for (let i = 0, itemToAdd = null; i < BATCH_SIZE && (itemToAdd = putPointInputs.shift()); i++) {
      thisBatch.push(itemToAdd)
    }
    console.log('Writing batch ' + (currentBatch++) + '/' + Math.ceil(data.length / BATCH_SIZE))

    return myGeoTableManager.batchWritePoints(thisBatch).promise()
      .then(function () {
        return new Promise(function (resolve) {
          setInterval(resolve,WAIT_BETWEEN_BATCHES_MS)
        })
      })
      .then(function () {
        return resumeWriting()
      })
  }

  return resumeWriting().catch(function (error) {
    console.warn(error)
  })
}

const main = async () => {
  await setupTable()
  await loadTable()
}

main ()
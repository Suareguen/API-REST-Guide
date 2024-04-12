const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const {
  connection,
  checkDb,
  syncModels
} = require('./database/index.js')
const initializeRelations = require('./database/relations.js')

async function checkAndSyncMySQL() {
  try {
    await checkDb()
    initializeRelations()
    await syncModels()
  } catch (error) {
    throw error
  }
}

const initializeAnListenExpress = () => {
  try {
    app.use(express.json())
      .use(cors())
      .use(morgan('dev'))
      .use('/api', require('./api/routes/index'))
      .listen(3000, () => {
        console.log('Server started')
      })
  } catch (error) {
    console.log(error)
  }
}

const startApi = async () => {
  try {
    await checkAndSyncMySQL()
    initializeAnListenExpress()
  } catch (error) {
    console.log(error)
  }
}

startApi()

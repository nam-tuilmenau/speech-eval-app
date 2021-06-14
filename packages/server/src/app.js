const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const sequelize = require('../models/index').sequelize
const router = require('./router')
const constants = require('../utils/constants')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const log = require('simple-node-logger').createSimpleLogger('speechAppLog.log') // eslint-disable-line

// initialize sequelize with session store
var sessionStore = new SequelizeStore({
  db: sequelize,
  extendDefaultFields: extendDefaultFields
})

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

var whitelist = ['http://localhost:8000']
app.use(cors({
  origin: function (origin, callback) {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS:', origin))
    }
  },
  credentials: true
}))
app.use(session({
  secret: 'your_secrete_key',
  store: sessionStore,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: constants.sessionExpirationInMs
  }
}))

app.use('/api', router)

// Sync session store
sessionStore.sync()

app.listen(process.env.PORT || 3000)

function extendDefaultFields (defaults) {
  return {
    data: defaults.data,
    expires: defaults.expires
  }
}

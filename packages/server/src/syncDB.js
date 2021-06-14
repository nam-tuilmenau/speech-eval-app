var sequelize = require('../models/index').sequelize

sequelize.sync({ force: true })

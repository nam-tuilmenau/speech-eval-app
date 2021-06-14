'use strict'
const parse = require('csv-parse/lib/sync')
const fs = require('fs')

function loadUrls (filePath) {
  const input = fs.readFileSync(filePath, 'utf-8')
  const audiosInfo = parse(input, { columns: true })
  return audiosInfo.map((row) => {
    return { url: row.url }
  })
}

const urls = loadUrls('./data/assignment_urls.csv')

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
    return queryInterface.bulkInsert('ExternalUrls', urls, {})
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
    return queryInterface.bulkDelete('ExternalUrls', null, {})
  }
}

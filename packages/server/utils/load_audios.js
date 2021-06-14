const parse = require('csv-parse/lib/sync')
const fs = require('fs')

function loadAudios (filePath) {
  const input = fs.readFileSync(filePath, 'utf-8')
  const audiosInfo = parse(input, { columns: true })
  return audiosInfo.map((row) => {
    row.id = row.name.replace('.wav', '')
    return row
  })
}

module.exports = {
  loadAudios
}

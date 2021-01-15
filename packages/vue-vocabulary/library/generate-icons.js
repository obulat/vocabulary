const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const camelCase = require('lodash.camelcase')
const dist = path.resolve(__dirname)
const util = require('util')
const readFile = util.promisify(fs.readFile)
const chalk = require('chalk')
const vIcons = require('./icons.json')

function upperFirstLetter (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function format (icons) {
  return icons.map(icon => {
    console.log('Adding icon ', icon)
    return readFile(
      path.resolve('node_modules/@creativecommons/fonts/assets/svg', icon.svg),
      'utf-8'
    ).then(svg => {
      // add formatted name
      const name = camelCase(icon.name)
      icon.nameFormatted = upperFirstLetter(name)
      // trim spaces, tabs, new lines from svg
      svg = svg.replace(/\r+|\n+|\t+/gm, '')
      // unwrap svg
      const re = /<svg.*?>(.*?)<\/svg>/g
      const unwrappedSvg = re.exec(svg)
      // add svg path to icon
      if (unwrappedSvg) icon.path = unwrappedSvg[1]

      return icon
    })
  })
}

function generate () {
  const p = format(vIcons)
  // await promises
  Promise.all([...p]).then(icons => {
    // get icon template
    const iconTemplate = fs.readFileSync(
      path.resolve(__dirname, './icon.hbs'),
      'utf-8',
      err => {
        if (err) console.error(err)
      }
    )
    // compile icon list
    const template = Handlebars.compile(iconTemplate)
    const iconList = template({ icons })
    // Divided by icon list
    fs.writeFile(`${dist}/icons-index.js`, iconList, err => {
      if (err) console.error(err)
    })
    // Icons list to demo app
    fs.writeFile(`${dist}/demo.json`, JSON.stringify(icons), err => {
      if (err) console.error(err)
    })
    console.log(chalk.green('All done'))
  })
}

generate()

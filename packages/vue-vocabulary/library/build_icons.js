const fs = require('fs-extra')
const path = require('path')
const pascalCase = require('pascal-case')

const iconsPath = './node_modules/@creativecommons/fonts/assets/svg/cc'
const icons = fs.readdirSync(iconsPath)

function getComponentName (v) {
  return pascalCase.pascalCase(v.replace(/\.[a-z]+$/, 'Icon'))
}

const componentTemplate = ({
  name,
  content
}) => `
export const ${getComponentName(name)} = {
  name: '${getComponentName(name)}',
  functional: true,
  render(h, ctx) {
    return ${content.replace(/<svg([^>]+)>/, '<svg$1 {...ctx.data}>')}
  }
}
`.trim()

async function buildIcons () {
  await Promise.all(icons.map(icon => {
    const component = componentTemplate({
      name: icon,
      content: fs.readFileSync(path.join(iconsPath, icon), 'utf8')
    })
    const filepath = `./icons/${getComponentName(icon)}.js`
    return fs.ensureDir(path.dirname(filepath))
      .then(() => fs.writeFile(filepath, component, 'utf8'))
  }))
  return icons
    .map(icon => `export { ${getComponentName(icon)} } from '../icons/${getComponentName(icon)}'`)
    .join('\n') + '\n'
}

module.exports = buildIcons

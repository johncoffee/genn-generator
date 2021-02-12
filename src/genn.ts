import * as program from 'commander'
import { ensureDir, readFile, writeFile } from 'fs-extra'
import {join, resolve} from 'path'

program
  .option('-a, --component <compName>', 'add component')
  .option('-c, --container <containerName>', 'add container comp.')
  .option('-h, --home <homeName>', 'add a route home')
  .option('-n, --dry', 'Test run, no side effects')
  .parse(process.argv)

const dry = (program.dry !== undefined)

if (program.component) {
  componentCmd(program.component)
}
else if(program.container) {
  containerCmd(program.container)
}
else if (program.home) {
  console.error("Home not implemented yet")
}
else {
  program.outputHelp()
}

async function containerCmd (newName:string) {
  const compName = newName.replace('Home','').replace('Container','')
  const containerCompName = compName + "Container"

  const tpl = (await readFile(join(__dirname, '../src/tpl', 'container.tpl.jsx')))
    .toString()
    .replace(new RegExp('CONTAINER_NAME','g'), containerCompName)
    .replace(new RegExp('COMPONENT_NAME','g'), compName)

  const cwDir = resolve(process.cwd(), '.')
  console.log('cwd (should be components)', cwDir)

  // make its parent dir
  if (!dry)
    await ensureDir(join(cwDir, compName))
  else
    console.log("make dir ",join(cwDir, compName))

  // write the file
  const newFilePath = join(compName, containerCompName + '.js')
  if (!dry)
    await writeFile(newFilePath , tpl)
  else
    console.log("write file ", newFilePath, tpl.toString().length + " B")

  console.log("Done")
}

async function componentCmd (newName:string) {
  console.log('create', newName)
  const tpl = (await readFile(join(__dirname, '../src/tpl', 'component.tpl.jsx')))
    .toString()
    .replace(new RegExp('COMPONENT_NAME','g'), newName)

  const cwDir = resolve(process.cwd(), '.')
  console.log('cwd (should be components)', cwDir)

  // make its parent dir
  const newDir = newName.replace('Home','').replace('Container','')

  if (!dry)
    await ensureDir(join(cwDir, newDir))
  else
    console.log("make dir ",join(cwDir, newDir))

  // write the file
  const newFilePath = join(newDir, newName + '.js')
  if (!dry)
    await writeFile(newFilePath, tpl)
  else
    console.log("write file ", newFilePath, tpl.toString().length + " B")

  console.log("Done")
}


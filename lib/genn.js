"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
program
    .option('-c, --component <compName>', 'add component')
    .option('-o, --container <containerName>', 'add container')
    .option('-n, --dry', 'Test run, no side effects')
    .parse(process.argv);
const dry = (program.dry !== undefined);
if (program.component) {
    componentCmd(program.component);
}
else if (program.container) {
    containerCmd(program.container);
}
async function containerCmd(newName) {
    const compName = newName.replace('Home', '').replace('Container', '');
    const containerCompName = compName + "Container";
    const tpl = (await fs_extra_1.readFile(path_1.join(__dirname, '../src/tpl', 'container.tpl.jsx')))
        .toString()
        .replace(new RegExp('CONTAINER_NAME', 'g'), containerCompName)
        .replace(new RegExp('COMPONENT_NAME', 'g'), compName);
    const cwDir = path_1.resolve(process.cwd(), '.');
    console.log('cwd (should be components)', cwDir);
    // make its parent dir
    if (!dry)
        await fs_extra_1.ensureDir(path_1.join(cwDir, compName));
    else
        console.log("make dir ", path_1.join(cwDir, compName));
    // write the file
    const newFilePath = path_1.join(compName, containerCompName + '.js');
    if (!dry)
        await fs_extra_1.writeFile(newFilePath, tpl);
    else
        console.log("write file ", newFilePath, tpl.toString().length + " B");
    console.log("Done");
}
async function componentCmd(newName) {
    console.log('create', newName);
    const tpl = (await fs_extra_1.readFile(path_1.join(__dirname, '../src/tpl', 'component.tpl.jsx')))
        .toString()
        .replace(new RegExp('COMPONENT_NAME', 'g'), newName);
    const cwDir = path_1.resolve(process.cwd(), '.');
    console.log('cwd (should be components)', cwDir);
    // make its parent dir
    const newDir = newName.replace('Home', '').replace('Container', '');
    if (!dry)
        await fs_extra_1.ensureDir(path_1.join(cwDir, newDir));
    else
        console.log("make dir ", path_1.join(cwDir, newDir));
    // write the file
    const newFilePath = path_1.join(newDir, newName + '.js');
    if (!dry)
        await fs_extra_1.writeFile(newFilePath, tpl);
    else
        console.log("write file ", newFilePath, tpl.toString().length + " B");
    console.log("Done");
}

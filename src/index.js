const fs = require("fs");
const path = require("path");

function findProjectRoot(dir) {
	const isPackageJsonPresent = fs.existsSync(path.join(dir, "package.json"));
	const isInNodeModules = dir.includes("node_modules");
  
	if (isPackageJsonPresent && !isInNodeModules) {
	  return dir;
	}
  
	const parentDir = path.dirname(dir);
	if (parentDir === dir) {
	  throw new Error("Não foi possível encontrar o diretório raiz do projeto.");
	}
  
	return findProjectRoot(parentDir);
  }
const projectRoot = findProjectRoot(__dirname);

const pathFiles = path.join(projectRoot, "cypress/e2e/");


const jsconfigFilePath = path.join(projectRoot, "jsconfig.json");

const contentTsConfig = `{
"compilerOptions": {
  // "target": "ES6",
  //"module": "commonjs",
  //"lib": ["es6", "dom"],
  // "baseUrl": "./",
  // "paths": {
  //   "@/*": ["./path/to/aliases/*"]
  // },
  "types": ["cypress"]
},
// "include": ["**/*"],
"exclude": ["node_modules"]
}
`;
 
// file feature
fs.writeFileSync(jsconfigFilePath, contentTsConfig);

const site = path.join(pathFiles, "features/siteAccess.feature");
const contentSite = `
Feature: Access platform

Scenario: Automation feature configuration

Given access "https://jamesonbatista.github.io/projectqatesterweb/"
`;

// file .js

const steps = path.join(pathFiles, "steps/siteAcess.js");
const contentsteps = `
Given('access {string}', (url)=>{
	cy.visit(url)
})
`;

function ensureDirectoryExistence(filePath) {
	const dirname = path.dirname(filePath);
	if (fs.existsSync(dirname)) {
	  return true;
	}
	ensureDirectoryExistence(dirname);
	fs.mkdirSync(dirname);
  }

ensureDirectoryExistence(site);

fs.writeFileSync(site, contentSite);

ensureDirectoryExistence(steps);

fs.writeFileSync(steps, contentsteps);



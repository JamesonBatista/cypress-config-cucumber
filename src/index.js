const fs = require("fs");
const path = require("path");

const packageJsonPath = path.join(__dirname, "package.json");
const projectRootPathJsconfig = path.resolve(__dirname, "../../");
const pathFiles = path.resolve(__dirname, "../../cypress/e2e/");
function modifyPackageJson() {
  fs.readFile(packageJsonPath, "utf8", (err, data) => {
    if (err) {
      console.error("Erro ao ler o arquivo package.json:", err);
      return;
    }

    try {
      const packageJson = JSON.parse(data);

      packageJson["cypress-cucumber-preprocessor"] = {
        nonGlobalStepDefinitions: false,
        step_definitions: "cypress/e2e/**",
      };

      const newPackageJson = JSON.stringify(packageJson, null, 2);

      // Gravar as alterações no package.json
      fs.writeFile(packageJsonPath, newPackageJson, "utf8", (err) => {});
    } catch (err) {
      console.error("Erro ao parsear o arquivo package.json:", err);
    }
  });
}

modifyPackageJson();

const configPath = path.join(__dirname, "cypress.config.js");

const requiredImports = `
const cucumber = require('cypress-cucumber-preprocessor').default`;

const requiredSetupNodeEvents = `on('file:preprocessor', cucumber());`;

const requiredSpecPattern = `specPattern: "**/*.feature"`;

function updateConfigFile() {
  fs.readFile(configPath, "utf8", (err, data) => {
    if (err) {
      console.error("Erro ao ler o arquivo cypress.config.js:", err);
      return;
    }

    if (!data.includes("defineConfig") || !data.includes("cucumber")) {
      data = `${requiredImports}\n\n${data}`;
    }

    if (data.includes("setupNodeEvents")) {
      const setupNodeEventsRegex = /(setupNodeEvents\s*\([^)]*\)\s*{)([^}]*)}/;
      data = data.replace(setupNodeEventsRegex, (match, p1, p2) => {
        if (!p2.includes(requiredSetupNodeEvents)) {
          return `${p1}\n      ${requiredSetupNodeEvents.trim()}\n    ${p2.trim()}\n  }`;
        }
        return match;
      });
    }

    const e2eRegex = /e2e\s*:\s*{([^}]*)}/;
    if (!data.includes(requiredSpecPattern)) {
      data = data.replace(e2eRegex, (match, p1) => {
        if (!p1.includes("specPattern")) {
          return `e2e: {\n    ${requiredSpecPattern.trim()},\n    ${p1.trim()}\n  }`;
        }
        return match;
      });
    }

    fs.writeFile(configPath, data, "utf8", (err) => {});
  });
}

updateConfigFile();

const jsconfigFilePath = path.join(projectRootPathJsconfig, "jsconfig.json");

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

fs.writeFileSync(jsconfigFilePath, contentTsConfig);

const site = path.join(pathFiles, "features/siteAccess.feature");
const contentSite = `
Feature: Access platform

Scenario: Automation feature configuration

Given access "https://jamesonbatista.github.io/projectqatesterweb/"
`;
fs.writeFileSync(site, contentSite);

// file .js

const steps = path.join(pathFiles, "steps/siteAcess.js");
const contentsteps = `
Given('access {string}', (url)=>{
	cy.visit(url)
})
`;
fs.writeFileSync(steps, contentsteps);

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

const configPath = path.join(projectRoot, "cypress.config.js");

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

  updateConfigFile()
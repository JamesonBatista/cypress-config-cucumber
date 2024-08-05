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

const packageJsonPath = path.join(projectRoot,"package.json");

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
modifyPackageJson()  
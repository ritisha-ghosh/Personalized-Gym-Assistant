// backend/services/aiModelService.js
const { spawn } = require("child_process");
const path = require("path");

const runPythonScript = (scriptName, args) => {
  return new Promise((resolve, reject) => {
    // Pointing to the ML folder where your python scripts live
    const scriptPath = path.join(__dirname, "../../ML_Layer", scriptName);
    // Spawning the python process
    const pythonProcess = spawn("python", [scriptPath, ...args]);

    let dataString = "";

    // Collect data from script
    pythonProcess.stdout.on("data", (data) => {
      dataString += data.toString();
    });

    // Handle errors
    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python Error: ${data}`);
    });

    // Script finished
    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject(`Process exited with code ${code}`);
      } else {
        try {
          // Assuming python prints JSON
          resolve(JSON.parse(dataString));
        } catch (e) {
          resolve(dataString);
        }
      }
    });
  });
};

module.exports = { runPythonScript };

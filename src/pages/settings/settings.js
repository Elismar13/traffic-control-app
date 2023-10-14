const { ipcRenderer } = require('electron');
const { exec } = require('child_process');

const folderInput = document.getElementById('folderInput');

function execute(command, callback) {
  console.log(command)
  exec(command, (error, stdout, stderr) => {
    if(stderr != null)
      alert(`Erro ao rodar o script. Por favor verifique o erro.\n Callback: ${stderr}`);
    callback(stdout);
  });
};

function extractFolderPath(fullPath, targetFolder) {
  const position = fullPath.lastIndexOf(targetFolder);

  if (position !== -1) {
    const desiredPath = fullPath.substring(0, position + targetFolder.length);
    return desiredPath;
  } else {
    return null;
  }
}

document.getElementById('uploadForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const targetFolder = "car-detection";
  const selectedDirectory = folderInput.files[0].path;
  const completeFolder = extractFolderPath(selectedDirectory, targetFolder);

  if (completeFolder != null) {
    localStorage.setItem('path', completeFolder);
    execute(`python ${completeFolder}/src/vehicle.py`, (output) => {
      console.log(output);
    });
  } else {
    alert("Não foi encontrado a pasta raíz do repositório \"car_detection\". Por favor, aponte para a pasta correta.");
  }
});


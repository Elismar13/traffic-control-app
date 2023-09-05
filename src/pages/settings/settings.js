const exec = require('child_process').exec;

function execute(command, callback) {
    exec(command, (error, stdout, stderr) => { 
        callback(stdout); 
    });
};

document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário
  
    const videoFile = document.getElementById('videoFile').files[0];
  
    if (videoFile) {
      // Simulação de upload bem-sucedido
      alert(`Arquivo "${videoFile.name}" carregado com sucesso!`);
      console.log(`Path do vídeo: ${videoFile.path}`)
      execute("ECHO A")
    } else {
      alert('Selecione um arquivo de vídeo antes de fazer o upload.');
    }
  });
  
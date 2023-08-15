document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    // Simulando uma lógica de autenticação
    if (username === 'usuario' && password === 'senha') {
      window.location.href = 'pages/upload/upload.html'; // Redireciona para a página de upload
    } else {
      alert('Credenciais inválidas. Tente novamente.'); // Exibe uma mensagem de erro
    }
  });
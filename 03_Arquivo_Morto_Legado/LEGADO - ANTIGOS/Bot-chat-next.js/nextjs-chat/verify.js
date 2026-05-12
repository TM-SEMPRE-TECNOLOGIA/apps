const http = require('http');

http.get('http://localhost:3000', (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
        data += chunk;
    });

    resp.on('end', () => {
        if (data.includes('Tecnologia Sempre')) {
            console.log("Página principal carregou corretamente e contem o titulo do assistente.");
        } else {
            console.log("Algo de errado; HTML recebido:\n", data.substring(0, 500));
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});

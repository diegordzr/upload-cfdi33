
const fs = require('fs');

let rawdata = fs.readFileSync('FactibleDB2.json');
let data = JSON.parse(rawdata);

function convertToBase64(string) {
    let buff = new Buffer(string);
    let base64data = buff.toString('base64');
    return base64data;
}

async function main() {
    for (const key in data) {
        var i = parseInt(key);
        var obj = data[i];
        const request = require('request');
        var options = {
            method: 'POST',
            url: 'https://api.facturama.mx/upload/cfdi',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic am9zZXJvbWVyb25ldDpQcnVlYmFzMjAxMTpGYWN0dXJhbWFXZWI='
            }
        };
        let token = convertToBase64(`${obj.UserName}:${obj.EmailPwd}:FacturamaAPI`);
        let base64Content = convertToBase64(obj.InvoiceXML);
        options.headers['Authorization'] = `Basic ${token}`;
        options.body = JSON.stringify({
            ContentEncoding: "base64",
            ContentType:"xml",
            ContentLength: base64Content.length,
            Content: base64Content
        });
        
        await request(options, function (error, response, body) { 
            if (response && response.statusCode == 200) {
                var model = JSON.parse(body);
                console.log(model.msj)
            } else {
                var msj = response ? response.statusMessage : '';
                console.log(`Error al cargar el xml ${i}: ${msj}`);
            }
        });
    }
}

main();








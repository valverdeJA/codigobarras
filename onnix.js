const html5QrCodeSN = new Html5Qrcode("reader-SERIAL_NUMBER");
const html5QrCodeCM = new Html5Qrcode("reader-CODE_MACHINE");
var elementReturn = '';
const qrCodeSuccessCallback = (decodedText, decodedResult) => {
    document.getElementById(elementReturn).value = decodedText;
    //Paramos la lectura automÃ¡ticamente tras 1 segundo de tener la lectura
    setTimeout(function(){
        stopCamera();
    }, 1000);

};
const config = { fps: 10, qrbox: { width: 250, height: 250 } };

// FunciÃ³n para iniciar la cÃ¡mara
function startCamera(inputElement) {
    elementReturn = inputElement;     
    if (elementReturn == 'SERIAL_NUMBER')
        html5QrCodeSN.start({ facingMode: "environment" }, config, qrCodeSuccessCallback);
    else if (elementReturn == 'CODE_MACHINE')
        html5QrCodeCM.start({ facingMode: "environment" }, config, qrCodeSuccessCallback);
}  

// FunciÃ³n para detener la cÃ¡mara
function stopCamera() {
    if (elementReturn == 'SERIAL_NUMBER'){
        html5QrCodeSN.stop().then((ignore) => {
            // QR Code scanning is stopped.
            
            //Desencadenamos el evento 
            const elemento = document.getElementById(elementReturn);
            const eventoCambio = new Event("change");
            elemento.dispatchEvent(eventoCambio);
        }).catch((err) => {
            // Stop failed, handle it.
        });
    }else if (elementReturn == 'CODE_MACHINE'){
        html5QrCodeCM.stop().then((ignore) => {
            // QR Code scanning is stopped.
            
            //Desencadenamos el evento 
            const elemento = document.getElementById(elementReturn);
            const eventoCambio = new Event("change");
            elemento.dispatchEvent(eventoCambio);
        }).catch((err) => {
            // Stop failed, handle it.
        });
    }
}

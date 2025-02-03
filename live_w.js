var elementReturn = '';

// Función para iniciar la cámara y escanear códigos de barras
function startCamera(inputElement) {
    elementReturn = inputElement;

    Quagga.init({
        inputStream: {
            type: "LiveStream",
            target: "#interactive",
            constraints: {
                width: { min: 1600 },
                height: { min: 960 },
                aspectRatio: { min: 1, max: 100 },
                facingMode: "environment" // Cámara trasera
            }
        },
        locator: {
            patchSize: "medium",
            halfSample: false
        },
        numOfWorkers: 4,
        frequency: 10,
        decoder: {
            readers: ["code_39_reader"] // Lector de código de barras Code 39
        },
        locate: true
    }, function (err) {
        if (err) {
            console.error("Error al iniciar Quagga:", err);
            return;
        }
        Quagga.start();
    });
}

    Quagga.onProcessed(function(result) {
        var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                    return box !== result.box;
                }).forEach(function (box) {
                    Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
                });
            }

            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
            }

            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
            }
        }
    });


    Quagga.onDetected(function (result) {
        var code = result.codeResult.code;
        //console.log("Código detectado:", code);
        
        if (elementReturn) {
            document.getElementById(elementReturn).value = code;
            stopCamera();
        }
    });
    
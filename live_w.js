$(function() {
    var App = {
        init : function() {
            Quagga.init(this.state, function(err) {
                if (err) {
                    console.log(err);
                    return;
                }
                Quagga.start();
            });
        },
        state: {
            inputStream: {
                type : "LiveStream",
                target: document.querySelector('#reader-SERIAL_NUMBER'), // Este target cambiará dependiendo del botón que presionen
                constraints: {
                    width: {min: 800},
                    height: {min: 600},
                    aspectRatio: {min: 1, max: 100},
                    facingMode: "environment" // o "user" si prefieres usar la cámara frontal
                }
            },
            locator: {
                patchSize: "medium",
                halfSample: false
            },
            numOfWorkers: 4,
            frequency: 10,
            decoder: {
                readers : [{
                    format: "code_39_reader", // Este es solo un ejemplo, usa el tipo de código que necesites
                    config: {}
                }]
            },
            locate: true
        },
    };

    // Asocia el evento de clic en el botón "start-scanner-serial-number"
    $('#start-scanner-serial-number').click(function() {
        elementReturn = 'SERIAL_NUMBER';  // Establece el campo de texto al que se le colocará el código
        $('#reader-SERIAL_NUMBER').show();  // Muestra el div correspondiente
        $('#reader-CODE_MACHINE').hide();  // Oculta el otro div
        App.state.inputStream.target = document.querySelector('#reader-SERIAL_NUMBER'); // Cambia el target al div correcto
        App.init();  // Inicia el escaneo
    });

    // Asocia el evento de clic en el botón "start-scanner-code-machine"
    $('#start-scanner-code-machine').click(function() {
        elementReturn = 'CODE_MACHINE';  // Establece el campo de texto al que se le colocará el código
        $('#reader-CODE_MACHINE').show();  // Muestra el div correspondiente
        $('#reader-SERIAL_NUMBER').hide();  // Oculta el otro div
        App.state.inputStream.target = document.querySelector('#reader-CODE_MACHINE'); // Cambia el target al div correcto
        App.init();  // Inicia el escaneo
    });

    // Cuando se detecte un código QR, colócalo en el campo correspondiente
    Quagga.onDetected(function(result) {
        var code = result.codeResult.code;
        $('#' + elementReturn).val(code); // Coloca el código detectado en el campo correspondiente

        // Detenemos la cámara
        Quagga.stop();

        // Ocultamos la vista de la cámara después de la detección
        $('#reader-' + elementReturn).hide();
    });
});





/* FUNCIONA
$(function() {
    var App = {
        init : function() {
            Quagga.init(this.state, function(err) {
                if (err) {
                    console.log(err);
                    return;
                }
                Quagga.start();
            });
        },
        state: {
            inputStream: {
                type : "LiveStream",
                target: document.querySelector('#reader-SERIAL_NUMBER'),
                constraints: {
                    width: {min: 800},
                    height: {min: 600},
                    aspectRatio: {min: 1, max: 100},
                    facingMode: "environment" // or user
                }
            },
            locator: {
                patchSize: "medium",
                halfSample: false
            },
            numOfWorkers: 4,
            frequency: 10,
            decoder: {
                readers : [{
                    format: "code_39_reader",
                    config: {}
                }]
            },
            locate: true
        },
    };

    $('#start-scanner-serial-number').click(function() {
        App.init(); // Inicia el escaneo al hacer clic en el botón
    });

    /*
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


    Quagga.onDetected(function(result) {
        var code = result.codeResult.code;
        // Coloca el código detectado en el campo SERIAL_NUMBER
        $('#SERIAL_NUMBER').val(code);

        Quagga.stop();

        $('#reader-SERIAL_NUMBER').hide();
            });

});*/
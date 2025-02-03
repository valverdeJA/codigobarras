$(function() {
    var App = {
        successCount: 0, // Inicializa el contador de aciertos
        failureCount: 0, // Inicializa el contador de fallos

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

    App.init();

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

    var lastScanTime = null;

    Quagga.onDetected(function(result) {
        var code = result.codeResult.code;
        $('#detectedCode').html("Código detectado: " + code);

        // Obtener el código manual
        var manualCode = $('#manualInput').val().trim();

        // Mostrar el código manual en la pantalla
        $('#manualCodeDisplay').html("Código manual: " + manualCode);

        // Comparar el código manual con el código detectado
        if (manualCode && manualCode === code) {
            App.successCount++;
            $('#successCount').text(App.successCount);
        } else {
            App.failureCount++;
            $('#failureCount').text(App.failureCount);
        }
    });

    // Manejador para actualizar el código manual en tiempo real
    $(document).ready(function() {
        $('#manualInput').on('input', function() {
            var manualCode = $(this).val().trim();
            $('#manualCodeDisplay').html("Código manual: " + manualCode);
        });
    });
});
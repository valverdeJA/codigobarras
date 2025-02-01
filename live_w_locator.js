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
                    width: {min: 1600},
                    height: {min: 960},
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

    $(document).ready(function () {
        $('#manualInput').on('input', function () {
            var manualCode = $(this).val().trim();
            $('#manualCodeDisplay').html("Código manual: " + manualCode);
        });
    });

    if (manualCode && manualCode === code) {
        App.successCount++;
        $('#successCount').text(App.successCount);
    } else {
        App.failureCount++;
        $('#failureCount').text(App.failureCount);
    }
});

/* regulero
    var lastScanTime = null; // Para almacenar el tiempo de la última detección

    Quagga.onDetected(function(result) {
        var code = result.codeResult.code;
        var currentTime = new Date().getTime(); // Obtener el tiempo actual en milisegundos

        if (lastScanTime !== null) {
            var scanTime = currentTime - lastScanTime; // Tiempo transcurrido desde la última detección en ms
            var scanSpeed = 1000 / scanTime; // Velocidad de escaneo en escaneos por segundo
            var scanSpeedText = "Escaneo detectado en: " + scanSpeed.toFixed(2) + " escaneos por segundo"; // Texto con la velocidad
        }

        lastScanTime = currentTime; // Actualizamos el tiempo de la última detección

        var $node = $('<li><div class="caption"><h4 class="code"></h4><div class="scan-speed"></div></div></li>'); // Añadimos el div para la velocidad
            $node.find("h4.code").html(code); // Muestra el código en h4
            $node.find(".scan-speed").html("Escaneo detectado en: " + scanTime + "ms"); // Muestra el tiempo de escaneo en el div de la velocidad

            $("#result_strip ul.thumbnails").prepend($node); // Agrega el nodo al principio de la lista
    });
    
*/
/* BUENA BUENA BUENA
    Quagga.onDetected(function(result) {
        var code = result.codeResult.code;

        if (App.lastResult !== code) {
            App.lastResult = code;
            var $node = $('<li><div class="caption"><h4 class="code"></h4></div></li>'); // Eliminado el div de la imagen
            $node.find("h4.code").html(code); // Solo muestra el código en el h4
            $("#result_strip ul.thumbnails").prepend($node);
        }
    });
*/
});

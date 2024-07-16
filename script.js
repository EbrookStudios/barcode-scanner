window.addEventListener('load', function() {
    const codeReader = new ZXing.BrowserMultiFormatReader();
    const videoElement = document.getElementById('preview');
    const startButton = document.getElementById('start-button');

    startButton.addEventListener('click', () => {
        codeReader.decodeFromVideoDevice(null, 'preview', (result, err) => {
            if (result) {
                alert(`Scanned Code: ${result.text}`);
            }
            if (err && !(err instanceof ZXing.NotFoundException)) {
                console.error(err);
            }
        });
    });
});

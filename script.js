window.addEventListener('load', function() {
    const codeReader = new ZXing.BrowserMultiFormatReader();
    const videoElement = document.getElementById('preview');
    const startButton = document.getElementById('start-button');
    const productInfo = document.getElementById('product-info');
    const actionButtons = document.getElementById('action-buttons');
    const saveButton = document.getElementById('save-button');
    const resetButton = document.getElementById('reset-button');
    
    let scanning = false;

    startButton.addEventListener('click', () => {
        if (scanning) return;
        scanning = true;

        codeReader.decodeFromVideoDevice(null, 'preview', async (result, err) => {
            if (result) {
                codeReader.reset();
                scanning = false;
                alert(`Scanned Code: ${result.text}`);
                const productDetails = await fetchProductDetails(result.text);
                displayProductDetails(productDetails);
                actionButtons.style.display = 'block';
            }
            if (err && !(err instanceof ZXing.NotFoundException)) {
                console.error(err);
            }
        });
        videoElement.style.display = 'block';
    });

    saveButton.addEventListener('click', () => {
        // Add logic to save the scanned code
        alert('Code saved!');
    });

    resetButton.addEventListener('click', () => {
        productInfo.innerHTML = '';
        actionButtons.style.display = 'none';
        videoElement.style.display = 'none';
    });
    
    async function fetchProductDetails(barcode) {
        try {
            const response = await fetch(`https://api.barcodelookup.com/v2/products?barcode=${barcode}&key=YOUR_API_KEY`);
            const data = await response.json();
            return data.products[0]; // Assuming the API returns an array of products
        } catch (error) {
            console.error('Error fetching product details:', error);
            return null;
        }
    }
    
    function displayProductDetails(details) {
        if (details) {
            productInfo.innerHTML = `
                <h2>${details.product_name}</h2>
                <p>${details.description}</p>
                <p><strong>Brand:</strong> ${details.brand}</p>
                <p><strong>Category:</strong> ${details.category}</p>
                <p><strong>Price:</strong> $${details.price}</p>
                <img src="${details.images[0]}" alt="${details.product_name}">
            `;
        } else {
            productInfo.innerHTML = '<p>No product information found.</p>';
        }
    }
});

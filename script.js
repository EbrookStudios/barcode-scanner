window.addEventListener('load', function() {
    const codeReader = new ZXing.BrowserMultiFormatReader();
    const videoElement = document.getElementById('preview');
    const startButton = document.getElementById('start-button');
    const productInfo = document.getElementById('product-info');
    
    startButton.addEventListener('click', () => {
        codeReader.decodeFromVideoDevice(null, 'preview', async (result, err) => {
            if (result) {
                alert(`Scanned Code: ${result.text}`);
                const productDetails = await fetchProductDetails(result.text);
                displayProductDetails(productDetails);
            }
            if (err && !(err instanceof ZXing.NotFoundException)) {
                console.error(err);
            }
        });
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

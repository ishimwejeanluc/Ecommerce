// Initialize Dropzone
Dropzone.autoDiscover = false;
const productImages = new Dropzone("#productImages", {
    url: "/api/admin/upload",
    acceptedFiles: "image/*",
    maxFiles: 5,
    addRemoveLinks: true
});

// Filter and Search Functionality
function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    const status = document.getElementById('statusFilter').value;
    const sort = document.getElementById('sortBy').value;
    const search = document.getElementById('searchInput').value;
    
    const queryParams = new URLSearchParams({
        category,
        status,
        sort,
        search,
        page: 1
    });
    
    window.location.href = `/admin/products?${queryParams.toString()}`;
}

// Debounce search input
let searchTimeout;
document.getElementById('searchInput').addEventListener('input', function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(applyFilters, 500);
});

// Add event listeners to filters
['categoryFilter', 'statusFilter', 'sortBy'].forEach(id => {
    document.getElementById(id).addEventListener('change', applyFilters);
});

// Product Modal Functions
function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('productForm');
    
    modal.classList.remove('hidden');
    
    if (productId) {
        modalTitle.textContent = 'Edit Product';
        fetchProduct(productId);
    } else {
        modalTitle.textContent = 'Add Product';
        form.reset();
        productImages.removeAllFiles();
    }
}

function closeProductModal() {
    document.getElementById('productModal').classList.add('hidden');
}

function fetchProduct(productId) {
    fetch(`/api/admin/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.categoryId;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productStatus').value = product.status;
            document.getElementById('productDescription').value = product.description;
            
            // Load existing images
            productImages.removeAllFiles();
            product.images.forEach(image => {
                const mockFile = { name: image.name, size: 0 };
                productImages.displayExistingFile(mockFile, image.url);
            });
        });
}

function saveProduct() {
    const form = document.getElementById('productForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const productData = {
        id: document.getElementById('productId').value,
        name: document.getElementById('productName').value,
        categoryId: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        status: document.getElementById('productStatus').value,
        description: document.getElementById('productDescription').value,
        images: productImages.getAcceptedFiles().map(file => ({
            url: file.dataURL || file.url,
            name: file.name
        }))
    };
    
    const url = productData.id ? 
        `/api/admin/products/${productData.id}` : 
        '/api/admin/products';
    
    fetch(url, {
        method: productData.id ? 'PUT' : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            toast.show('Product saved successfully');
            closeProductModal();
            location.reload();
        } else {
            toast.show(data.message || 'Error saving product', 'error');
        }
    })
    .catch(error => {
        toast.show('Error saving product', 'error');
        console.error('Error:', error);
    });
}

function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }
    
    fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            toast.show('Product deleted successfully');
            location.reload();
        } else {
            toast.show(data.message || 'Error deleting product', 'error');
        }
    })
    .catch(error => {
        toast.show('Error deleting product', 'error');
        console.error('Error:', error);
    });
}

function changePage(page) {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('page', page);
    window.location.href = currentUrl.toString();
} 
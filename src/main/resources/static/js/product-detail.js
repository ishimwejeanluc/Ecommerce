document.addEventListener('DOMContentLoaded', function() {
    // Image Gallery
    const mainImage = document.querySelector('.main-image img');
    const galleryImages = document.querySelectorAll('.image-gallery img');
    
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            mainImage.src = this.src;
            galleryImages.forEach(i => i.classList.remove('border-primary'));
            this.classList.add('border-primary');
        });
    });
    
    // Quantity Controls
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decreaseQuantity');
    const increaseBtn = document.getElementById('increaseQuantity');
    
    decreaseBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });
    
    // Add to Cart
    const addToCartBtn = document.getElementById('addToCart');
    addToCartBtn.addEventListener('click', function() {
        const productId = this.dataset.productId;
        const quantity = parseInt(quantityInput.value);
        const selectedColor = document.querySelector('.color-selection button.border-primary')?.dataset.color;
        const selectedSize = document.querySelector('.size-selection button.border-primary')?.textContent;
        
        const product = {
            id: productId,
            quantity: quantity,
            color: selectedColor,
            size: selectedSize
        };
        
        cart.addItem(product);
    });
    
    // Wishlist Toggle
    const wishlistBtn = document.querySelector('.wishlist-btn');
    wishlistBtn.addEventListener('click', function() {
        const icon = this.querySelector('i');
        icon.classList.toggle('far');
        icon.classList.toggle('fas');
        
        if (icon.classList.contains('fas')) {
            toast.show('Added to wishlist');
        } else {
            toast.show('Removed from wishlist');
        }
    });
}); 
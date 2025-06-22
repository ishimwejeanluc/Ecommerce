// Cart Functions
function updateQuantity(element, change = 0) {
    const itemId = element.dataset.itemId;
    let quantity;
    
    if (change !== 0) {
        // Button click
        const input = element.parentElement.querySelector('input');
        quantity = parseInt(input.value) + change;
        if (quantity < 1) return;
        input.value = quantity;
    } else {
        // Direct input
        quantity = parseInt(element.value);
        if (quantity < 1) {
            element.value = 1;
            quantity = 1;
        }
    }
    
    // Update cart on server
    fetch(`/api/cart/update/${itemId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: quantity })
    })
    .then(response => response.json())
    .then(data => {
        updateOrderSummary(data);
        toast.show('Cart updated successfully');
    })
    .catch(error => {
        toast.show('Failed to update cart', 'error');
        console.error('Error:', error);
    });
}

function removeItem(element) {
    const itemId = element.dataset.itemId;
    const cartItem = element.closest('.cart-item');
    
    fetch(`/api/cart/remove/${itemId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        cartItem.remove();
        updateOrderSummary(data);
        
        // Check if cart is empty
        if (data.itemCount === 0) {
            location.reload(); // Show empty cart state
        }
        
        toast.show('Item removed from cart');
    })
    .catch(error => {
        toast.show('Failed to remove item', 'error');
        console.error('Error:', error);
    });
}

function updateOrderSummary(data) {
    const subtotalElement = document.querySelector('.order-summary .subtotal');
    const shippingElement = document.querySelector('.order-summary .shipping');
    const taxElement = document.querySelector('.order-summary .tax');
    const totalElement = document.querySelector('.order-summary .total');
    
    subtotalElement.textContent = `$${data.subtotal.toFixed(2)}`;
    shippingElement.textContent = data.shipping > 0 ? `$${data.shipping.toFixed(2)}` : 'Free';
    if (taxElement) {
        taxElement.textContent = `$${data.tax.toFixed(2)}`;
    }
    totalElement.textContent = `$${data.total.toFixed(2)}`;
}

function applyPromo() {
    const promoCode = document.getElementById('promoCode').value;
    
    fetch('/api/cart/promo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: promoCode })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            updateOrderSummary(data);
            toast.show('Promo code applied successfully');
        } else {
            toast.show(data.message || 'Invalid promo code', 'error');
        }
    })
    .catch(error => {
        toast.show('Failed to apply promo code', 'error');
        console.error('Error:', error);
    });
} 
// Initialize Stripe
const stripe = Stripe('your_publishable_key'); // Replace with your Stripe publishable key
const elements = stripe.elements();

// Create card element
const cardElement = elements.create('card', {
    style: {
        base: {
            fontSize: '16px',
            color: '#32325d',
            fontFamily: 'var(--font-primary)',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    }
});

// Mount card element
cardElement.mount('#card-element');

// Handle validation errors
cardElement.addEventListener('change', function(event) {
    const displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
    } else {
        displayError.textContent = '';
    }
});

// Handle form submission
const form = document.getElementById('checkoutForm');
form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Disable submit button to prevent double submission
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<div class="spinner"></div>';
    
    // Create payment method
    stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
            name: form.shippingFirstName.value + ' ' + form.shippingLastName.value,
            address: {
                line1: form.shippingAddress.value,
                city: form.shippingCity.value,
                state: form.shippingState.value,
                postal_code: form.shippingZip.value
            }
        }
    }).then(function(result) {
        if (result.error) {
            handleError(result.error);
            submitButton.disabled = false;
            submitButton.textContent = 'Place Order';
        } else {
            // Send payment method ID to server
            fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    paymentMethodId: result.paymentMethod.id,
                    shipping: {
                        firstName: form.shippingFirstName.value,
                        lastName: form.shippingLastName.value,
                        address: form.shippingAddress.value,
                        city: form.shippingCity.value,
                        state: form.shippingState.value,
                        zipCode: form.shippingZip.value,
                        phone: form.phone.value
                    }
                })
            })
            .then(response => response.json())
            .then(function(data) {
                if (data.requiresAction) {
                    // Handle 3D Secure authentication
                    handleAction(data);
                } else if (data.error) {
                    handleError(data.error);
                    submitButton.disabled = false;
                    submitButton.textContent = 'Place Order';
                } else {
                    // Success - redirect to order confirmation
                    window.location.href = `/order/confirmation/${data.orderId}`;
                }
            })
            .catch(function(error) {
                handleError(error);
                submitButton.disabled = false;
                submitButton.textContent = 'Place Order';
            });
        }
    });
});

function handleAction(data) {
    stripe.handleCardAction(data.clientSecret)
        .then(function(result) {
            if (result.error) {
                handleError(result.error);
            } else {
                // Send payment intent ID to server to confirm payment
                fetch('/api/checkout/confirm', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        paymentIntentId: result.paymentIntent.id
                    })
                })
                .then(response => response.json())
                .then(function(confirmResult) {
                    if (confirmResult.error) {
                        handleError(confirmResult.error);
                    } else {
                        window.location.href = `/order/confirmation/${confirmResult.orderId}`;
                    }
                });
            }
        });
}

function handleError(error) {
    const errorElement = document.getElementById('card-errors');
    errorElement.textContent = error.message || 'An error occurred during checkout.';
    toast.show(error.message || 'An error occurred during checkout.', 'error');
} 
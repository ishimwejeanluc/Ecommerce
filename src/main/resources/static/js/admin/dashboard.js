document.addEventListener('DOMContentLoaded', function() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: revenueData.labels,
            datasets: [{
                label: 'Revenue',
                data: revenueData.values,
                borderColor: 'rgb(79, 70, 229)',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(79, 70, 229, 0.1)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            }
        }
    });

    // Orders Chart
    const ordersCtx = document.getElementById('ordersChart').getContext('2d');
    new Chart(ordersCtx, {
        type: 'bar',
        data: {
            labels: ordersData.labels,
            datasets: [{
                label: 'Orders',
                data: ordersData.values,
                backgroundColor: 'rgb(79, 70, 229)',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
});

// Handle status badge colors
document.querySelectorAll('.status-badge').forEach(badge => {
    const status = badge.textContent.toLowerCase();
    let bgColor = '';
    
    switch(status) {
        case 'pending':
            bgColor = 'bg-warning bg-opacity-10 text-warning';
            break;
        case 'processing':
            bgColor = 'bg-primary bg-opacity-10 text-primary';
            break;
        case 'completed':
            bgColor = 'bg-success bg-opacity-10 text-success';
            break;
        case 'cancelled':
            bgColor = 'bg-danger bg-opacity-10 text-danger';
            break;
    }
    
    badge.classList.add('px-2', 'py-1', 'rounded-full', 'text-sm', 'font-medium', ...bgColor.split(' '));
}); 
document.addEventListener('DOMContentLoaded', function() {
    // Handle avatar upload
    const avatarInput = document.getElementById('avatarInput');
    avatarInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('avatar', file);
            
            fetch('/api/user/avatar', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                } else {
                    toast.show(data.message || 'Error uploading avatar', 'error');
                }
            })
            .catch(error => {
                toast.show('Error uploading avatar', 'error');
                console.error('Error:', error);
            });
        }
    });
    
    // Handle profile form submission
    const profileForm = document.getElementById('profileForm');
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(profileForm);
        const userData = Object.fromEntries(formData.entries());
        
        fetch('/api/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                toast.show('Profile updated successfully');
            } else {
                toast.show(data.message || 'Error updating profile', 'error');
            }
        })
        .catch(error => {
            toast.show('Error updating profile', 'error');
            console.error('Error:', error);
        });
    });
    
    // Handle password form submission
    const passwordForm = document.getElementById('passwordForm');
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(passwordForm);
        const passwordData = Object.fromEntries(formData.entries());
        
        // Validate passwords match
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.show('New passwords do not match', 'error');
            return;
        }
        
        fetch('/api/user/password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(passwordData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                toast.show('Password updated successfully');
                passwordForm.reset();
            } else {
                toast.show(data.message || 'Error updating password', 'error');
            }
        })
        .catch(error => {
            toast.show('Error updating password', 'error');
            console.error('Error:', error);
        });
    });
    
    // Handle navigation item active state
    const navItems = document.querySelectorAll('.profile-nav-item');
    navItems.forEach(item => {
        if (window.location.pathname === item.getAttribute('href')) {
            item.classList.add('active');
        }
    });
}); 
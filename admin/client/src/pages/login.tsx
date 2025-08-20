//Your login handler (e.g., client/src/components/auth/LoginForm.tsx)

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) {
            // Handle login failure...
            throw new Error('Login failed');
        }

        const data = await response.json();
        const token = data.token; // The token from your server's response

        console.log('1. Token received from server:', token); // Log the token here

        // Save the token to local storage
        localStorage.setItem('authToken', token);

        console.log('2. Token stored in localStorage.'); // Confirm storage

        // Navigate to the dashboard...
        navigate('/admin/dashboard');

    } catch (error) {
        console.error('Login error:', error);
    }
};


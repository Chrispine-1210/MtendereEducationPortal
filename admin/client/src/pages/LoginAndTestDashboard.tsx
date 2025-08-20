//client/src/components/LoginAndTestDashboard.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginAndTestDashboard: React.FC = () => {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('password');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const navigate = useNavigate();

    const handleLoginAndTest = async () => {
        setLoading(true);
        setStatus('Attempting to log in...');
        console.log('1. Starting login and API test sequence.');

        try {
            // Step 1: Login
            const loginResponse = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!loginResponse.ok) {
                const errorData = await loginResponse.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const { token } = await loginResponse.json();
            console.log('2. ✅ Login successful. Received token:', token);

            // Step 2: Store the token
            localStorage.setItem('authToken', token);
            console.log('3. ✅ Token stored in localStorage.');

            // --- CRITICAL TEST ---
            // Step 3: Immediately retrieve the token and make a protected API call
            setStatus('Login successful. Now calling protected API...');
            const tokenFromStorage = localStorage.getItem('authToken');
            console.log('4. Token retrieved from localStorage for next request:', tokenFromStorage);

            if (!tokenFromStorage) {
                throw new Error('Token was not found in localStorage after saving it.');
            }

            const protectedResponse = await fetch('/api/admin/dashboard/stats', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${tokenFromStorage}`,
                },
            });

            if (!protectedResponse.ok) {
                const errorData = await protectedResponse.json();
                throw new Error(errorData.message || 'Protected API call failed');
            }

            const data = await protectedResponse.json();
            setStatus('Success! API responded correctly.');
            console.log('5. ✅ Protected API call successful. Received data:', data);

        } catch (error) {
            console.error('An error occurred during the test:', error);
            setStatus(`Error: ${error.message}`);
        } finally {
            setLoading(false);
            console.log('6. Test sequence completed.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="p-8 bg-gray-800 rounded-lg shadow-xl w-full max-w-md space-y-4">
                <h1 className="text-2xl font-bold text-center">Authentication Diagnostic</h1>
                <p className="text-sm text-center text-gray-400">
                    This component will log in and immediately test a protected API endpoint.
                    Check your browser console.
                </p>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleLoginAndTest}
                    disabled={loading}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors duration-200"
                >
                    {loading ? 'Testing...' : 'Login and Test API'}
                </button>

                {status && <p className="text-center text-sm mt-4">{status}</p>}
            </div>
        </div>
    );
};

export default LoginAndTestDashboard;


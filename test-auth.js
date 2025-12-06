const testAuth = async () => {
    try {
        const res = await fetch('http://localhost:3000/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: 'admin123' }),
        });

        const data = await res.json();
        console.log('Response status:', res.status);
        console.log('Response data:', data);

        if (res.ok && data.success) {
            console.log('✅ Login successful!');
        } else {
            console.log('❌ Login failed:', data.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

testAuth();

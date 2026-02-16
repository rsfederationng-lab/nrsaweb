
const testSettings = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/site-settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // In dev, the requireAdmin middleware allows everything with adminId: 1
            },
            body: JSON.stringify({
                key: 'interschool_video_url_test',
                value: 'https://youtube.com/test-' + Date.now()
            })
        });

        const data = await response.json();
        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Test failed:', error);
    }
};

testSettings();

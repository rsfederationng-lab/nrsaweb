
async function testPost() {
    const url = 'http://localhost:5000/api/affiliations';
    const payload = {
        name: "Test Org via Script",
        logoUrl: "",
        website: "",
        description: "Testing connection",
        order: 0
    };

    try {
        console.log(`POSTing to ${url}...`);
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log(`Status: ${res.status} ${res.statusText}`);

        const text = await res.text();
        try {
            const json = JSON.parse(text);
            console.log('Response JSON:', JSON.stringify(json, null, 2));
        } catch (e) {
            console.log('Response Text:', text);
        }

    } catch (e: any) {
        console.error('❌ Request failed:', e.message);
        if (e.cause) console.error('Cause:', e.cause);
    }
}

testPost();

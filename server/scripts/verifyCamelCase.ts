
async function verifyCamelCase() {
    const url = 'http://localhost:5000/api/affiliations';

    try {
        console.log(`GET requests to ${url}...`);
        const res = await fetch(url);
        const json = await res.json();

        console.log('Response sample:', JSON.stringify(json[0], null, 2));

        if (json.length > 0 && json[0].logoUrl) {
            console.log('✅ Success: logoUrl found (camelCase)');
        } else if (json.length > 0 && json[0].logo_url) {
            console.log('❌ Failure: logo_url found (snake_case)');
        } else {
            console.log('⚠️ No data or unexpected format');
        }

    } catch (e: any) {
        console.error('❌ Request failed:', e.message);
    }
}

verifyCamelCase();

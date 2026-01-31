
import { runSEOScan } from '../src/lib/scanners/seo-scanner';

async function test() {
    const url = process.argv[2] || 'https://gapintel.online';
    console.log(`Scanning ${url}...`);

    try {
        const result = await runSEOScan(url);
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

test();

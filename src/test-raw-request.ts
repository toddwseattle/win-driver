// test-raw-request.ts
import fetch from 'node-fetch';

async function testRawRequest() {
  const payload = {
    desiredCapabilities: {
      app: 'Microsoft.WindowsCalculator_8wekyb3d8bbwe!App',
      platformName: 'Windows'
    }
  };

  console.log('Sending:', JSON.stringify(payload, null, 2));

  const response = await fetch('http://127.0.0.1:4723/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  console.log('Response:', data);
}

testRawRequest().catch(console.error);
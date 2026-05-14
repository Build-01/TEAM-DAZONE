const http = require('http');

const doRequest = (options, data) => new Promise((resolve, reject) => {
  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => { body += chunk; });
    res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body }));
  });
  req.on('error', reject);
  if (data) req.write(data);
  req.end();
});

const run = async () => {
  try {
    const health = await doRequest({ hostname: 'localhost', port: 3000, path: '/health', method: 'GET' });
    console.log('HEALTH', health.statusCode);
    console.log(health.body);

    const payload = JSON.stringify({
      email: 'testuser@example.com',
      phone: '08021234567',
      password: 'TestPass123!',
      firstName: 'Test',
      lastName: 'User',
      userType: 'WORKER',
      location: 'Lagos',
      preferredLanguage: 'en',
    });

    const register = await doRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    }, payload);

    console.log('REGISTER', register.statusCode);
    console.log(register.body);
  } catch (error) {
    console.error('ERROR', error.message);
  }
};

run();

const request = require('supertest');
const app = require('./src/index');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { v4: uuidv4 } = require('uuid');

async function runE2ETest() {
  console.log('🚀 Starting End-to-End SabiWork Flow Test...');
  
  const testEmail = `e2e-${uuidv4()}@sabiwork.test`;
  const testPhone = `+234${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  
  try {
    // 1. Registration
    console.log('Step 1: Registering Worker...');
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: testEmail,
        phone: testPhone,
        password: 'Password123!',
        firstName: 'EndToEnd',
        lastName: 'Tester',
        location: 'Lagos',
        userType: 'WORKER'
      });
    if (regRes.status !== 201) throw new Error(`Registration failed: ${regRes.body.message}`);
    const userId = regRes.body.user.id;
    console.log('✅ Registration Successful');

    // 2. Login
    console.log('Step 2: Logging in...');
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'Password123!' });
    if (loginRes.status !== 200) throw new Error(`Login failed: ${loginRes.body.message}`);
    const token = loginRes.body.token;
    console.log('✅ Login Successful');

    // 3. Create Gig (as Client - Note: In our test setup we need a Client too, 
    // or just assume the user is a client for this test step)
    // For simplicity, let's register a client too.
    const clientEmail = `client-${uuidv4()}@sabiwork.test`;
    const clientPhone = `+234${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    await request(app).post('/api/auth/register').send({
      email: clientEmail,
      phone: clientPhone,
      password: 'ClientPassword123!',
      firstName: 'Client',
      lastName: 'User',
      location: 'Abuja',
      userType: 'EMPLOYER' // Using EMPLOYER as equivalent to CLIENT in our logic
    });
    const clientLoginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: clientEmail, password: 'ClientPassword123!' });
    const clientToken = clientLoginRes.body.token;
    const clientId = clientLoginRes.body.user.id;
    console.log('✅ Client Prepared');

    // 4. Create Gig
    console.log('Step 3: Client creating gig...');
    const gigRes = await request(app)
      .post('/api/gigs')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        title: 'E2E Test Gig',
        description: 'Test description',
        category: 'IT',
        location: 'Lagos',
        paymentAmount: 5000,
        duration: 1,
        startDate: new Date().toISOString()
      });
    if (gigRes.status !== 201) throw new Error(`Gig creation failed: ${gigRes.body.message}`);
    const gigId = gigRes.body.gig.id;
    console.log('✅ Gig Created');

    // 5. Worker Applies
    console.log('Step 4: Worker applying for gig...');
    const applyRes = await request(app)
      .post(`/api/gigs/${gigId}/apply`)
      .set('Authorization', `Bearer ${token}`);
    if (applyRes.status !== 200) throw new Error(`Application failed: ${applyRes.body.message}`);
    console.log('✅ Application Successful');

    // 6. Client Accepts
    console.log('Step 5: Client accepting application...');
    const acceptRes = await request(app)
      .post(`/api/gigs/${gigId}/accept`)
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ applicantId: userId });
    if (acceptRes.status !== 200) throw new Error(`Acceptance failed: ${acceptRes.body.message}`);
    console.log('✅ Application Accepted');

    // 7. Escrow (In our logic, payment triggers escrow/contract)
    console.log('Step 6: Simulating Escrow/Contract setup...');
    // In this simplified E2E, we assume the contract is now IN_PROGRESS
    // We'll check the gig status.
    const checkGigRes = await request(app)
      .get(`/api/gigs/${gigId}`)
      .set('Authorization', `Bearer ${token}`);
    if (checkGigRes.body.gig.status !== 'IN_PROGRESS') throw new Error('Gig not in progress');
    console.log('✅ Gig is IN_PROGRESS');

    // 8. Complete Gig
    console.log('Step 7: Worker completing gig...');
    const completeRes = await request(app)
      .post(`/api/gigs/${gigId}/complete`)
      .set('Authorization', `Bearer ${token}`);
    if (completeRes.status !== 200) throw new Error(`Completion failed: ${completeRes.body.message}`);
    console.log('✅ Gig Completed');

    // 9. Client Confirms
    console.log('Step 8: Client confirming completion...');
    const confirmRes = await request(app)
      .post(`/api/gigs/${gigId}/confirm`)
      .set('Authorization', `Bearer ${clientToken}`);
    if (confirmRes.status !== 200) throw new Error(`Confirmation failed: ${confirmRes.body.message}`);
    console.log('✅ Completion Confirmed');

    // 10. Verify Trust & Pension
    console.log('Step 9: Verifying Trust & Pension updates...');
    // We check the worker's profile
    const profileRes = await request(app)
      .get('/api/user/me')
      .set('Authorization', `Bearer ${token}`);
    
    if (profileRes.body.user.trustScore <= 0) throw new Error('Trust score did not increase!');
    console.log(`✅ Trust Score increased to: ${profileRes.body.user.trustScore}`);

    const pensionRes = await request(app)
      .get('/api/pension')
      .set('Authorization', `Bearer ${token}`);
    if (pensionRes.body.pensionBalance <= 0) throw new Error('Pension balance did not increase!');
    console.log(`✅ Pension Balance increased to: ₦${pensionRes.body.pensionBalance}`);

    console.log('
🎉 ALL TESTS PASSED! SABIWORK IS FUNCTIONAL.');

  } catch (error) {
    console.error('
❌ E2E TEST FAILED!');
    console.error(error.message);
    process.exit(1);
  } finally {
    // Cleanup
    console.log('Cleaning up test data...');
    await prisma.user.deleteMany({ where: { email: { contains: 'sabiwork.test' } } });
    await prisma.gig.deleteMany({ where: { title: 'E2E Test Gig' } });
    await prisma.$disconnect();
  }
}

runE2ETest();

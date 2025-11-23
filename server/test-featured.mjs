// Test script to verify the featured toggle fix
const testFeaturedToggle = async () => {
    const baseUrl = 'http://localhost:3001';

    console.log('🧪 Testing Featured Toggle Functionality\n');

    // Step 1: Fetch current menu items
    console.log('1️⃣ Fetching menu items...');
    const menuResponse = await fetch(`${baseUrl}/api/menu`);
    const menuItems = await menuResponse.json();

    console.log(`   Found ${menuItems.length} menu items`);
    console.log(`   First item: ${menuItems[0].name}`);
    console.log(`   Featured status: ${menuItems[0].featured} (type: ${typeof menuItems[0].featured})`);
    console.log(`   Available status: ${menuItems[0].available} (type: ${typeof menuItems[0].available})\n`);

    // Step 2: Login to get auth token
    console.log('2️⃣ Logging in...');
    const loginResponse = await fetch(`${baseUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'admin@oseiserwaa.com',
            password: 'admin123'
        })
    });
    const { token } = await loginResponse.json();
    console.log('   ✅ Logged in successfully\n');

    // Step 3: Update first item to be featured
    console.log('3️⃣ Setting first item as featured...');
    const updateResponse = await fetch(`${baseUrl}/api/menu/${menuItems[0].id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            ...menuItems[0],
            featured: true,
            image_url: menuItems[0].image
        })
    });

    if (updateResponse.ok) {
        console.log('   ✅ Update successful\n');
    } else {
        console.log('   ❌ Update failed:', await updateResponse.text());
        return;
    }

    // Step 4: Fetch again to verify persistence
    console.log('4️⃣ Fetching menu items again to verify...');
    const verifyResponse = await fetch(`${baseUrl}/api/menu`);
    const updatedItems = await verifyResponse.json();
    const updatedItem = updatedItems.find(item => item.id === menuItems[0].id);

    console.log(`   Item: ${updatedItem.name}`);
    console.log(`   Featured: ${updatedItem.featured} (type: ${typeof updatedItem.featured})`);
    console.log(`   Available: ${updatedItem.available} (type: ${typeof updatedItem.available})\n`);

    // Step 5: Verify results
    console.log('📊 RESULTS:');
    if (updatedItem.featured === true && typeof updatedItem.featured === 'boolean') {
        console.log('   ✅ Featured toggle works correctly!');
        console.log('   ✅ Data type is boolean (not integer)');
        console.log('   ✅ Value persists after fetch');
        console.log('\n🎉 ALL TESTS PASSED!');
    } else {
        console.log('   ❌ Featured toggle failed');
        console.log(`   Expected: true (boolean), Got: ${updatedItem.featured} (${typeof updatedItem.featured})`);
    }
};

testFeaturedToggle().catch(console.error);

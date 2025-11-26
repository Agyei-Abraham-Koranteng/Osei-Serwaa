
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gjozqkosvikfutwjanze.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqb3pxa29zdmlrZnV0d2phbnplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2OTg2ODAsImV4cCI6MjA3OTI3NDY4MH0.kxgcp8j01wzTauE1DrWhPRRsxzb3x-7t-mmunWhNFok';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTrackVisit() {
    console.log('Testing track_visit RPC...');

    const { error } = await supabase.rpc('track_visit', {
        p_user_agent: 'Debug Script',
        p_browser: 'Node.js',
        p_device_type: 'Server',
        p_os: 'Windows'
    });

    if (error) {
        console.error('RPC Error:', error);
        console.log('Likely cause: The track_visit function does not exist in the database. Please run the SQL migration script provided earlier.');
    } else {
        console.log('Success! track_visit RPC called successfully.');
    }
}

testTrackVisit();

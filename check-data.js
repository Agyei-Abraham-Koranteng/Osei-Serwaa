
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gjozqkosvikfutwjanze.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqb3pxa29zdmlrZnV0d2phbnplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2OTg2ODAsImV4cCI6MjA3OTI3NDY4MH0.kxgcp8j01wzTauE1DrWhPRRsxzb3x-7t-mmunWhNFok';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    console.log('--- Checking site_content ---');
    const { data: siteContent, error: scError } = await supabase
        .from('site_content')
        .select('*')
        .eq('key', 'site_visitors');

    if (scError) console.error('Error fetching site_content:', scError);
    else console.log('site_content:', JSON.stringify(siteContent, null, 2));

    console.log('\n--- Checking daily_visitors ---');
    const { data: dailyVisitors, error: dvError } = await supabase
        .from('daily_visitors')
        .select('*');

    if (dvError) console.error('Error fetching daily_visitors:', dvError);
    else console.log('daily_visitors:', JSON.stringify(dailyVisitors, null, 2));

    console.log('\n--- Checking visitor_logs ---');
    const { data: visitorLogs, error: vlError } = await supabase
        .from('visitor_logs')
        .select('*')
        .limit(5);

    if (vlError) console.error('Error fetching visitor_logs:', vlError);
    else console.log('visitor_logs (last 5):', JSON.stringify(visitorLogs, null, 2));
}

checkData();

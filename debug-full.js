
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gjozqkosvikfutwjanze.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqb3pxa29zdmlrZnV0d2phbnplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2OTg2ODAsImV4cCI6MjA3OTI3NDY4MH0.kxgcp8j01wzTauE1DrWhPRRsxzb3x-7t-mmunWhNFok';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugFull() {
    console.log('1. Calling track_visit...');
    const { error: rpcError } = await supabase.rpc('track_visit', {
        p_user_agent: 'Debug Full Script',
        p_browser: 'Node.js',
        p_device_type: 'Server',
        p_os: 'Windows'
    });

    if (rpcError) {
        console.error('RPC Error:', rpcError);
        return;
    }
    console.log('RPC Success.');

    console.log('2. Reading site_content...');
    const { data: sc, error: scError } = await supabase
        .from('site_content')
        .select('*')
        .eq('key', 'site_visitors');
    if (scError) console.error('site_content Error:', scError);
    else console.log('site_content:', JSON.stringify(sc, null, 2));

    console.log('3. Reading daily_visitors...');
    const { data: dv, error: dvError } = await supabase
        .from('daily_visitors')
        .select('*');
    if (dvError) console.error('daily_visitors Error:', dvError);
    else console.log('daily_visitors:', JSON.stringify(dv, null, 2));

    console.log('4. Reading visitor_logs...');
    const { data: vl, error: vlError } = await supabase
        .from('visitor_logs')
        .select('*')
        .order('visited_at', { ascending: false })
        .limit(1);
    if (vlError) console.error('visitor_logs Error:', vlError);
    else console.log('visitor_logs (latest):', JSON.stringify(vl, null, 2));
}

debugFull();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugSellerData() {
  try {
    console.log('=== DEBUGGING SELLER DATA ===');
    
    // Check items
    console.log('\n1. Checking items...');
    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select('id, name, user_id, seller')
      .eq('is_active', true)
      .is('deleted_at', null)
      .limit(3);

    if (itemsError) {
      console.error('Error fetching items:', itemsError);
    } else {
      console.log('Items found:', items.length);
      items.forEach((item, index) => {
        console.log(`Item ${index + 1}:`, {
          id: item.id,
          name: item.name,
          user_id: item.user_id,
          seller: item.seller
        });
      });
    }

    // Check seller profiles
    console.log('\n2. Checking seller profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('seller_profiles')
      .select('user_id, business_name, full_name, email')
      .limit(5);

    if (profilesError) {
      console.error('Error fetching seller profiles:', profilesError);
    } else {
      console.log('Seller profiles found:', profiles.length);
      profiles.forEach((profile, index) => {
        console.log(`Profile ${index + 1}:`, {
          user_id: profile.user_id,
          business_name: profile.business_name,
          full_name: profile.full_name,
          email: profile.email
        });
      });
    }

    // Check if there are any matches
    if (items && profiles) {
      console.log('\n3. Checking for matches...');
      const userIds = items.map(item => item.user_id).filter(Boolean);
      const profileUserIds = profiles.map(profile => profile.user_id);
      
      console.log('Item user_ids:', userIds);
      console.log('Profile user_ids:', profileUserIds);
      
      const matches = userIds.filter(id => profileUserIds.includes(id));
      console.log('Matching user_ids:', matches);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

debugSellerData();

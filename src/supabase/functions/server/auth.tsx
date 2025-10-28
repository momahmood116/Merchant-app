import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Generate OTP and store it
export async function generateOTP(phoneNumber: string): Promise<string> {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiryTime = Date.now() + 5 * 60 * 1000; // 5 minutes
  
  await kv.set(`otp:${phoneNumber}`, JSON.stringify({ otp, expiryTime }));
  
  console.log(`Generated OTP for ${phoneNumber}: ${otp}`);
  return otp;
}

// Verify OTP
export async function verifyOTP(phoneNumber: string, otp: string): Promise<boolean> {
  const storedData = await kv.get(`otp:${phoneNumber}`);
  
  if (!storedData) {
    return false;
  }
  
  const { otp: storedOTP, expiryTime } = JSON.parse(storedData);
  
  if (Date.now() > expiryTime) {
    await kv.del(`otp:${phoneNumber}`);
    return false;
  }
  
  if (storedOTP === otp) {
    await kv.del(`otp:${phoneNumber}`);
    return true;
  }
  
  return false;
}

// Create user account
export async function createUser(phoneNumber: string, fullName: string, password: string) {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      phone: phoneNumber,
      password: password,
      user_metadata: { 
        full_name: fullName,
        phone_number: phoneNumber 
      },
      // Automatically confirm the user's phone since an SMS server hasn't been configured.
      phone_confirm: true
    });

    if (error) throw error;

    // Store additional user data in KV
    await kv.set(`user:${data.user.id}`, JSON.stringify({
      id: data.user.id,
      phoneNumber,
      fullName,
      createdAt: new Date().toISOString()
    }));

    return { success: true, userId: data.user.id };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Authenticate user
export async function signIn(phoneNumber: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      phone: phoneNumber,
      password: password,
    });

    if (error) throw error;

    return {
      success: true,
      accessToken: data.session.access_token,
      userId: data.user.id
    };
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

// Reset password
export async function resetPassword(phoneNumber: string, newPassword: string) {
  try {
    // Get user by phone number
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) throw listError;
    
    const user = users.users.find(u => u.phone === phoneNumber);
    
    if (!user) {
      throw new Error('User not found');
    }

    const { error } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
}

// Get user by access token
export async function getUserByToken(accessToken: string) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      throw new Error('Unauthorized');
    }

    // Get additional user data from KV
    const userData = await kv.get(`user:${user.id}`);
    
    return {
      success: true,
      user: userData ? JSON.parse(userData) : { id: user.id }
    };
  } catch (error) {
    console.error('Error getting user by token:', error);
    throw error;
  }
}

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import * as auth from "./auth.tsx";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const app = new Hono();

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-59eb6dfe/health", (c) => {
  return c.json({ status: "ok" });
});

// Send OTP
app.post("/make-server-59eb6dfe/auth/send-otp", async (c) => {
  try {
    const { phoneNumber } = await c.req.json();
    
    if (!phoneNumber) {
      return c.json({ error: 'Phone number is required' }, 400);
    }
    
    const otp = await auth.generateOTP(phoneNumber);
    
    return c.json({ 
      success: true, 
      message: 'OTP sent successfully',
      otp // In production, this would be sent via SMS
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return c.json({ error: 'Failed to send OTP' }, 500);
  }
});

// Verify OTP
app.post("/make-server-59eb6dfe/auth/verify-otp", async (c) => {
  try {
    const { phoneNumber, otp } = await c.req.json();
    
    if (!phoneNumber || !otp) {
      return c.json({ error: 'Phone number and OTP are required' }, 400);
    }
    
    const isValid = await auth.verifyOTP(phoneNumber, otp);
    
    if (!isValid) {
      return c.json({ error: 'Invalid or expired OTP' }, 400);
    }
    
    return c.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return c.json({ error: 'Failed to verify OTP' }, 500);
  }
});

// Sign up
app.post("/make-server-59eb6dfe/auth/signup", async (c) => {
  try {
    const { phoneNumber, fullName, password } = await c.req.json();
    
    if (!phoneNumber || !fullName || !password) {
      return c.json({ error: 'All fields are required' }, 400);
    }
    
    const result = await auth.createUser(phoneNumber, fullName, password);
    
    return c.json(result);
  } catch (error) {
    console.error('Error during sign up:', error);
    return c.json({ error: 'Failed to create account. User may already exist.' }, 500);
  }
});

// Sign in
app.post("/make-server-59eb6dfe/auth/signin", async (c) => {
  try {
    const { phoneNumber, password } = await c.req.json();
    
    if (!phoneNumber || !password) {
      return c.json({ error: 'Phone number and password are required' }, 400);
    }
    
    const result = await auth.signIn(phoneNumber, password);
    
    return c.json(result);
  } catch (error) {
    console.error('Error during sign in:', error);
    return c.json({ error: 'Invalid credentials' }, 401);
  }
});

// Reset password
app.post("/make-server-59eb6dfe/auth/reset-password", async (c) => {
  try {
    const { phoneNumber, newPassword } = await c.req.json();
    
    if (!phoneNumber || !newPassword) {
      return c.json({ error: 'Phone number and new password are required' }, 400);
    }
    
    const result = await auth.resetPassword(phoneNumber, newPassword);
    
    return c.json(result);
  } catch (error) {
    console.error('Error resetting password:', error);
    return c.json({ error: 'Failed to reset password' }, 500);
  }
});

// Get current user
app.get("/make-server-59eb6dfe/auth/me", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const result = await auth.getUserByToken(accessToken);
    
    return c.json(result);
  } catch (error) {
    console.error('Error getting user:', error);
    return c.json({ error: 'Unauthorized' }, 401);
  }
});

// Save merchant application
app.post("/make-server-59eb6dfe/applications", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { user } = await auth.getUserByToken(accessToken);
    const applicationData = await c.req.json();
    
    const applicationId = `app:${user.id}:${Date.now()}`;
    
    await kv.set(applicationId, JSON.stringify({
      ...applicationData,
      userId: user.id,
      status: 'pending',
      submittedAt: new Date().toISOString()
    }));
    
    return c.json({ success: true, applicationId });
  } catch (error) {
    console.error('Error saving application:', error);
    return c.json({ error: 'Failed to save application' }, 500);
  }
});

// Get merchant applications
app.get("/make-server-59eb6dfe/applications", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { user } = await auth.getUserByToken(accessToken);
    const applications = await kv.getByPrefix(`app:${user.id}:`);
    
    return c.json({ 
      success: true, 
      applications: applications.map(app => JSON.parse(app)) 
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return c.json({ error: 'Failed to fetch applications' }, 500);
  }
});

// Upload document endpoint (storing base64 in KV for demo)
app.post("/make-server-59eb6dfe/documents/upload", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { user } = await auth.getUserByToken(accessToken);
    const { fileName, fileData, fileType } = await c.req.json();
    
    const documentId = `doc:${user.id}:${Date.now()}:${fileName}`;
    
    await kv.set(documentId, JSON.stringify({
      fileName,
      fileData,
      fileType,
      userId: user.id,
      uploadedAt: new Date().toISOString()
    }));
    
    return c.json({ success: true, documentId });
  } catch (error) {
    console.error('Error uploading document:', error);
    return c.json({ error: 'Failed to upload document' }, 500);
  }
});

Deno.serve(app.fetch);
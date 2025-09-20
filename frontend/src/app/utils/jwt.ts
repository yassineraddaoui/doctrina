// Utility function to decode JWT token and extract user email
export function getUserEmailFromToken(token: string): string | null {
  try {
    // JWT tokens have 3 parts separated by dots: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT token format');
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decode base64
    const decodedPayload = atob(paddedPayload);
    
    // Parse JSON
    const payloadObj = JSON.parse(decodedPayload);
    
    // Extract email from 'sub' field
    return payloadObj.sub || null;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
}

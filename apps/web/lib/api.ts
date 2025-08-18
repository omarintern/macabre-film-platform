// Simple API client for testing backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function testApiConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: `API connection successful: ${data.message}`,
      };
    } else {
      return {
        success: false,
        message: `API responded with status: ${response.status}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Failed to connect to API: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

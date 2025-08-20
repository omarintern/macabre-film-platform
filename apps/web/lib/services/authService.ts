interface SignupRequest {
  email: string;
  password: string;
}

interface SignupResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const authService = {
  async signup(data: SignupRequest): Promise<SignupResponse> {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: SignupResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Signup request failed:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.',
      };
    }
  },
};

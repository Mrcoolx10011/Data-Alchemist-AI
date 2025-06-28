// Authentication service for handling user authentication
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthService {
  login: (provider: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  getCurrentUser: () => AuthUser | null;
}

// Mock authentication service for development
class MockAuthService implements AuthService {
  private currentUser: AuthUser | null = null;

  async login(provider: string): Promise<AuthUser> {
    // Mock login implementation
    console.log(`Logging in with provider: ${provider}`);
    const mockUser: AuthUser = {
      id: '1',
      name: 'Kiran Mehta',
      email: 'kiran100112@gmail.com',
      avatar: undefined
    };
    
    this.currentUser = mockUser;
    return mockUser;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }
}

export const authService = new MockAuthService();

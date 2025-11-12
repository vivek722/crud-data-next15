import {create} from 'zustand'
import {devtools} from 'zustand/middleware'

interface AuthState{
    user: any | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}
interface AuthActions {
    setUser: (user: any) => void;
    setToken: (token: string) => void;
    clearAuth: () => void;
    login: (userData: any, token: string) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
    getAuthToken: () => string | null;
  }
  export type AuthStore = AuthState & AuthActions;
  export const useAuthStore = create<AuthStore>()(
    devtools((set, get) => {
        return {
            setUser: (user) => set({ user }),
            setToken: (token) => set({ token }),
            clearAuth: () => set({ user: null, token: null }),
            
            login: (userData, token) => {
              set({ user: userData, token });
              // Save to localStorage
              if (typeof window !== 'undefined') {
                localStorage.setItem('auth', JSON.stringify({ user: userData, token }));
              }
            },
            
            logout: () => {
              set({ user: null, token: null });
              if (typeof window !== 'undefined') {
                localStorage.removeItem('auth');
              }
            },
            
            isAuthenticated: () => {
              const { token } = get();
              return !!token;
            },
            
            getAuthToken: () => {
              const { token } = get();
              return token;
            }
          };
        })
    )


        
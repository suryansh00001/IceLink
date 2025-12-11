import { createContext , useContext ,useState , useEffect } from "react" ;
import axiosInstance from "../api/axiosInstance";

type userType = {
    _id: string;
    username: string;
    email: string;
    avatarUrl?: string;
} | null;

type authContextType = {
    user: userType;
    setUser: (user: userType) => void;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<authContextType>({
    user: null,
    setUser: () => {},
    loading: true,
    login: async () => {},
    logout: async () => {},
    register: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<userType>(null);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get("/users/me");
                setUser(response.data.user);
            }
            catch (error) {
                setUser(null);
            }
            finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const register = async (username: string, email: string, password: string) => {
        await axiosInstance.post("/users/register", { username, email, password });
        setUser(null);
    }


    const login = async (email: string, password: string) => {
        const response = await axiosInstance.post("/users/login", { email, password });
        
        if (response.data.data?.accessToken) {
            localStorage.setItem("token", response.data.data.accessToken);
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.accessToken}`;
        }
        setUser(response.data.data.user);
    }

    const logout = async () => {
        await axiosInstance.post("/users/logout");
        localStorage.removeItem("token");
        delete axiosInstance.defaults.headers.common['Authorization'];
        setUser(null);
    }
    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
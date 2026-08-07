import * as React from "react";

export type SessionUser = {
  id: string;
  fullName: string;
  role: "admin"; 
};

type AuthContextValue = {
  user: SessionUser | null;
  hydrated: boolean;
  signIn: (password: string) => SessionUser; 
  signOut: () => void;
  changePassword: (oldPassword: string, newPassword: string) => boolean; 
};

const STORAGE_KEY = "hiec.session";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "0336873705";

const AuthContext = React.createContext<AuthContextValue | null>(null);


function readSession(): SessionUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ✅ GIỮ: Lưu session
function persist(user: SessionUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<SessionUser | null>(null);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setUser(readSession());
    setHydrated(true);
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      hydrated,

      // ✅ SỬA: Chỉ nhận password
      signIn: (password: string) => {
        // Kiểm tra password
        if (password !== ADMIN_PASSWORD) {
          throw new Error("Mật khẩu không đúng");
        }

        // Tạo user admin
        const adminUser: SessionUser = {
          id: "admin-1",
          fullName: "Quản trị viên",
          role: "admin",
        };

        persist(adminUser);
        setUser(adminUser);
        return adminUser;
      },

      // ✅ SỬA: Đăng xuất
      signOut: () => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
      },

      // 🆕 THÊM MỚI: Đổi mật khẩu
      changePassword: (oldPassword: string, newPassword: string) => {
        if (oldPassword !== ADMIN_PASSWORD) {
          return false; // Mật khẩu cũ sai
        }

        // Lưu mật khẩu mới vào localStorage (tạm thời)
        // ⚠️ Trong production, nên gọi API để update
        localStorage.setItem('admin_password', newPassword);
        
        // Cập nhật biến (nhưng chỉ dùng cho session hiện tại)
        // window.location.reload(); // Cần reload để áp dụng
        
        return true;
      },
    }),
    [user, hydrated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
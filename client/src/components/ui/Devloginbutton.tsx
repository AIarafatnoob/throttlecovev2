
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

const DevLoginButton = () => {
  const { setUser } = useAuth();
  const [, navigate] = useLocation();

  const handleDevLogin = () => {
    const fakeUser = {
      id: "dev-001",
      fullName: "Developer User",
      email: "dev@example.com",
    };

    setUser(fakeUser);
    navigate("/garage");
  };

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={handleDevLogin}
        className="mt-4 w-full bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white px-4 py-2 rounded-full font-semibold shadow transition relative"
      >
        <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold">
          DEV
        </span>
        Quick Dev Login
      </button>
      <p className="text-xs text-gray-500 text-center mt-1">
        Development mode only
      </p>
    </div>
  );
};

export default DevLoginButton;

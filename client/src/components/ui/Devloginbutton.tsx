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

    setUser(fakeUser); // Zustand + localStorage (from earlier steps)
    navigate("/garage"); // Redirect after login
  };

  return (
    <button
      onClick={handleDevLogin}
      className="mt-4 w-full bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white px-4 py-2 rounded-full font-semibold shadow transition"
    >
      Quick Dev Login
    </button>
  );
};

export default DevLoginButton;
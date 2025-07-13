
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

const DevLoginButton = () => {
  const { setUser } = useAuth();
  const [, navigate] = useLocation();

  const handleDevLogin = () => {
    const arafatUser = {
      id: 1,
      username: "arafat_dev",
      fullName: "Arafat",
      email: "arafat@throttlecove.dev",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      createdAt: new Date(),
      password: "" // Not used in frontend
    };

    setUser(arafatUser);
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

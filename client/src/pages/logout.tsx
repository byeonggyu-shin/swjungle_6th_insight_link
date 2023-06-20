import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
// Component
import NavBar from "@/features/Dashboard/components/NavBar";
import { Wrapper } from "@/styles/wrapper";
import GoogleLogoutBtn from "@/features/User/GoogleLogoutBtn";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleLogout = () => {
    alert("Logout successful!");
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div>
      <NavBar />
      <Wrapper>
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="container flex flex-col items-end max-w-md mx-auto">
            {/* Updated class */}
          </div>
          <div className="flex justify-end mt-4">
            {typeof window !== "undefined" && sessionData?.user && token ? (
              <GoogleLogoutBtn router={router} />
            ) : token ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 mr-4 font-bold text-white bg-black rounded"
              >
                로그아웃
              </button>
            ) : null}
          </div>
        </div>
      </Wrapper>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import { useTheme } from "next-themes";
import Link from "next/link";

import { GET } from "@/axios/GET";
import getToken from "@/axios/getToken";
// Components
import UserModal from "@/features/User/UserModal";
// Assets
import { AiTwotoneBell } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import { BsShare, BsSunFill, BsFillMoonFill } from "react-icons/bs";

import html2canvas from "html2canvas";

const NavBarContainer = tw.div`
  flex flex-row items-center justify-between p-7 fixed top-0 w-full z-50
`;

export default function NavBar() {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const [userProfile, setUserProfile] = useState("");
  const [isUserModalOpen, setUserModalOpen] = useState(false);

  const getProfileImg = async () => {
    const token = getToken();
    const response = await GET("user/profile", token);
    if (response) {
      console.log(response);
      setUserProfile(response.userProfile);
    }
  };

  useEffect(() => {
    getProfileImg();
  }, []);

  const handleUserIconClick = () => {
    setUserModalOpen(true);
  };

  const closeModal = () => {
    setUserModalOpen(false);
  };

  const CategoryLink = tw.p`
    text-xl font-bold hover:underline underline-offset-8 active:text-yellow-400 mr-4
  `;

  const handleShareIconClick = () => {
    html2canvas(document.documentElement).then((canvas) => {
      canvas.toBlob((blob) => {
        if (blob !== null) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const imageUrl = reader.result;
            console.log("Image URL:", imageUrl);

            // Use Kakao.Link.sendDefault to send the image URL to KakaoTalk
            if (window.Kakao) {
              window.Kakao.Link.sendDefault({
                objectType: 'text',
                text:
                  '나의 그래프를 확인해봐요.',
                link: {
                  mobileWebUrl: 'http://localhost:3000/dashboard/'+21,
                  webUrl: 'http://localhost:3000/dashboard/'+21,
                },
              });
            }
          };
          reader.readAsDataURL(blob);
        } else {
          console.log("Failed to capture canvas image.");
        }
      });
    });
  };


  return (
    <NavBarContainer>
      <Link href="/dashboard">
        <p className="text-3xl font-extrabold">insightLINK</p>
      </Link>
      <div className="flex flex-row justify-start w-2/3 ml-4">
        <Link href="/social">
          <CategoryLink>소셜</CategoryLink>
        </Link>
      </div>
      <div className="flex flex-row items-center justify-between w-1/6">
        <BsShare size={30} onClick={handleShareIconClick} />
        <AiTwotoneBell size={30} />
        {userProfile ? (
          <img
            src={userProfile}
            className="w-10 h-10 rounded-full"
            onClick={handleUserIconClick}
          />
        ) : (
          <BiUser size={30} onClick={handleUserIconClick} />
        )}
        {currentTheme === "dark" ? (
          <BsSunFill size={30} onClick={() => setTheme("light")} />
        ) : (
          <BsFillMoonFill size={30} onClick={() => setTheme("dark")} />
        )}
      </div>
      {isUserModalOpen && <UserModal closeModal={closeModal} />}
    </NavBarContainer>
  );
}

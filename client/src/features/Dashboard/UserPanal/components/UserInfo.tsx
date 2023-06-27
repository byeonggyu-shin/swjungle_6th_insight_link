import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { User_Info_Api } from "@/axios/dashBoardApi";
// components
import FollowBtn from "@/features/Dashboard/UserPanal/components/FollowBtn";
// types
import { UserInfo } from "@/types/dashborad.types";

export default function UserInfo() {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const router = useRouter();

  useEffect(() => {
    const getUserInfoData = async () => {
      const userid = Array.isArray(router.query.userid)
        ? router.query.userid[0]
        : router.query.userid;

      const response = await User_Info_Api(userid);
      setUserInfo(response);
      console.log("userInfo data: ", response);
    };
    getUserInfoData();
  }, []);

  return (
    <>
      <div className="flex flex-col">
        <h1 className="text-3xl">{userInfo?.userName}</h1>
        <div className="flex">
          <div className="p-2">
            <div>태그 수</div>
            <div>+{userInfo?.tagCnt}</div>
          </div>
          <div className="p-2">
            <div>카드 수</div>
            <div>+{userInfo?.cardCnt}</div>
          </div>
          <div className="p-2">
            <div>친구 수</div>
            <div>+{userInfo?.followCnt}</div>
          </div>

          <FollowBtn />
        </div>
      </div>
    </>
  );
}
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "../common/Sidebar";
import authUtils from "../../utils/authUtils";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/features/userSlice";

const AppLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    //JWTを持っているか確認
    const checkAuth = async () => {
      //認証チェック
      const user = await authUtils.isAuthenticated();
      if (!user) {
        navigate("/login");
      } else {
        //ユーザーを保存する
        dispatch(setUser(user));
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 1, width: "max-content", marginLeft: "270px" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;

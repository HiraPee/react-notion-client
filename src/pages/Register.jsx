import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";

const Register = () => {
  const navigate = useNavigate();

  const [userNameErrText, setUserNameErrText] = useState("");
  const [passwordErrText, setPasswordErrText] = useState("");
  const [confirmErrText, setConfirmErrText] = useState("");
  const [loading, setLoading] = useState(false);

  let error = false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log("動いたよ");
    setUserNameErrText("");
    setPasswordErrText("");
    setConfirmErrText("");
    //入力欄の文字列取得
    const data = new FormData(e.target);
    const username = data.get("username").trim();
    const password = data.get("password").trim();
    const confirmPassword = data.get("confirmPassword").trim();

    if (username === "") {
      error = true;
      setUserNameErrText("名前を入力してください");
    }
    if (password === "") {
      error = true;
      setPasswordErrText("パスワードを入力してください");
    }
    if (confirmPassword === "") {
      error = true;
      setConfirmErrText("確認用パスワードを入力してください");
    }
    if (password !== confirmPassword) {
      error = true;
      setConfirmErrText("パスワードと確認用パスワードが異なっています.確認してください");
    }

    if (error) {
      return;
    }

    setLoading(true);

    //新規登録のAPIを使う
    try {
      const res = await authApi.register({ username, password, confirmPassword });
      //console.log(res.token);
      localStorage.setItem("token", res.token);
      setLoading(false);
      navigate("/");
    } catch (err) {
      const errors = err.data.errors;
      console.log(err);
      errors.forEach((e) => {
        if (e.param === "username") {
          setUserNameErrText(e.msg);
        }
        if (e.param === "password") {
          setPasswordErrText(e.msg);
        }
        if (e.param === "confirmPassword") {
          setConfirmErrText(e.msg);
        }
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField fullWidth id="username" label="お名前" margin="normal" name="username" required helperText={userNameErrText} error={userNameErrText !== ""} disabled={loading} />
        <TextField fullWidth id="password" label="パスワード" margin="normal" name="password" required type="password" helperText={passwordErrText} error={passwordErrText !== ""} disabled={loading} />
        <TextField fullWidth id="confirmPassword" label="確認用パスワード" margin="normal" name="confirmPassword" required type="password" helperText={confirmErrText} error={confirmErrText !== ""} disabled={loading} />
        <LoadingButton sx={{ mt: 3, mb: 2 }} fullWidth type="submit" loading={loading} color="primary" variant="outlined">
          アカウント作成
        </LoadingButton>
      </Box>
      <Button component={Link} to="/Login">
        すでにアカウントを持っていますか？ログイン
      </Button>
    </>
  );
};

export default Register;

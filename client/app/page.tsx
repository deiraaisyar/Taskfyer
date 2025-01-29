"use client";
import { useUserContext } from "@/context/userContext";
import useRedirect from "@/hooks/useUserRedirect";
import { useState } from "react";
import ChangePasswordForm from "./Components/auth/ChangePasswordForm/ChangePasswordForm";

export default function Home() {
  useRedirect("/login");
  const {
    logoutUser,
    user,
    handlerUserInput,
    userState,
    updateUser,
    emailVerification,
    allUsers,
    deleteUser,
  } = useUserContext();
  const { name, photo, isVerified, bio } = user;

  // state
  const [isOpen, setIsOpen] = useState(false);

  // function
  const myToggle = () => {
    setIsOpen(!isOpen);
  };

  return <main></main>;
}

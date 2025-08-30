"use client";
import { useCurrentUser } from "@/components/CurrentUserContext";

export default function Dashboard() {
  const { currentUser } = useCurrentUser();

  return <div>Dashboard {currentUser?.email}</div>;
}

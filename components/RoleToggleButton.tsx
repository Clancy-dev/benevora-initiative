"use client";

import { updateUserRole } from "@/actions/activity-actions";
import { useTransition } from "react";


export default function RoleToggleButton({
  userId,
  role,
}: {
  userId: string;
  role: "ADMIN" | "USER";
}) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        await updateUserRole(userId, role === "USER" ? "ADMIN" : "USER");
        window.location.reload();
      } catch (err) {
        console.error(err);
        alert("Failed to update role");
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={role === "USER" ? "text-green-600" : "text-red-600"}
    >
      {isPending
        ? "Updating..."
        : role === "USER"
        ? "Promote to Admin"
        : "Demote to User"}
    </button>
  );
}
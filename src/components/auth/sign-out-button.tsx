import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/store/auth-store";

/** Sign Out button + centered confirmation popup (Docs-BA-3 "Sign Out"). */
export function SignOutButton() {
  const [open, setOpen] = React.useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <Button variant="destructive" size="lg" onClick={() => setOpen(true)}>
        <LogOut /> Đăng xuất
      </Button>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Đăng xuất"
        description="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản HIEC?"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="shimmer"
              onClick={() => {
                signOut();
                setOpen(false);
                toast.success("Đã đăng xuất khỏi tài khoản");
                navigate({ to: "/" });
              }}
            >
              Confirm
            </Button>
          </>
        }
      />
    </>
  );
}

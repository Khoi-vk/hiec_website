import { Button } from "@/components/ui/button";

/** Google sign-in button (icon + label) per Docs-BA-3 "Sign in bằng social account". */
export function GoogleButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <Button type="button" variant="outline" size="lg" className="w-full" onClick={onClick}>
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <path
          fill="#EA4335"
          d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1A6.2 6.2 0 1 1 12 5.8c1.6 0 2.9.6 3.8 1.5l2.7-2.6A9.7 9.7 0 0 0 12 2a10 10 0 1 0 0 20c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.3-.2-2H12Z"
        />
      </svg>
      {label}
    </Button>
  );
}

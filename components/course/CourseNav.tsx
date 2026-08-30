import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { Logo } from "@/components/Logo";
import { ReactNode } from "react";

export function CourseNav({
  back,
  extra,
}: {
  back?: { href: string; label: string };
  extra?: ReactNode;
}) {
  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-5 py-3"
      style={{
        background:     "rgba(10,10,11,0.90)",
        backdropFilter: "blur(12px)",
        borderBottom:   "1px solid var(--color-navy-700)",
        minHeight:      "49px",
      }}
    >
      <Link href="/course" style={{ textDecoration: "none" }}>
        <Logo height={20} />
      </Link>
      <div className="flex items-center gap-5">
        {extra}
        {back && (
          <a
            href={back.href}
            className="hidden sm:inline text-xs transition-colors"
            style={{ color: "var(--color-text-muted)", textDecoration: "none" }}
          >
            {back.label}
          </a>
        )}
        <LogoutButton />
      </div>
    </header>
  );
}

"use client";

export default function LogoutButton() {
  return (
    <form action="/api/auth/logout" method="POST">
      <button
        type="submit"
        className="text-sm px-4 py-2 rounded-lg transition-colors"
        style={{ color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}
        onMouseEnter={e => (e.currentTarget.style.color = "var(--color-text-primary)")}
        onMouseLeave={e => (e.currentTarget.style.color = "var(--color-text-secondary)")}
      >
        Sign out
      </button>
    </form>
  );
}

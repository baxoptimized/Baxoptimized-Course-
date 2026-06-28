import React, { ReactNode } from "react";
import type { MDXComponents } from "mdx/types";

import { Callout, emojiToCalloutType } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { Checkbox } from "./Checkbox";
import { DiagramPlaceholder } from "./DiagramPlaceholder";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { PromptCard } from "./PromptCard";
import { StyledTable, Th, Td } from "./StyledTable";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Extract the leading text from MDX blockquote children for emoji detection. */
function blockquoteLeadText(children: ReactNode): string {
  const arr = React.Children.toArray(children);
  const first = arr[0];
  if (!first) return "";
  if (typeof first === "string") return first;
  if (React.isValidElement<{ children?: ReactNode }>(first) && first.props.children) {
    return blockquoteLeadText(first.props.children);
  }
  return "";
}

/** Detect leading emoji from an h2/h3 string child and split it off. */
function splitHeadingEmoji(children: ReactNode): { emoji: string; rest: ReactNode } {
  const arr = React.Children.toArray(children);
  if (arr.length === 0) return { emoji: "", rest: children };
  const first = arr[0];
  if (typeof first !== "string") return { emoji: "", rest: children };
  const m = first.match(/^(\p{Emoji_Presentation}|\p{Emoji}️)\s*/u);
  if (!m) return { emoji: "", rest: children };
  const emoji = m[1];
  const rest = [first.slice(m[0].length), ...arr.slice(1)];
  return { emoji, rest: rest.length === 1 ? rest[0] : rest };
}

// ── Component map ─────────────────────────────────────────────────────────────

export const mdxComponents: MDXComponents = {
  // ── Custom JSX components used by preprocessMdx ──────────────────────────
  DiagramPlaceholder,
  MediaPlaceholder,
  PromptCard,
  Checkbox,
  Callout,

  // ── Blockquote → smart callout routing ───────────────────────────────────
  blockquote: ({ children }) => {
    const lead = blockquoteLeadText(children as ReactNode);
    const type = emojiToCalloutType(lead);
    if (type) return <Callout type={type}>{children as ReactNode}</Callout>;
    return (
      <blockquote
        data-reveal="true"
        className="my-6 border-l-4 pl-5 italic"
        style={{ borderColor: "var(--color-navy-600)", color: "var(--color-text-muted)" }}
      >
        {children as ReactNode}
      </blockquote>
    );
  },

  // ── Code blocks ───────────────────────────────────────────────────────────
  pre: ({ children }) => <>{children}</>,
  code: ({ className, children }) => (
    <CodeBlock className={className}>{children as ReactNode}</CodeBlock>
  ),

  // ── Headings ──────────────────────────────────────────────────────────────
  h1: ({ children }) => (
    <h1
      data-reveal="true"
      className="mt-10 mb-4 text-3xl font-bold tracking-tight"
      style={{ color: "var(--color-text-primary)" }}
    >
      {children as ReactNode}
    </h1>
  ),

  h2: ({ children }) => {
    const { emoji, rest } = splitHeadingEmoji(children as ReactNode);
    return (
      <div data-reveal="true" className="mt-14 mb-6">
        {emoji && (
          <span
            className="mb-2 block text-3xl leading-none"
            style={{ opacity: 0.75 }}
            aria-hidden="true"
          >
            {emoji}
          </span>
        )}
        <h2
          className="text-2xl font-bold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          {rest as ReactNode}
        </h2>
        {/* Gradient rule under each section header */}
        <div
          className="mt-4 h-px"
          style={{
            background:
              "linear-gradient(to right, var(--color-accent) 0%, rgba(79,124,247,0.15) 40%, transparent 100%)",
          }}
        />
      </div>
    );
  },

  h3: ({ children }) => {
    const { emoji, rest } = splitHeadingEmoji(children as ReactNode);
    return (
      <h3
        data-reveal="true"
        className="mt-8 mb-3 flex items-center gap-2 text-lg font-semibold"
        style={{ color: "var(--color-text-primary)" }}
      >
        {emoji && <span aria-hidden="true">{emoji}</span>}
        {rest as ReactNode}
      </h3>
    );
  },

  // ── Body text ─────────────────────────────────────────────────────────────
  p: ({ children }) => (
    <p
      data-reveal="true"
      className="my-4 leading-7"
      style={{ color: "var(--color-text-secondary)" }}
    >
      {children as ReactNode}
    </p>
  ),

  // ── Lists ─────────────────────────────────────────────────────────────────
  ul: ({ children }) => (
    <ul
      data-reveal="true"
      className="my-4 space-y-1.5 pl-5"
      style={{ listStyleType: "disc", color: "var(--color-text-secondary)" }}
    >
      {children as ReactNode}
    </ul>
  ),

  ol: ({ children }) => (
    <ol
      data-reveal="true"
      className="my-4 space-y-1.5 pl-5"
      style={{ listStyleType: "decimal", color: "var(--color-text-secondary)" }}
    >
      {children as ReactNode}
    </ol>
  ),

  li: ({ children }) => (
    <li className="leading-7 pl-1">{children as ReactNode}</li>
  ),

  // ── Tables ────────────────────────────────────────────────────────────────
  table: ({ children }) => <StyledTable>{children as ReactNode}</StyledTable>,
  thead: ({ children }) => (
    <thead>{children as ReactNode}</thead>
  ),
  tbody: ({ children }) => (
    <tbody>{children as ReactNode}</tbody>
  ),
  tr: ({ children }) => (
    <tr
      className="transition-colors"
      style={{ background: "transparent" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(79,124,247,0.04)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      {children as ReactNode}
    </tr>
  ),
  th: ({ children }) => <Th>{children as ReactNode}</Th>,
  td: ({ children }) => <Td>{children as ReactNode}</Td>,

  // ── Inline elements ───────────────────────────────────────────────────────
  a: ({ href, children }) => (
    <a
      href={href}
      className="underline underline-offset-4 transition-colors"
      style={{ color: "var(--color-accent)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.color = "var(--color-accent-hover)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.color = "var(--color-accent)";
      }}
    >
      {children as ReactNode}
    </a>
  ),

  strong: ({ children }) => (
    <strong className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
      {children as ReactNode}
    </strong>
  ),

  em: ({ children }) => (
    <em className="italic" style={{ color: "var(--color-text-secondary)" }}>
      {children as ReactNode}
    </em>
  ),

  // ── Dividers ──────────────────────────────────────────────────────────────
  hr: () => (
    <hr
      className="my-10"
      style={{ borderColor: "var(--color-navy-700)", borderTopWidth: "1px" }}
    />
  ),
};

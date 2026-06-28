/**
 * Preprocesses raw markdown before MDX serialisation.
 * Converts three patterns that MDX can't detect from component mapping alone:
 *   1. Diagram/media placeholders  → <DiagramPlaceholder /> / <MediaPlaceholder />
 *   2. Prompt cards                → <PromptCard title="...">...</PromptCard>
 *   3. Task-list checkboxes        → <Checkbox label="..." />
 */

function safe(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\{/g, "&#123;")
    .replace(/\}/g, "&#125;");
}

export function preprocessMdx(content: string): string {
  let text = content;

  // ── 1. Diagram / media placeholders ─────────────────────────────────────
  // Matches:  > 🖼️ **DIAGRAM PLACEHOLDER:** *description text*
  // Variants: SCREENSHOT, GIF, SCREENSHOT/GIF, IMAGE, CODE WALKTHROUGH
  text = text.replace(
    /^> 🖼️\s+\*\*(DIAGRAM|SCREENSHOT\/GIF|SCREENSHOT|GIF|IMAGE|CODE WALKTHROUGH) PLACEHOLDER\*\*:?\s*\*?([^*\n]*)\*?[ \t]*$/gm,
    (_, type, desc) => {
      const cleanDesc = desc.trim();
      if (type === "DIAGRAM") {
        return `<DiagramPlaceholder description="${safe(cleanDesc)}" />`;
      }
      const mediaType = type.toLowerCase().replace(/\//g, "-");
      return `<MediaPlaceholder type="${mediaType}" description="${safe(cleanDesc)}" />`;
    }
  );

  // ── 2. Prompt cards ──────────────────────────────────────────────────────
  // Matches:  **🤖 PROMPT CARD — Title:** (optional italic suffix like *(health...)*:)
  //           ```[optional lang]
  //           content
  //           ```
  text = text.replace(
    /\*\*🤖\s+PROMPT\s+CARDS?([^*\n]*)\*\*:?(?:\s*\*[^*\n]*\*:?)?\n```[^\n]*\n([\s\S]*?)```/gm,
    (_, titleSuffix, code) => {
      const raw = titleSuffix.replace(/^\s*—\s*/, "").trim();
      const title = raw || "PROMPT";
      return `<PromptCard title="${safe(title)}">\n${safe(code)}\n</PromptCard>`;
    }
  );

  // ── 3. Interactive checkboxes ────────────────────────────────────────────
  // Replaces GFM task-list items before MDX sees them.
  text = text.replace(/^[ \t]*- \[ \] (.+)$/gm, (_, label) => {
    return `<Checkbox label="${safe(label.trim())}" />`;
  });
  text = text.replace(/^[ \t]*- \[x\] (.+)$/gim, (_, label) => {
    return `<Checkbox label="${safe(label.trim())}" defaultChecked />`;
  });

  return text;
}

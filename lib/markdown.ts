// Markdown to HTML for articles that arrive from rank, and nothing else.
//
// Deliberately a small subset written here rather than a dependency: headings,
// paragraphs, lists, block quotes, rules, bold, italic, inline code and links.
// That is what rank writes.
//
// SAFE BY CONSTRUCTION. Every character of the source is HTML-escaped before
// any tag is produced, so raw HTML in an article renders as visible text and
// can never become markup. The only tags in the output are the ones this file
// writes. Links are limited to same-site paths and https; anything else
// (javascript:, data:, protocol-relative) is dropped to its label.

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function inline(text: string, origin: string): string {
  let s = esc(text);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, href: string) => {
    // `href` is already escaped; compare against the raw form, emit the escaped one.
    const raw = href.replace(/&amp;/g, "&");
    if (/^\/(?!\/)/.test(raw)) return `<a href="${href}">${label}</a>`;
    if (/^https:\/\//i.test(raw)) {
      if (origin && (raw === origin || raw.startsWith(`${origin}/`))) {
        return `<a href="${esc(raw.slice(origin.length) || "/")}">${label}</a>`;
      }
      return `<a href="${href}" rel="noopener noreferrer">${label}</a>`;
    }
    return label;
  });
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
  return s;
}

/**
 * `origin` is this site's own origin (no trailing slash): absolute links back
 * to the site are rewritten to paths so they stay internal.
 */
export function markdownToHtml(md: string, origin = ""): string {
  const out: string[] = [];
  let list: "ul" | "ol" | null = null;
  let para: string[] = [];
  let quote: string[] = [];
  const flushPara = () => {
    if (para.length) out.push(`<p>${inline(para.join(" "), origin)}</p>`);
    para = [];
  };
  const flushQuote = () => {
    if (quote.length) out.push(`<blockquote><p>${inline(quote.join(" "), origin)}</p></blockquote>`);
    quote = [];
  };
  const closeList = () => {
    if (list) out.push(`</${list}>`);
    list = null;
  };
  const closeAll = () => {
    flushPara();
    flushQuote();
    closeList();
  };

  for (const rawLine of String(md).replace(/\r/g, "").split("\n")) {
    const line = rawLine.trim();
    if (!line) {
      closeAll();
      continue;
    }
    let m: RegExpExecArray | null;
    if ((m = /^(#{1,6})\s+(.*)$/.exec(line))) {
      closeAll();
      // The page title is the only h1, so a `#` in the body is skipped and
      // everything else is held between h2 and h4.
      if (m[1].length === 1) continue;
      const level = Math.min(m[1].length, 4);
      out.push(`<h${level}>${inline(m[2], origin)}</h${level}>`);
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
      closeAll();
      out.push("<hr />");
      continue;
    }
    if ((m = /^>\s?(.*)$/.exec(line))) {
      flushPara();
      closeList();
      quote.push(m[1]);
      continue;
    }
    if ((m = /^[-*+]\s+(.*)$/.exec(line)) || (m = /^\d+[.)]\s+(.*)$/.exec(line))) {
      flushPara();
      flushQuote();
      const kind = /^\d/.test(line) ? "ol" : "ul";
      if (list !== kind) {
        closeList();
        out.push(`<${kind}>`);
        list = kind;
      }
      out.push(`<li>${inline(m[1], origin)}</li>`);
      continue;
    }
    flushQuote();
    closeList();
    para.push(line);
  }
  closeAll();
  return out.join("\n");
}

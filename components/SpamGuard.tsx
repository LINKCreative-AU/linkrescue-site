"use client";

import { useCallback, useId, useRef, useState } from "react";
import { HONEYPOT_FIELD, RENDERED_AT_FIELD } from "@/lib/form-guard";

// THE CLIENT HALF OF THE FORM GUARD.
//
// Two fields, both invisible to anyone actually filling the form in: a decoy
// input that only automation fills, and the time the form was rendered so the
// server can refuse a submission that arrived faster than a human could type.
//
// The server treats both as optional - a form that has not adopted this yet
// simply skips those two checks - so these can be added one component at a time
// without a flag day.
//
// WHY NOT display:none. It is the first thing a bot author turns off, and it is
// also the version screen readers handle least predictably. Moving the field
// off-screen keeps it in the layout for anything parsing the DOM naively while
// putting it nowhere a person can reach, and the three attributes below close
// the routes that remain: aria-hidden takes it out of the accessibility tree,
// tabIndex -1 takes it out of the tab order, and autoComplete="off" stops a
// browser helpfully filling it and locking a real visitor out of the form.
//
// The name matters too. A bot that fills a field called "honeypot" is not the
// bot worth catching; one that fills every field it finds is, and
// "companyWebsite" reads to a parser exactly like a field worth filling.

/**
 * Values to merge into the submitted payload.
 *
 * `renderedAt` is a ref, not state: it is captured once when the component
 * first mounts and must not move when the form re-renders on every keystroke,
 * or the fill-time check measures the last render instead of the first.
 */
export function useSpamGuard() {
  const renderedAt = useRef(Date.now());
  const [trap, setTrap] = useState("");

  const guardFields = useCallback(
    () => ({ [HONEYPOT_FIELD]: trap, [RENDERED_AT_FIELD]: renderedAt.current }),
    [trap],
  );

  return { guardFields, trap, setTrap };
}

/** The decoy. Render it anywhere inside the form. */
export function SpamTrap({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  // THE id MUST BE UNIQUE, THE name MUST NOT BE.
  //
  // A page can carry more than one form - the contact page renders the enquiry
  // form and the footer subscribe form together - and a fixed id put the same
  // one in the document twice. That is invalid HTML, and the <label for=...>
  // then points at whichever the browser happens to resolve first, which is
  // exactly the ambiguity assistive technology cannot recover from.
  //
  // useId gives each instance its own id. The `name` stays constant on purpose:
  // it is the key the server reads out of the payload, and it is scoped to its
  // own form, so repeating it across separate forms is correct.
  const id = useId();
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: "-9999px",
        width: 1,
        height: 1,
        overflow: "hidden",
      }}
    >
      <label htmlFor={id}>Company website</label>
      <input
        id={id}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

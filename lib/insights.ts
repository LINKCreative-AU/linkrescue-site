/** "3 November 2026", in Brisbane time whatever the server's clock is set to. */
export function formatInsightDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Australia/Brisbane",
  });
}

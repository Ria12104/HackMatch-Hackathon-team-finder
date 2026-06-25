export function formatDateRange(startDate: string, endDate: string) {
  const formatter = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short"
  });
  const start = formatter.format(new Date(startDate));
  const end = formatter.format(new Date(endDate));

  return start === end ? start : `${start} - ${end}`;
}

export function formatDateTime(date: Date) {
  const timeString = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateString = date.toLocaleDateString();
  return `${timeString} ${dateString}`;
}

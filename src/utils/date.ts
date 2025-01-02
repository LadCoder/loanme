/**
 * Formats a date according to international format (DD/MM/YYYY)
 */
export function formatDate(date: string | Date) {
    return new Intl.DateTimeFormat("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(typeof date === "string" ? new Date(date) : date);
}

/**
 * Formats a date with time according to international format
 */
export function formatDateTime(date: Date | string): string {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleString('en-AU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
} 
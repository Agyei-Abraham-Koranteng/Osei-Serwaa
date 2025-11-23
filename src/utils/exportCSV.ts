/**
 * Export data to CSV file
 * @param data - Array of objects to export
 * @param filename - Base filename (without extension)
 */
export const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
        console.warn('No data to export');
        return;
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
        headers.join(','),
        ...data.map(row =>
            headers.map(header => {
                const value = row[header] ?? '';
                // Escape quotes and wrap in quotes if contains comma or newline
                const escaped = String(value).replace(/"/g, '""');
                return escaped.includes(',') || escaped.includes('\n') ? `"${escaped}"` : escaped;
            }).join(',')
        )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

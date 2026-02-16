import { Response } from "express";

/**
 * Converts an array of objects to CSV format and sends it as a download
 */
export const exportToCsv = (res: Response, filename: string, data: any[]) => {
    if (data.length === 0) {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.send("");
        return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row =>
            headers.map(header => {
                const val = row[header];
                // Escape quotes and wrap in quotes if contains commas
                const stringVal = val === null || val === undefined ? "" : String(val);
                if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
                    return `"${stringVal.replace(/"/g, '""')}"`;
                }
                return stringVal;
            }).join(',')
        )
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.status(200).send(csvContent);
};

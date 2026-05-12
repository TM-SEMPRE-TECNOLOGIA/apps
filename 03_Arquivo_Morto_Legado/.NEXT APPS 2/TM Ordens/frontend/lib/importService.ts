import * as XLSX from 'xlsx';

export interface ParseResult {
    headers: string[];
    data: any[];
    error?: string;
}

export const readExcelFile = (file: File): Promise<ParseResult> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });

                // Assume the first sheet is the target
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                // Convert to array of arrays to extract headers easily
                const json: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

                if (json.length === 0) {
                    resolve({ headers: [], data: [], error: 'Planilha vazia' });
                    return;
                }

                // Find the header row (sometimes it's not the very first row)
                // A simple heuristic is finding the first row that has a reasonable amount of string columns
                let headerRowIndex = 0;
                let maxCols = 0;
                for (let i = 0; i < Math.min(10, json.length); i++) {
                    const colsCount = json[i].filter(cell => typeof cell === 'string' && cell.trim().length > 0).length;
                    if (colsCount > maxCols) {
                        maxCols = colsCount;
                        headerRowIndex = i;
                    }
                }

                const headers = json[headerRowIndex].map(h => String(h).trim());

                // Process the rest of the rows into objects based on headers
                const rowsProcessed = [];
                for (let i = headerRowIndex + 1; i < json.length; i++) {
                    const row = json[i];
                    // Skip completely empty rows
                    if (row.filter(cell => cell !== '').length === 0) continue;

                    const obj: Record<string, any> = {};
                    headers.forEach((header, index) => {
                        let val = row[index];

                        // Excel serial date parsing heuristic (numbers between 40000 and 50000 often represent dates)
                        if (typeof val === 'number' && val > 30000 && val < 60000 &&
                            (header.toLowerCase().includes('data') || header.toLowerCase().includes('venc') || header.toLowerCase().includes('prazo'))) {
                            val = excelDateToJSDate(val).toISOString();
                        }

                        obj[header] = val !== undefined ? val : '';
                    });
                    rowsProcessed.push(obj);
                }

                resolve({ headers, data: rowsProcessed });
            } catch (err) {
                console.error("Erro ao ler Excel:", err);
                resolve({ headers: [], data: [], error: 'Falha ao processar o arquivo. Certifique-se de que é um Excel ou CSV válido.' });
            }
        };

        reader.onerror = () => {
            resolve({ headers: [], data: [], error: 'Falha na leitura do arquivo pelo navegador.' });
        };

        reader.readAsArrayBuffer(file);
    });
};

function excelDateToJSDate(serial: number) {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);

    const fractional_day = serial - Math.floor(serial) + 0.0000001;
    let total_seconds = Math.floor(86400 * fractional_day);
    const seconds = total_seconds % 60;
    total_seconds -= seconds;
    const hours = Math.floor(total_seconds / (60 * 60));
    const minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}

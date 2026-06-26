import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'custom_items.json');

export async function GET() {
    try {
        if (!fs.existsSync(dataFilePath)) {
            return NextResponse.json({
                customAmbientes: [],
                customServicos: [],
                customSubpastas: [],
                customDetalhes: []
            });
        }
        const fileContents = fs.readFileSync(dataFilePath, 'utf8');
        const data = JSON.parse(fileContents);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        let data = {
            customAmbientes: [],
            customServicos: [],
            customSubpastas: [],
            customDetalhes: []
        };

        if (fs.existsSync(dataFilePath)) {
            const fileContents = fs.readFileSync(dataFilePath, 'utf8');
            data = JSON.parse(fileContents);
        }

        if (body.action === 'add') {
            const { key, item } = body;
            if (data[key] && !data[key].includes(item.trim())) {
                data[key].push(item.trim());
                fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
            }
        }

        if (body.action === 'delete') {
            const { key, item } = body;
            if (data[key]) {
                data[key] = data[key].filter(i => i !== item.trim());
                fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
            }
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to write data' }, { status: 500 });
    }
}

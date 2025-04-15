import { cp } from 'fs/promises';

async function copyTemplates() {
    await cp('src/template', 'dist/template', {
        recursive: true,
        filter: (src) => !src.includes('node_modules')
    });
}

copyTemplates().catch(console.error);
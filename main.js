const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fsPromises = require('fs').promises;
const fs = require('fs');

let mainWindow;
const historyFilePath = path.join(app.getPath('temp'), 'folder-tidy-history.json');
const customRulesPath = path.join(app.getPath('userData'), 'custom-rules.json');

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 960,
        height: 780,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
        autoHideMenuBar: true,
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// --- IPC: Open Folder Dialog ---
ipcMain.handle('dialog:openDirectory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    });
    return canceled ? null : filePaths[0];
});

// --- IPC: Preview (Dry Run) ---
ipcMain.handle('organize:preview', async (_event, { folderPath, mode, customRules }) => {
    const files = await fsPromises.readdir(folderPath, { withFileTypes: true });
    const preview = [];

    for (const dirent of files) {
        if (dirent.isDirectory()) continue;

        const fileName = dirent.name;
        const filePath = path.join(folderPath, fileName);
        let targetFolder = 'Lainnya';

        // Custom rules take priority
        const matchedRule = matchCustomRule(fileName, customRules || []);
        if (matchedRule) {
            targetFolder = matchedRule;
        } else if (mode === 'type') {
            targetFolder = getCategoryByType(fileName);
        } else if (mode === 'time') {
            targetFolder = await getCategoryByTime(filePath);
        } else if (mode === 'alphabet') {
            targetFolder = getCategoryByAlphabet(fileName);
        }

        preview.push({ fileName, filePath, targetFolder });
    }

    return preview;
});

// --- IPC: Execute (move selected files) ---
ipcMain.on('organize:execute', async (event, { files, folderPath }) => {
    const historyLog = [];
    let processedCount = 0;
    let skippedCount = 0;

    for (const item of files) {
        const { fileName, filePath, targetFolder } = item;
        const targetDirPath = path.join(folderPath, targetFolder);

        try {
            // Use existing folder or create if needed
            try {
                await fsPromises.access(targetDirPath);
            } catch {
                await fsPromises.mkdir(targetDirPath, { recursive: true });
            }

            const finalDestPath = await getUniqueFilePath(targetDirPath, fileName);
            await fsPromises.rename(filePath, finalDestPath);

            historyLog.push({ from: filePath, to: finalDestPath });
            processedCount++;
            event.reply('organize:log', `✅ ${fileName} → ${targetFolder}`);
        } catch (err) {
            skippedCount++;
            event.reply('organize:log', `❌ Gagal: ${fileName} (${err.message})`);
        }
    }

    // Save history for undo
    try {
        await fsPromises.writeFile(historyFilePath, JSON.stringify(historyLog, null, 2), 'utf-8');
    } catch (_) { /* ignore save error */ }

    event.reply('organize:complete', {
        processed: processedCount,
        skipped: skippedCount,
        canUndo: historyLog.length > 0
    });
});

// --- IPC: Undo ---
ipcMain.handle('organize:undo', async () => {
    try {
        const raw = await fsPromises.readFile(historyFilePath, 'utf-8');
        const history = JSON.parse(raw);
        if (!history || history.length === 0) return { success: false, message: 'Tidak ada riwayat untuk dibatalkan.' };

        let restoredCount = 0;
        let failedCount = 0;
        const results = [];

        for (const entry of history.reverse()) {
            try {
                const destDir = path.dirname(entry.from);
                try {
                    await fsPromises.access(destDir);
                } catch {
                    await fsPromises.mkdir(destDir, { recursive: true });
                }
                const finalRestorePath = await getUniqueFilePath(destDir, path.basename(entry.from));
                await fsPromises.rename(entry.to, finalRestorePath);
                restoredCount++;
                results.push(`✅ Dikembalikan: ${path.basename(entry.to)}`);
            } catch (err) {
                failedCount++;
                results.push(`❌ Gagal kembalikan: ${path.basename(entry.to)} (${err.message})`);
            }
        }

        // Clear history after undo
        await fsPromises.writeFile(historyFilePath, JSON.stringify([]), 'utf-8');

        return { success: true, restored: restoredCount, failed: failedCount, log: results };
    } catch (err) {
        return { success: false, message: `Error: ${err.message}` };
    }
});

// --- IPC: Custom Rules ---
ipcMain.handle('rules:load', async () => {
    try {
        const raw = await fsPromises.readFile(customRulesPath, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return [];
    }
});

ipcMain.handle('rules:save', async (_event, rules) => {
    try {
        await fsPromises.writeFile(customRulesPath, JSON.stringify(rules, null, 2), 'utf-8');
        return { success: true };
    } catch (err) {
        return { success: false, message: err.message };
    }
});

// --- IPC: Check Undo availability ---
ipcMain.handle('organize:canUndo', async () => {
    try {
        const raw = await fsPromises.readFile(historyFilePath, 'utf-8');
        const history = JSON.parse(raw);
        return history && history.length > 0;
    } catch {
        return false;
    }
});

// =====================
// Helper Functions
// =====================

async function getUniqueFilePath(destDir, originalName) {
    let counter = 1;
    const ext = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, ext);
    let newPath = path.join(destDir, originalName);

    while (true) {
        try {
            await fsPromises.access(newPath);
            newPath = path.join(destDir, `${nameWithoutExt} (${counter})${ext}`);
            counter++;
        } catch {
            return newPath;
        }
    }
}

function matchCustomRule(fileName, customRules) {
    for (const rule of customRules) {
        if (!rule.keyword || !rule.targetFolder) continue;
        if (fileName.toLowerCase().includes(rule.keyword.toLowerCase())) {
            return rule.targetFolder;
        }
    }
    return null;
}

function getCategoryByType(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    const categories = {
        'Dokumen': ['.pdf', '.doc', '.docx', '.txt', '.xlsx', '.csv', '.ppt', '.pptx', '.odt', '.rtf'],
        'Gambar': ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp', '.tiff', '.ico'],
        'Video': ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv', '.webm'],
        'Audio': ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'],
        'Aplikasi': ['.exe', '.msi', '.dmg', '.apk', '.deb', '.rpm'],
        'Arsip': ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2'],
        'Kode': ['.js', '.ts', '.py', '.java', '.html', '.css', '.json', '.xml', '.sh', '.bat']
    };
    for (const [category, extensions] of Object.entries(categories)) {
        if (extensions.includes(ext)) return category;
    }
    return 'Lainnya';
}

async function getCategoryByTime(filePath) {
    const stats = await fsPromises.stat(filePath);
    const date = new Date(stats.mtime);
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${months[date.getMonth()]}-${date.getFullYear()}`;
}

function getCategoryByAlphabet(fileName) {
    const c = fileName.charAt(0).toUpperCase();
    if (/[A-C]/.test(c)) return 'A-C';
    if (/[D-F]/.test(c)) return 'D-F';
    if (/[G-I]/.test(c)) return 'G-I';
    if (/[J-L]/.test(c)) return 'J-L';
    if (/[M-O]/.test(c)) return 'M-O';
    if (/[P-S]/.test(c)) return 'P-S';
    if (/[T-V]/.test(c)) return 'T-V';
    if (/[W-Z]/.test(c)) return 'W-Z';
    return 'Simbol & Angka';
}

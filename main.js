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
        icon: path.join(__dirname, 'build', 'FTlogo.svg'),
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
ipcMain.handle('organize:preview', async (_event, { folderPath, mode, customRules, lang }) => {
    const files = await fsPromises.readdir(folderPath, { withFileTypes: true });
    const preview = [];

    for (const dirent of files) {
        if (dirent.isDirectory()) continue;

        const fileName = dirent.name;
        const filePath = path.join(folderPath, fileName);
        let targetFolder = lang === 'id' ? 'Lainnya' : 'Others';

        const matchedRule = matchCustomRule(fileName, customRules || []);

        if (mode === 'custom') {
            if (matchedRule) {
                targetFolder = matchedRule;
            } else {
                targetFolder = lang === 'id' ? 'Lainnya' : 'Others';
            }
        } else if (mode === 'type') {
            targetFolder = getCategoryByType(fileName, lang);
        } else if (mode === 'time') {
            targetFolder = await getCategoryByTime(filePath, lang);
        } else if (mode === 'alphabet') {
            targetFolder = getCategoryByAlphabet(fileName, lang);
        } else if (mode === 'size') {
            targetFolder = await getCategoryBySize(filePath, lang);
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
    const ext = path.extname(fileName).toLowerCase();
    const nameLower = fileName.toLowerCase();

    for (const rule of customRules) {
        if (!rule.keyword || !rule.targetFolder) continue;
        const type = rule.type || 'keyword';
        const keywords = Array.isArray(rule.keyword) ? rule.keyword : [rule.keyword];

        for (let kw of keywords) {
            const ruleKeyword = kw.toLowerCase();

            if (type === 'keyword') {
                if (nameLower.includes(ruleKeyword)) return rule.targetFolder;
            } else if (type === 'extension') {
                const ruleExt = ruleKeyword.startsWith('.') ? ruleKeyword : `.${ruleKeyword}`;
                if (ext === ruleExt) return rule.targetFolder;
            } else if (type === 'both') {
                const parts = kw.split(/\s+/);
                if (parts.length >= 2) {
                    const k = parts[0].toLowerCase();
                    const e = parts[1].startsWith('.') ? parts[1].toLowerCase() : `.${parts[1].toLowerCase()}`;
                    if (nameLower.includes(k) && ext === e) return rule.targetFolder;
                } else {
                    if (nameLower.includes(ruleKeyword)) return rule.targetFolder;
                }
            }
        }
    }
    return null;
}

function getCategoryByType(fileName, lang) {
    const ext = path.extname(fileName).toLowerCase();

    // Define localized categories
    const categoriesEN = {
        'Documents': ['.pdf', '.doc', '.docx', '.txt', '.xlsx', '.csv', '.ppt', '.pptx', '.odt', '.rtf'],
        'Images': ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp', '.tiff', '.ico'],
        'Videos': ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv', '.webm'],
        'Audio': ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'],
        'Applications': ['.exe', '.msi', '.dmg', '.apk', '.deb', '.rpm'],
        'Archives': ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2'],
        'Code': ['.js', '.ts', '.py', '.java', '.html', '.css', '.json', '.xml', '.sh', '.bat']
    };

    const categoriesID = {
        'Dokumen': ['.pdf', '.doc', '.docx', '.txt', '.xlsx', '.csv', '.ppt', '.pptx', '.odt', '.rtf'],
        'Gambar': ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp', '.tiff', '.ico'],
        'Video': ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv', '.webm'],
        'Audio': ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'],
        'Aplikasi': ['.exe', '.msi', '.dmg', '.apk', '.deb', '.rpm'],
        'Arsip': ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2'],
        'Kode': ['.js', '.ts', '.py', '.java', '.html', '.css', '.json', '.xml', '.sh', '.bat']
    };

    const categories = lang === 'id' ? categoriesID : categoriesEN;

    for (const [category, extensions] of Object.entries(categories)) {
        if (extensions.includes(ext)) return category;
    }
    return lang === 'id' ? 'Lainnya' : 'Others';
}

async function getCategoryByTime(filePath, lang) {
    const stats = await fsPromises.stat(filePath);
    const date = new Date(stats.mtime);

    const monthsEN = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const monthsID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const months = lang === 'id' ? monthsID : monthsEN;
    return `${months[date.getMonth()]}-${date.getFullYear()}`;
}

function getCategoryByAlphabet(fileName, lang) {
    const c = fileName.charAt(0).toUpperCase();
    if (/[A-C]/.test(c)) return 'A-C';
    if (/[D-F]/.test(c)) return 'D-F';
    if (/[G-I]/.test(c)) return 'G-I';
    if (/[J-L]/.test(c)) return 'J-L';
    if (/[M-O]/.test(c)) return 'M-O';
    if (/[P-S]/.test(c)) return 'P-S';
    if (/[T-V]/.test(c)) return 'T-V';
    if (/[W-Z]/.test(c)) return 'W-Z';
    return lang === 'id' ? 'Simbol & Angka' : 'Symbols & Numbers';
}

async function getCategoryBySize(filePath, lang) {
    const stats = await fsPromises.stat(filePath);
    const sizeInBytes = stats.size;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    const sizeInGB = sizeInMB / 1024;

    if (sizeInGB >= 1) {
        return lang === 'id' ? 'Besar (Diatas 1GB)' : 'Large (Over 1GB)';
    } else if (sizeInMB >= 100) {
        return lang === 'id' ? 'Menengah (100MB - 1GB)' : 'Medium (100MB - 1GB)';
    } else {
        return lang === 'id' ? 'Kecil (Dibawah 100MB)' : 'Small (Under 100MB)';
    }
}

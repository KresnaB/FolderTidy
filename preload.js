const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // Folder selection via dialog
    selectFolder: () => ipcRenderer.invoke('dialog:openDirectory'),

    // Preview (dry run)
    preview: (options) => ipcRenderer.invoke('organize:preview', options),

    // Execute (move selected files)
    execute: (options) => ipcRenderer.send('organize:execute', options),
    onLog: (cb) => ipcRenderer.on('organize:log', (_e, msg) => cb(msg)),
    onComplete: (cb) => ipcRenderer.on('organize:complete', (_e, result) => cb(result)),

    // Undo
    undo: () => ipcRenderer.invoke('organize:undo'),
    canUndo: () => ipcRenderer.invoke('organize:canUndo'),

    // Custom Rules
    loadRules: () => ipcRenderer.invoke('rules:load'),
    saveRules: (rules) => ipcRenderer.invoke('rules:save', rules),
});

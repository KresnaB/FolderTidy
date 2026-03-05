document.addEventListener('DOMContentLoaded', async () => {

    // ─── Elements ────────────────────────────────────────────────────
    const btnSelectFolder = document.getElementById('btn-select-folder');
    const pathDisplay = document.getElementById('selected-folder-path');
    const btnPreview = document.getElementById('btn-preview');
    const btnExecute = document.getElementById('btn-execute');
    const btnUndo = document.getElementById('btn-undo');
    const btnAddRule = document.getElementById('btn-add-rule');
    const rulesList = document.getElementById('rules-list');

    const previewContainer = document.getElementById('preview-container');
    const previewCount = document.getElementById('preview-count');
    const previewBody = document.getElementById('preview-body');
    const chkSelectAll = document.getElementById('chk-select-all');
    const chkHeader = document.getElementById('chk-header');

    const progressContainer = document.getElementById('progress-container');
    const logOutput = document.getElementById('log-output');
    const progressStatus = document.getElementById('progress-status');

    // ─── State ───────────────────────────────────────────────────────
    let selectedFolder = null;
    let previewData = [];   // full preview list from main process

    // ─── Init: load undo state & custom rules ─────────────────────────
    const canUndo = await window.api.canUndo();
    btnUndo.disabled = !canUndo;

    const savedRules = await window.api.loadRules();
    savedRules.forEach(r => addRuleRow(r.keyword, r.targetFolder));

    // ─── Select Folder Button ─────────────────────────────────────────
    btnSelectFolder.addEventListener('click', async () => {
        const folderPath = await window.api.selectFolder();
        if (folderPath) setSelectedFolder(folderPath);
    });

    function setSelectedFolder(folderPath) {
        selectedFolder = folderPath;
        pathDisplay.textContent = '📁 ' + folderPath;
        pathDisplay.classList.remove('hidden');
        btnPreview.disabled = false;
        // Reset state
        previewContainer.classList.add('hidden');
        progressContainer.classList.add('hidden');
        btnExecute.disabled = true;
        previewData = [];
    }

    // ─── Custom Rules ─────────────────────────────────────────────────
    btnAddRule.addEventListener('click', () => addRuleRow('', ''));

    function addRuleRow(keyword = '', targetFolder = '') {
        const row = document.createElement('div');
        row.className = 'rule-row';
        row.innerHTML = `
      <input type="text" class="rule-keyword" placeholder="Kata kunci (e.g. Faktur)" value="${keyword}">
      <span class="rule-arrow">→</span>
      <input type="text" class="rule-folder" placeholder="Nama folder tujuan (e.g. Keuangan)" value="${targetFolder}">
      <button class="btn-del-rule" title="Hapus aturan">×</button>
    `;
        row.querySelector('.btn-del-rule').addEventListener('click', () => {
            row.remove();
            saveRules();
        });
        row.querySelectorAll('input').forEach(inp => inp.addEventListener('change', saveRules));
        rulesList.appendChild(row);
    }

    async function saveRules() {
        const rules = getRules();
        await window.api.saveRules(rules);
    }

    function getRules() {
        const rows = rulesList.querySelectorAll('.rule-row');
        return Array.from(rows).map(row => ({
            keyword: row.querySelector('.rule-keyword').value.trim(),
            targetFolder: row.querySelector('.rule-folder').value.trim()
        })).filter(r => r.keyword && r.targetFolder);
    }

    // ─── Preview ──────────────────────────────────────────────────────
    btnPreview.addEventListener('click', async () => {
        if (!selectedFolder) return;

        btnPreview.textContent = '⏳ Memindai...';
        btnPreview.disabled = true;

        const mode = document.querySelector('input[name="mode"]:checked').value;
        const customRules = getRules();

        previewData = await window.api.preview({ folderPath: selectedFolder, mode, customRules });

        renderPreviewTable(previewData);

        btnPreview.textContent = '🔍 Pratinjau';
        btnPreview.disabled = false;
    });

    function renderPreviewTable(data) {
        previewBody.innerHTML = '';

        if (data.length === 0) {
            previewContainer.classList.add('hidden');
            return;
        }

        data.forEach((item, idx) => {
            const tr = document.createElement('tr');
            tr.dataset.idx = idx;
            tr.innerHTML = `
        <td class="col-check"><input type="checkbox" class="file-chk" data-idx="${idx}" checked></td>
        <td>${escHtml(item.fileName)}</td>
        <td><span class="dest-chip">${escHtml(item.targetFolder)}</span></td>
      `;
            tr.querySelector('.file-chk').addEventListener('change', (e) => {
                tr.classList.toggle('unchecked', !e.target.checked);
                updateSelectAllState();
                updateExecuteBtn();
            });
            previewBody.appendChild(tr);
        });

        previewCount.textContent = `${data.length} file ditemukan`;
        previewContainer.classList.remove('hidden');
        progressContainer.classList.add('hidden');
        updateExecuteBtn();
    }

    // Select All checkbox (both in header and below header)
    [chkSelectAll, chkHeader].forEach(chk => {
        chk.addEventListener('change', (e) => {
            const checked = e.target.checked;
            // sync both checkboxes
            chkSelectAll.checked = checked;
            chkHeader.checked = checked;
            previewBody.querySelectorAll('.file-chk').forEach(c => {
                c.checked = checked;
                c.closest('tr').classList.toggle('unchecked', !checked);
            });
            updateExecuteBtn();
        });
    });

    function updateSelectAllState() {
        const all = previewBody.querySelectorAll('.file-chk');
        const checked = previewBody.querySelectorAll('.file-chk:checked');
        const allChecked = all.length === checked.length;
        chkSelectAll.checked = allChecked;
        chkHeader.checked = allChecked;
    }

    function updateExecuteBtn() {
        const anyChecked = previewBody.querySelectorAll('.file-chk:checked').length > 0;
        btnExecute.disabled = !anyChecked;
    }

    // ─── Execute ──────────────────────────────────────────────────────
    btnExecute.addEventListener('click', () => {
        const selectedIdxs = Array.from(previewBody.querySelectorAll('.file-chk:checked'))
            .map(chk => parseInt(chk.dataset.idx));

        const filesToMove = selectedIdxs.map(i => previewData[i]);

        // UI lock
        btnExecute.disabled = true;
        btnPreview.disabled = true;
        btnUndo.disabled = true;
        btnExecute.textContent = '⏱️ Merapikan...';

        progressContainer.classList.remove('hidden');
        progressStatus.textContent = 'Berjalan...';
        progressStatus.style.background = 'var(--accent)';
        logOutput.innerHTML = '';

        window.api.execute({ files: filesToMove, folderPath: selectedFolder });
    });

    // ─── IPC Listeners ────────────────────────────────────────────────
    window.api.onLog((message) => {
        const div = document.createElement('div');
        div.textContent = message;
        logOutput.appendChild(div);
        logOutput.scrollTop = logOutput.scrollHeight;
    });

    window.api.onComplete((result) => {
        btnExecute.textContent = '✨ Rapikan Lagi';
        btnExecute.disabled = false;
        btnPreview.disabled = false;
        btnUndo.disabled = !result.canUndo;

        progressStatus.textContent = `Selesai (${result.processed} file)`;
        progressStatus.style.background = 'var(--success)';

        const div = document.createElement('div');
        div.style.color = 'var(--success)';
        div.textContent = `✅ ${result.processed} dipindah, ${result.skipped} dilewati.`;
        logOutput.appendChild(div);
        logOutput.scrollTop = logOutput.scrollHeight;

        // Refresh preview (folder is now organized)
        previewContainer.classList.add('hidden');
        previewData = [];
    });

    // ─── Undo ─────────────────────────────────────────────────────────
    btnUndo.addEventListener('click', async () => {
        btnUndo.disabled = true;
        btnUndo.textContent = '↩ Membatalkan...';

        const result = await window.api.undo();

        if (result.success) {
            progressContainer.classList.remove('hidden');
            progressStatus.textContent = `Undo (${result.restored} dikembalikan)`;
            progressStatus.style.background = 'var(--warning)';
            logOutput.innerHTML = '';
            result.log.forEach(msg => {
                const div = document.createElement('div');
                div.textContent = msg;
                logOutput.appendChild(div);
            });
        } else {
            alert(result.message);
        }

        btnUndo.textContent = '↩ Undo';
        btnUndo.disabled = true; // history cleared after undo
    });

    // ─── Utility ──────────────────────────────────────────────────────
    function escHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
});

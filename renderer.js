const translations = {
    en: {
        'app-title': '🗂️ FolderTidy',
        'app-subtitle': 'Tidy up your files in seconds.',
        'btn-undo': '↩ Undo',
        'step1-title': 'Select Target Folder',
        'btn-select': '📂 Select Folder',
        'step2-title': 'Organization Mode',
        'mode-type-title': '🗂️ By Type',
        'mode-type-desc': 'Docs, Images, Videos, etc.',
        'mode-time-title': '📅 By Time',
        'mode-time-desc': 'Grouped by Month-Year.',
        'mode-size-title': '⚖️ By Size',
        'mode-size-desc': 'Small, Medium, Large.',
        'mode-custom-title': '🛠️ Custom Rules',
        'mode-custom-desc': 'Use your own keywords.',
        'custom-rules-desc': 'If filename contains specific keywords, move to folder of your choice.',
        'btn-add-rule': '+ Add Rule',
        'step3-title': 'Preview & Execution',
        'btn-preview': '🔍 Preview',
        'btn-execute': '✨ Tidy Now!',
        'select-all': 'Select All',
        'table-filename': 'File Name',
        'table-dest': '→ Target Folder',
        'log-title': 'Process Log',
        'status-running': 'Running...',
        'status-scanning': '⏳ Scanning...',
        'status-tidying': '⏱️ Tidying...',
        'status-done': '✨ Tidy Again',
        'status-undone': '↩ Undoing...',
        'status-undo-btn': '↩ Undo',
        'rule-type-kw': 'Keyword',
        'rule-type-ext': 'Extension',
        'rule-type-both': 'Combination',
        'rule-kw-placeholder': 'e.g. Invoice or .pdf',
        'rule-folder-placeholder': 'Target folder',
        'tag-placeholder': 'Type & space...',
        'btn-del-rule': 'Delete rule',
        'msg-scanning': '⏳ Scanning...',
        'msg-success-move': '✅ {n} moved, {s} skipped.',
        'msg-history-empty': 'No history to undo.',
        'msg-undo-success': 'Undo ({n} restored)',
        'folder-others': 'Others',
        'size-large': 'Large (> 1GB)',
        'size-medium': 'Medium (100MB - 1GB)',
        'size-small': 'Small (< 100MB)',
        'found-files': '{n} files found',
        'msg-empty-folder': 'No files found in this folder based on your selection.',
        'msg-empty-rule-folder': 'Please provide a target folder name for all your custom rules.'
    },
    id: {
        'app-title': '🗂️ FolderTidy',
        'app-subtitle': 'Rapikan file dalam hitungan detik.',
        'btn-undo': '↩ Undo',
        'step1-title': 'Pilih Folder Target',
        'btn-select': '📂 Pilih Folder',
        'step2-title': 'Mode Organisasi',
        'mode-type-title': '🗂️ Berdasarkan Tipe',
        'mode-type-desc': 'Dokumen, Gambar, Video, dll.',
        'mode-time-title': '📅 Berdasarkan Waktu',
        'mode-time-desc': 'Dikelompokkan ke Bulan-Tahun.',
        'mode-size-title': '⚖️ Berdasarkan Ukuran',
        'mode-size-desc': 'Kecil, Menengah, Besar.',
        'mode-custom-title': '🛠️ Aturan Kustom',
        'mode-custom-desc': 'Gunakan kata kunci sendiri.',
        'custom-rules-desc': 'Jika nama file mengandung kata kunci tertentu, pindahkan ke folder pilihan Anda.',
        'btn-add-rule': '+ Tambah Aturan',
        'step3-title': 'Pratinjau & Eksekusi',
        'btn-preview': '🔍 Pratinjau',
        'btn-execute': '✨ Rapikan Sekarang!',
        'select-all': 'Pilih Semua',
        'table-filename': 'Nama File',
        'table-dest': '→ Folder Tujuan',
        'log-title': 'Log Proses',
        'status-running': 'Berjalan...',
        'status-scanning': '⏳ Memindai...',
        'status-tidying': '⏱️ Merapikan...',
        'status-done': '✨ Rapikan Lagi',
        'status-undone': '↩ Membatalkan...',
        'status-undo-btn': '↩ Undo',
        'rule-type-kw': 'Kata Kunci',
        'rule-type-ext': 'Ekstensi',
        'rule-type-both': 'Kombinasi',
        'rule-kw-placeholder': 'e.g. Faktur atau .pdf',
        'rule-folder-placeholder': 'Folder tujuan',
        'tag-placeholder': 'Ketik & spasi...',
        'btn-del-rule': 'Hapus aturan',
        'msg-scanning': '⏳ Memindai...',
        'msg-success-move': '✅ {n} dipindah, {s} dilewati.',
        'msg-history-empty': 'Tidak ada riwayat untuk dibatalkan.',
        'msg-undo-success': 'Undo ({n} dikembalikan)',
        'folder-others': 'Lainnya',
        'size-large': 'Besar (> 1GB)',
        'size-medium': 'Menengah (100MB - 1GB)',
        'size-small': 'Kecil (< 100MB)',
        'found-files': '{n} file ditemukan',
        'msg-empty-folder': 'Tidak ada file ditemukan di folder ini berdasarkan pilihan Anda.',
        'msg-empty-rule-folder': 'Harap masukkan nama folder tujuan untuk semua aturan kustom Anda.'
    }
};

document.addEventListener('DOMContentLoaded', async () => {

    let currentLang = localStorage.getItem('lang') || 'en';

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        // Update active class
        document.getElementById('lang-en').classList.toggle('active', lang === 'en');
        document.getElementById('lang-id').classList.toggle('active', lang === 'id');

        // Update placeholders
        document.querySelectorAll('.tag-input').forEach(inp => {
            inp.placeholder = translations[lang]['tag-placeholder'];
        });
        document.querySelectorAll('.rule-folder').forEach(inp => {
            inp.placeholder = translations[lang]['rule-folder-placeholder'];
        });

        // Update existing rule type selects
        document.querySelectorAll('.rule-row .rule-type').forEach(sel => {
            sel.querySelector('option[value="keyword"]').textContent = translations[lang]['rule-type-kw'];
            sel.querySelector('option[value="extension"]').textContent = translations[lang]['rule-type-ext'];
            sel.querySelector('option[value="both"]').textContent = translations[lang]['rule-type-both'];
        });

        document.querySelectorAll('.btn-del-rule').forEach(btn => {
            btn.title = translations[lang]['btn-del-rule'];
        });
    }

    document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));
    document.getElementById('lang-id').addEventListener('click', () => setLanguage('id'));

    setLanguage(currentLang);


    // ─── Elements ────────────────────────────────────────────────────
    const btnSelectFolder = document.getElementById('btn-select-folder');
    const pathDisplay = document.getElementById('selected-folder-path');
    const btnPreview = document.getElementById('btn-preview');
    const btnExecute = document.getElementById('btn-execute');
    const btnUndo = document.getElementById('btn-undo');
    const btnAddRule = document.getElementById('btn-add-rule');
    const rulesList = document.getElementById('rules-list');
    const customRulesSection = document.getElementById('custom-rules-section');
    const modeRadios = document.getElementsByName('mode');

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

    // ─── Select Folder Button ─────────────────────────────────────────
    btnSelectFolder.addEventListener('click', async () => {
        try {
            const folderPath = await window.api.selectFolder();
            if (folderPath) setSelectedFolder(folderPath);
        } catch (err) {
            console.error('Error selecting folder:', err);
        }
    });

    function setSelectedFolder(folderPath) {
        selectedFolder = folderPath;
        pathDisplay.textContent = '📁 ' + folderPath;
        pathDisplay.classList.remove('hidden');
        btnPreview.disabled = false;
        clearPreview();
    }

    // ─── Init: load undo state & custom rules ─────────────────────────
    try {
        const canUndo = await window.api.canUndo();
        btnUndo.disabled = !canUndo;

        const savedRules = await window.api.loadRules();
        if (Array.isArray(savedRules)) {
            savedRules.forEach(r => addRuleRow(r.keyword, r.targetFolder, r.type || 'keyword'));
        }
    } catch (err) {
        console.error('Initialization error:', err);
    }

    // ─── Mode Change Logic ───────────────────────────────────────────
    Array.from(modeRadios).forEach(radio => {
        radio.addEventListener('change', () => {
            clearPreview();
            if (radio.value === 'custom' && radio.checked) {
                customRulesSection.classList.remove('hidden');
            } else {
                customRulesSection.classList.add('hidden');
            }
        });
    });

    // Check initial state
    const checkedRadio = document.querySelector('input[name="mode"]:checked');
    if (checkedRadio && checkedRadio.value === 'custom') {
        customRulesSection.classList.remove('hidden');
    }

    // ─── Custom Rules ─────────────────────────────────────────────────
    btnAddRule.addEventListener('click', () => addRuleRow([], ''));

    function addRuleRow(keywords = [], targetFolder = '', type = 'keyword') {
        const row = document.createElement('div');
        row.className = 'rule-row';
        row.innerHTML = `
      <select class="rule-type">
        <option value="keyword" ${type === 'keyword' ? 'selected' : ''}>${translations[currentLang]['rule-type-kw']}</option>
        <option value="extension" ${type === 'extension' ? 'selected' : ''}>${translations[currentLang]['rule-type-ext']}</option>
        <option value="both" ${type === 'both' ? 'selected' : ''}>${translations[currentLang]['rule-type-both']}</option>
      </select>
      <div class="tags-wrapper">
        <div class="tags-container"></div>
        <input type="text" class="tag-input" placeholder="${translations[currentLang]['tag-placeholder']}">
      </div>
      <span class="rule-arrow">→</span>
      <input type="text" class="rule-folder" placeholder="${translations[currentLang]['rule-folder-placeholder']}" value="${targetFolder}">
      <button class="btn-del-rule" title="${translations[currentLang]['btn-del-rule']}">×</button>
    `;

        const tagsContainer = row.querySelector('.tags-container');
        const tagInput = row.querySelector('.tag-input');
        const ruleFolderInput = row.querySelector('.rule-folder');
        const ruleTypeSelect = row.querySelector('.rule-type');

        // Add initial tags
        const kwArray = Array.isArray(keywords) ? keywords : (keywords ? [keywords] : []);
        kwArray.forEach(kw => createTag(tagsContainer, kw));

        tagInput.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                const val = tagInput.value.trim();
                if (val) {
                    createTag(tagsContainer, val);
                    tagInput.value = '';
                    saveRules();
                    clearPreview();
                }
            } else if (e.key === 'Backspace' && !tagInput.value) {
                const tags = tagsContainer.querySelectorAll('.tag');
                if (tags.length > 0) {
                    tags[tags.length - 1].remove();
                    saveRules();
                    clearPreview();
                }
            }
        });

        function createTag(container, text) {
            const tag = document.createElement('div');
            tag.className = 'tag';
            tag.innerHTML = `
                <span>${escHtml(text)}</span>
                <button class="tag-btn-del" title="Hapus">×</button>
            `;
            tag.querySelector('.tag-btn-del').addEventListener('click', () => {
                tag.remove();
                saveRules();
                clearPreview();
            });
            container.appendChild(tag);
        }

        row.querySelector('.btn-del-rule').addEventListener('click', () => {
            row.remove();
            saveRules();
            clearPreview();
        });

        ruleFolderInput.addEventListener('input', () => {
            // Remove invalid Windows folder characters: / \ : * ? " < > |
            const sanitized = ruleFolderInput.value.replace(/[\\/:*?"<>|]/g, '');
            if (sanitized !== ruleFolderInput.value) {
                ruleFolderInput.value = sanitized;
            }
        });

        ruleFolderInput.addEventListener('change', () => {
            const folderName = ruleFolderInput.value.trim();
            if (folderName) {
                ruleFolderInput.classList.remove('error');
                saveRules();
                clearPreview();
            } else {
                ruleFolderInput.classList.add('error');
            }
        });
        ruleTypeSelect.addEventListener('change', () => {
            saveRules();
            clearPreview();
        });

        rulesList.appendChild(row);
        clearPreview();
    }

    async function saveRules() {
        const rules = getRules();
        await window.api.saveRules(rules);
    }

    function getRules() {
        const rows = rulesList.querySelectorAll('.rule-row');
        return Array.from(rows).map(row => {
            const tags = Array.from(row.querySelectorAll('.tag span')).map(s => s.textContent);
            return {
                type: row.querySelector('.rule-type').value,
                keyword: tags, // Now an array of tags
                targetFolder: row.querySelector('.rule-folder').value.trim()
            };
        }).filter(r => r.keyword.length > 0 && r.targetFolder);
    }

    // ─── Preview ──────────────────────────────────────────────────────
    btnPreview.addEventListener('click', async () => {
        if (!selectedFolder) return;

        try {
            const mode = document.querySelector('input[name="mode"]:checked').value;
            const customRules = getRules();

            if (mode === 'custom') {
                const rows = rulesList.querySelectorAll('.rule-row');
                let hasEmptyFolder = false;
                rows.forEach(row => {
                    const folder = row.querySelector('.rule-folder').value.trim();
                    if (!folder) {
                        hasEmptyFolder = true;
                        row.querySelector('.rule-folder').classList.add('error');
                    }
                });

                if (hasEmptyFolder) {
                    alert(translations[currentLang]['msg-empty-rule-folder']);
                    return;
                }
            }

            btnPreview.textContent = translations[currentLang]['status-scanning'];
            btnPreview.disabled = true;

            previewData = await window.api.preview({
                folderPath: selectedFolder,
                mode,
                customRules,
                lang: currentLang
            });

            renderPreviewTable(previewData);
        } catch (err) {
            console.error('Preview error:', err);
        } finally {
            btnPreview.textContent = translations[currentLang]['btn-preview'];
            btnPreview.disabled = false;
        }
    });

    function renderPreviewTable(data) {
        previewBody.innerHTML = '';

        if (data.length === 0) {
            previewContainer.classList.add('hidden');
            alert(translations[currentLang]['msg-empty-folder']);
            return;
        }

        chkSelectAll.checked = true;
        chkHeader.checked = true;

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

        previewCount.textContent = translations[currentLang]['found-files'].replace('{n}', data.length);
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

    function clearPreview() {
        previewData = [];
        previewBody.innerHTML = '';
        previewContainer.classList.add('hidden');
        progressContainer.classList.add('hidden');
        chkSelectAll.checked = false;
        chkHeader.checked = false;
        updateExecuteBtn();
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
        btnExecute.textContent = translations[currentLang]['status-tidying'];

        progressContainer.classList.remove('hidden');
        progressStatus.textContent = translations[currentLang]['status-running'];
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
        btnExecute.textContent = translations[currentLang]['status-done'];
        btnExecute.disabled = false;
        btnPreview.disabled = false;
        btnUndo.disabled = !result.canUndo;

        progressStatus.textContent = `${translations[currentLang]['status-done'].split(' ')[1] || 'Selesai'} (${result.processed} file)`;
        // Actually let's just use a better key
        progressStatus.textContent = (currentLang === 'id' ? 'Selesai' : 'Done') + ` (${result.processed} file)`;
        progressStatus.style.background = 'var(--success)';

        const div = document.createElement('div');
        div.style.color = 'var(--success)';
        div.textContent = translations[currentLang]['msg-success-move']
            .replace('{n}', result.processed)
            .replace('{s}', result.skipped);
        logOutput.appendChild(div);
        logOutput.scrollTop = logOutput.scrollHeight;

        // Refresh preview (folder is now organized)
        previewContainer.classList.add('hidden');
        previewData = [];
    });

    // ─── Undo ─────────────────────────────────────────────────────────
    btnUndo.addEventListener('click', async () => {
        btnUndo.disabled = true;
        btnUndo.textContent = translations[currentLang]['status-undone'];

        const result = await window.api.undo();

        if (result.success) {
            progressContainer.classList.remove('hidden');
            progressStatus.textContent = translations[currentLang]['msg-undo-success'].replace('{n}', result.restored);
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

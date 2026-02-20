const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const previewContainer = document.getElementById('preview-container');
const previewImage = document.getElementById('preview-image');
const removeBtn = document.getElementById('remove-btn');
const analyzeBtn = document.getElementById('analyze-btn');
const scanOverlay = document.getElementById('scan-overlay');

const statusBadge = document.getElementById('status-badge');
const emptyState = document.getElementById('empty-state');
const loadingState = document.getElementById('loading-state');
const resultsContent = document.getElementById('results-content');

const resultLabel = document.getElementById('result-label');
const confidenceScore = document.getElementById('confidence-score');
const confidenceBar = document.getElementById('confidence-bar');
const cdrScore = document.getElementById('cdr-score');

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop zone when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

// Handle dropped files
dropZone.addEventListener('drop', handleDrop, false);

// Handle file input manually
dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFiles);

// Remove image
removeBtn.addEventListener('click', resetUpload);

// Analyze button
analyzeBtn.addEventListener('click', simulateAnalysis);

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    dropZone.classList.add('border-medical-500', 'bg-slate-800/80');
}

function unhighlight(e) {
    dropZone.classList.remove('border-medical-500', 'bg-slate-800/80');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles({ target: { files: files } });
}

function handleFiles(e) {
    const files = e.target.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                dropZone.classList.add('hidden');
                previewContainer.classList.remove('hidden');
                analyzeBtn.disabled = false;
                analyzeBtn.classList.remove('bg-slate-700', 'text-slate-400', 'cursor-not-allowed');
                analyzeBtn.classList.add('bg-medical-600', 'text-white', 'hover:bg-medical-500', 'cursor-pointer', 'shadow-lg', 'shadow-medical-500/20');
                
                // Reset results if any
                resetResults();
            };
            reader.readAsDataURL(file);
        }
    }
}

function resetUpload(e) {
    e.stopPropagation(); // Prevent triggering dropZone click
    fileInput.value = '';
    previewImage.src = '';
    dropZone.classList.remove('hidden');
    previewContainer.classList.add('hidden');
    analyzeBtn.disabled = true;
    analyzeBtn.className = 'w-full py-4 rounded-xl bg-slate-700 text-slate-400 font-bold cursor-not-allowed transition-all duration-300';
    resetResults();
}

function resetResults() {
    emptyState.classList.remove('hidden');
    loadingState.classList.add('hidden');
    resultsContent.classList.add('hidden');
    statusBadge.textContent = "Waiting for input";
    statusBadge.className = "px-3 py-1 rounded-full text-xs font-mono bg-slate-800 text-slate-400 border border-slate-600";
}

function simulateAnalysis() {
    // 1. Update UI for processing
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Analyzing...';
    
    emptyState.classList.add('hidden');
    loadingState.classList.remove('hidden');
    scanOverlay.classList.remove('hidden'); // Show scanning animation on image
    
    statusBadge.textContent = "Processing...";
    statusBadge.className = "px-3 py-1 rounded-full text-xs font-mono bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 animate-pulse";

    // 2. Simulate Delay (Network request / inference time)
    setTimeout(() => {
        // 3. Generate Random Result
        const results = [
            { label: "Non Demented", cdr: "0", color: "text-green-400", barColor: "from-green-500 to-emerald-400" },
            { label: "Very Mild Demented", cdr: "0.5", color: "text-yellow-400", barColor: "from-yellow-400 to-orange-400" },
            { label: "Mild Demented", cdr: "1", color: "text-orange-500", barColor: "from-orange-500 to-red-500" },
            { label: "Moderate Demented", cdr: "2", color: "text-red-500", barColor: "from-red-600 to-rose-600" }
        ];

        // Pick a random result for demo purposes
        // In a real app, this would come from the backend response
        const randomResult = results[Math.floor(Math.random() * results.length)];
        const randomConfidence = (Math.random() * (99.9 - 85.0) + 85.0).toFixed(1);

        // 4. Update UI with Results
        loadingState.classList.add('hidden');
        resultsContent.classList.remove('hidden');
        scanOverlay.classList.add('hidden'); // Stop scanning animation

        statusBadge.textContent = "Completed";
        statusBadge.className = "px-3 py-1 rounded-full text-xs font-mono bg-green-500/20 text-green-500 border border-green-500/30";

        resultLabel.textContent = randomResult.label;
        resultLabel.className = `text-3xl font-bold tracking-wide ${randomResult.color}`;
        
        confidenceScore.textContent = `${randomConfidence}%`;
        confidenceScore.className = `text-2xl font-mono ${randomResult.color}`;

        cdrScore.textContent = randomResult.cdr;
        
        // Animate bar width
        confidenceBar.className = `h-full bg-gradient-to-r ${randomResult.barColor} transition-all duration-1000 w-0`;
        setTimeout(() => {
            confidenceBar.style.width = `${randomConfidence}%`;
        }, 100);

        // Reset button
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = 'Analyze Again';
        analyzeBtn.className = 'w-full py-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold transition-all duration-300';

    }, 3500); // 3.5 seconds delay
}

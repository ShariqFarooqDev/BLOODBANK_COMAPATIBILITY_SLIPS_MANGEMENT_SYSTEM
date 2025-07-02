document.addEventListener('DOMContentLoaded', function() {
    // Initialize saved receipts
    loadSavedReceipts();
    
    // Next step buttons
    const nextButtons = document.querySelectorAll('.next-step');
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = parseInt(this.getAttribute('data-step'));
            const nextStep = currentStep + 1;
            
            // Hide current step
            document.getElementById(`step-${currentStep}`).classList.remove('active');
            document.getElementById(`step-${currentStep}-indicator`).classList.remove('active');
            
            // Show next step
            document.getElementById(`step-${nextStep}`).classList.add('active');
            document.getElementById(`step-${nextStep}-indicator`).classList.add('active');
        });
    });
    
    // Previous step buttons
    const prevButtons = document.querySelectorAll('.prev-step');
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = parseInt(this.getAttribute('data-step'));
            const prevStep = currentStep - 1;
            
            // Hide current step
            document.getElementById(`step-${currentStep}`).classList.remove('active');
            document.getElementById(`step-${currentStep}-indicator`).classList.remove('active');
            
            // Show previous step
            document.getElementById(`step-${prevStep}`).classList.add('active');
            document.getElementById(`step-${prevStep}-indicator`).classList.add('active');
        });
    });
    
    // Form submission
    const bloodForm = document.getElementById('bloodForm');
    bloodForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get the current form ID if it exists (for editing existing records)
        const currentId = bloodForm.getAttribute('data-editing-id') || Date.now().toString();
        
        // Get all form values
        const patientName = document.getElementById('patientName').value;
        const mrNumber = document.getElementById('mrNumber').value;
        const so = document.getElementById('so').value;
        const orderNumber = document.getElementById('orderNumber').value;
        const age = document.getElementById('age').value;
        const ward = document.getElementById('ward').value;
        const gender = document.getElementById('gender').value;
        const hospital = document.getElementById('hospital').value;
        const consultant = document.getElementById('consultant').value;
        const ipr = document.getElementById('ipr').value;
        const crossmatchDate = document.getElementById('crossmatchDate').value;
        const sampleDate = document.getElementById('sampleDate').value;
        const productGroup = document.getElementById('productGroup').value;
        const patientGroup = document.getElementById('patientGroup').value;
        const results = document.getElementById('results').value;
        
        // Get selected radio values
        const immediateSpin = document.querySelector('input[name="immediateSpin"]:checked').value;
        const albumin = document.querySelector('input[name="albumin"]:checked').value;
        const indirectCoombs = document.querySelector('input[name="indirectCoombs"]:checked').value;
        
        // Get selected TTI test values
        const hbsag = document.querySelector('input[name="hbsag"]:checked').value;
        const hivAntibody = document.querySelector('input[name="hivAntibody"]:checked').value;
        const antiHcv = document.querySelector('input[name="antiHcv"]:checked').value;
        const syphilisRpr = document.querySelector('input[name="syphilisRpr"]:checked').value;
        const malariaParasite = document.querySelector('input[name="malariaParasite"]:checked').value;
        
        // Create receipt data object
        const receiptData = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            patientName, mrNumber, so, orderNumber, age, ward, gender, hospital, consultant, ipr,
            crossmatchDate, sampleDate, productGroup, patientGroup, results,
            immediateSpin, albumin, indirectCoombs,
            hbsag, hivAntibody, antiHcv, syphilisRpr, malariaParasite
        };
        
        // Save receipt data
        saveReceipt(receiptData);
        
        // Update receipt preview
        document.getElementById('r_patientName').textContent = patientName || '-';
        document.getElementById('r_mrNumber').textContent = mrNumber || '-';
        document.getElementById('r_so').textContent = so || '-';
        document.getElementById('r_orderNumber').textContent = orderNumber || '-';
        document.getElementById('r_age').textContent = age || '-';
        document.getElementById('r_ward').textContent = ward || '-';
        document.getElementById('r_gender').textContent = gender || '-';
        document.getElementById('r_hospital').textContent = hospital || '-';
        document.getElementById('r_consultant').textContent = consultant || '-';
        document.getElementById('r_ipr').textContent = ipr || '-';
        document.getElementById('r_crossmatchDate').textContent = formatDate(crossmatchDate) || '-';
        document.getElementById('r_sampleDate').textContent = formatDate(sampleDate) || '-';
        document.getElementById('r_productGroup').textContent = productGroup || '-';
        document.getElementById('r_patientGroup').textContent = patientGroup || '-';
        document.getElementById('r_immediateSpin').textContent = immediateSpin || 'Negative';
        document.getElementById('r_albumin').textContent = albumin || 'Negative';
        document.getElementById('r_indirectCoombs').textContent = indirectCoombs || 'Negative';
        
        // Update TTI test results in the receipt
        document.getElementById('r_hbsag').textContent = hbsag || 'Non-Reactive';
        document.getElementById('r_hivAntibody').textContent = hivAntibody || 'Non-Reactive';
        document.getElementById('r_antiHcv').textContent = antiHcv || 'Non-Reactive';
        document.getElementById('r_syphilisRpr').textContent = syphilisRpr || 'Negative';
        document.getElementById('r_malariaParasite').textContent = malariaParasite || 'Negative';
        
        // Update compatibility result
        if (results === 'Compatible') {
            document.getElementById('r_results').textContent = 'COMPATIBLE';
        } else {
            document.getElementById('r_results').textContent = 'NOT COMPATIBLE';
        }
        
        // Hide form and show receipt
        document.querySelector('.card').style.display = 'none';
        document.querySelector('.receipt-preview').style.display = 'block';
    });
    
    // Back button
    document.getElementById('backToForm').addEventListener('click', function() {
        document.querySelector('.card').style.display = 'block';
        document.querySelector('.receipt-preview').style.display = 'none';
    });
    
    // Set up import file listener
    document.getElementById('importFile').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importedData = JSON.parse(e.target.result);
                    if (Array.isArray(importedData)) {
                        // Replace current receipts with imported ones
                        localStorage.setItem('bloodBankReceipts', JSON.stringify(importedData));
                        loadSavedReceipts();
                        alert('Successfully imported ' + importedData.length + ' compatibility slips');
                    } else {
                        throw new Error('Invalid format');
                    }
                } catch (error) {
                    alert('Error importing file: ' + error.message);
                }
            };
            reader.readAsText(file);
        }
    });
});

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Save receipt to localStorage
function saveReceipt(receiptData) {
    let receipts = JSON.parse(localStorage.getItem('bloodBankReceipts') || '[]');
    // Check if a receipt with the same id exists
    const existingIndex = receipts.findIndex(r => r.id === receiptData.id);
    if (existingIndex !== -1) {
        // Update the existing receipt
        receipts[existingIndex] = receiptData;
    } else {
        // Add as new receipt
        receipts.push(receiptData);
    }
    localStorage.setItem('bloodBankReceipts', JSON.stringify(receipts));
    loadSavedReceipts();
}

// Load saved receipts from localStorage
function loadSavedReceipts() {
    const receiptList = document.getElementById('receiptList');
    receiptList.innerHTML = '';
    
    const receipts = JSON.parse(localStorage.getItem('bloodBankReceipts') || '[]');
    
    if (receipts.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.className = 'list-group-item text-center';
        emptyItem.textContent = 'No saved compatibility slips';
        receiptList.appendChild(emptyItem);
        return;
    }
    
    // Sort receipts by date (newest first)
    receipts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    receipts.forEach(receipt => {
        const item = document.createElement('li');
        item.className = 'list-group-item d-flex justify-content-between align-items-center';
        
        const date = new Date(receipt.date).toLocaleDateString();
        item.innerHTML = `
            <div>
                <strong>${receipt.patientName || 'Unnamed Patient'}</strong> - ${date}<br>
                <small>MR#: ${receipt.mrNumber || 'N/A'}, ${receipt.productGroup || 'Unknown'} → ${receipt.patientGroup || 'Unknown'}</small>
            </div>
            <div>
                <button class="btn btn-sm btn-primary me-2" onclick="loadReceipt('${receipt.id}')"><i class="fas fa-eye"></i></button>
                <button class="btn btn-sm btn-danger" onclick="deleteReceipt('${receipt.id}')"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        receiptList.appendChild(item);
    });
}

// Load a specific receipt
function loadReceipt(id) {
    const receipts = JSON.parse(localStorage.getItem('bloodBankReceipts') || '[]');
    const receipt = receipts.find(r => r.id === id);
    
    if (!receipt) return;
    
    // Fill form with receipt data
    document.getElementById('patientName').value = receipt.patientName || '';
    document.getElementById('mrNumber').value = receipt.mrNumber || '';
    document.getElementById('so').value = receipt.so || '';
    document.getElementById('orderNumber').value = receipt.orderNumber || '';
    document.getElementById('age').value = receipt.age || '';
    document.getElementById('ward').value = receipt.ward || '';
    document.getElementById('gender').value = receipt.gender || '';
    document.getElementById('hospital').value = receipt.hospital || '';
    document.getElementById('consultant').value = receipt.consultant || '';
    document.getElementById('ipr').value = receipt.ipr || '';
    document.getElementById('crossmatchDate').value = receipt.crossmatchDate || '';
    document.getElementById('sampleDate').value = receipt.sampleDate || '';
    document.getElementById('productGroup').value = receipt.productGroup || '';
    document.getElementById('patientGroup').value = receipt.patientGroup || '';
    document.getElementById('results').value = receipt.results || 'Compatible';
    
    // Set radio buttons
    if (receipt.immediateSpin) {
        document.querySelector(`input[name="immediateSpin"][value="${receipt.immediateSpin}"]`).checked = true;
    }
    if (receipt.albumin) {
        document.querySelector(`input[name="albumin"][value="${receipt.albumin}"]`).checked = true;
    }
    if (receipt.indirectCoombs) {
        document.querySelector(`input[name="indirectCoombs"][value="${receipt.indirectCoombs}"]`).checked = true;
    }
    if (receipt.hbsag) {
        document.querySelector(`input[name="hbsag"][value="${receipt.hbsag}"]`).checked = true;
    }
    if (receipt.hivAntibody) {
        document.querySelector(`input[name="hivAntibody"][value="${receipt.hivAntibody}"]`).checked = true;
    }
    if (receipt.antiHcv) {
        document.querySelector(`input[name="antiHcv"][value="${receipt.antiHcv}"]`).checked = true;
    }
    if (receipt.syphilisRpr) {
        document.querySelector(`input[name="syphilisRpr"][value="${receipt.syphilisRpr}"]`).checked = true;
    }
    if (receipt.malariaParasite) {
        document.querySelector(`input[name="malariaParasite"][value="${receipt.malariaParasite}"]`).checked = true;
    }
    
    // Show the form with loaded data
    document.getElementById('step-1').classList.add('active');
    document.getElementById('step-1-indicator').classList.add('active');
    document.getElementById('step-2').classList.remove('active');
    document.getElementById('step-2-indicator').classList.remove('active');
    document.getElementById('step-3').classList.remove('active');
    document.getElementById('step-3-indicator').classList.remove('active');
    
    document.querySelector('.card').style.display = 'block';
    document.querySelector('.receipt-preview').style.display = 'none';
}

// Delete a receipt
function deleteReceipt(id) {
    if (confirm('Are you sure you want to delete this compatibility slip?')) {
        let receipts = JSON.parse(localStorage.getItem('bloodBankReceipts') || '[]');
        receipts = receipts.filter(r => r.id !== id);
        localStorage.setItem('bloodBankReceipts', JSON.stringify(receipts));
        loadSavedReceipts();
    }
}

// Export all receipts
function exportReceipts() {
    const receipts = JSON.parse(localStorage.getItem('bloodBankReceipts') || '[]');
    if (receipts.length === 0) {
        alert('No compatibility slips to export');
        return;
    }
    
    const dataStr = JSON.stringify(receipts, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileName = 'blood_bank_slips_' + new Date().toISOString().slice(0, 10) + '.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
}
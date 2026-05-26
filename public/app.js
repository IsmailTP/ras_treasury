document.addEventListener('DOMContentLoaded', () => {
    const offeringsList = document.getElementById('offerings-list');
    const form = document.getElementById('offering-form');
    const adminBtn = document.getElementById('admin-btn');
    const adminResponse = document.getElementById('admin-response');

    // Fetch and display offerings
    async function fetchOfferings() {
        try {
            const res = await fetch('/api/treasure');
            const data = await res.json();
            
            offeringsList.innerHTML = '';
            
            if (data.length === 0) {
                offeringsList.innerHTML = '<p style="color: var(--text-secondary);">No offerings made yet.</p>';
                return;
            }

            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <div class="card-title">${escapeHTML(item.name)}</div>
                    <div class="card-value">Value: ${item.value}</div>
                    <div class="card-value" style="font-size: 0.8rem; margin-top: 0.5rem; opacity: 0.5;">ID: ${item.id}</div>
                `;
                offeringsList.appendChild(card);
            });
        } catch (err) {
            console.error('Failed to fetch offerings', err);
        }
    }

    // Submit new offering
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const value = parseInt(document.getElementById('value').value, 10);

        try {
            const res = await fetch('/api/treasure', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, value })
            });
            
            // Note: The response contains the hidden isAdmin field
            const data = await res.json();
            
            if (res.ok) {
                form.reset();
                fetchOfferings();
            } else {
                alert('Failed to submit offering: ' + (data.error || 'Unknown error'));
            }
        } catch (err) {
            console.error(err);
        }
    });

    // Admin shrine check
    adminBtn.addEventListener('click', async () => {
        adminResponse.classList.remove('hidden', 'error-msg', 'success-msg');
        adminResponse.textContent = 'Checking...';
        
        try {
            const res = await fetch('/api/admin/treasury');
            const data = await res.json();
            
            if (res.ok) {
                adminResponse.classList.add('success-msg');
                adminResponse.innerHTML = `${data.message}<br><br><strong style="color: #ffd700; font-size: 1.2rem;">${data.flag}</strong>`;
            } else {
                adminResponse.classList.add('error-msg');
                adminResponse.textContent = data.error || 'Access denied.';
            }
        } catch (err) {
            console.error(err);
            adminResponse.classList.add('error-msg');
            adminResponse.textContent = 'An error occurred contacting the shrine.';
        }
    });

    // Utility to prevent XSS in rendering
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    // Initial fetch
    fetchOfferings();
});

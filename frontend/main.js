// Base API URL
const apiUrl = 'http://127.0.0.1:8000/birthdays/';

// Fetch and display entries
async function fetchEntries() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Error fetching entries');
        entries = await response.json();
        displayEntries();
    } catch (error) {
        console.error('Failed to fetch entries:', error);
    }
}


// Assuming the rest of the main.js code remains the same

// Display entries in the HTML
function displayEntries() {
    const entriesDiv = document.getElementById('entries');
    entriesDiv.innerHTML = ''; // Clear current entries
    entries.forEach(entry => {
        entriesDiv.innerHTML += `
            <div class="entry">
                <span>${entry.name}: ${new Date(entry.birthday).toISOString().split('T')[0]}</span>
                <button onclick="deleteEntry(${entry.id})">Delete</button>
            </div>
        `;
    });
}

// Add or Update an entry
async function addOrUpdateEntry() {
    const nameInput = document.getElementById('name');
    const birthdayInput = document.getElementById('birthday');
    const entry = {
        name: nameInput.value,
        birthday: birthdayInput.value,
    };

    // Adding new entries only for simplicity. Update logic would need tracking selected entry's ID
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(entry),
        });
        if (!response.ok) throw new Error('Error adding/updating entry');
        const addedEntry = await response.json(); // Get the added entry from response
        entries.push(addedEntry); // Add the new entry to the local list
        displayEntries(); // Refresh the displayed list
        nameInput.value = ''; // Clear form
        birthdayInput.value = ''; // Clear form
    } catch (error) {
        console.error('Failed to add/update entry:', error);
    }
}

// Delete an entry
async function deleteEntry(entryId) {
    try {
        const response = await fetch(`${apiUrl}${entryId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error deleting entry');
        fetchEntries(); // Refresh entries list
    } catch (error) {
        console.error('Failed to delete entry:', error);
    }
}

// Initial fetch of the entries
fetchEntries();

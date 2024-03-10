let updateEntryID=null;

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

// Display entries in the HTML
function displayEntries() {
    const entriesDiv = document.getElementById('entries');
    entriesDiv.innerHTML = ''; 

    // Function to format date from "mm/dd/yyyy"
    function formatDate(dateString) {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    entries.forEach(entry => {
        const formattedBirthday = formatDate(entry.birthday);
        entriesDiv.innerHTML += `
            <div class="entry">
                <span>${entry.name}: ${formattedBirthday}</span>
                <button onclick="deleteEntry(${entry.id})">Delete</button>
                <button onclick="prepareUpdateForm(${entry.id})">Edit</button>

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

    
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(entry),
        });
        if (!response.ok) throw new Error('Error adding/updating entry');
        const addedEntry = await response.json(); 
        entries.push(addedEntry); 
        displayEntries(); 
        nameInput.value = ''; 
        birthdayInput.value = ''; 
    } catch (error) {
        console.error('Failed to add/update entry:', error);
    }
}

let currentEntryId = null; 

function prepareUpdateForm(entryId) {
    const entry = entries.find(e => e.id === entryId);
    if (!entry) return;

    document.getElementById('editName').value = entry.name;
    document.getElementById('editBirthday').value = entry.birthday; 
    currentEntryId = entryId;

    // Display the modal
    document.getElementById('editModal').style.display = "flex";
}

// Close the modal when the user clicks on save changes (x)
document.getElementsByClassName("close")[0].onclick = function() {
    document.getElementById('editModal').style.display = "none";
}

// Close the modal if the user clicks anywhere outside of it
window.onclick = function(event) {
    if (event.target == document.getElementById('editModal')) {
        document.getElementById('editModal').style.display = "none";
    }
}

// Update the entry
async function updateEntry() {
    const updatedName = document.getElementById('editName').value;
    const updatedBirthday = document.getElementById('editBirthday').value;

    try {
        const response = await fetch(`${apiUrl}${currentEntryId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: updatedName, birthday: updatedBirthday }),
        });
        if (!response.ok) throw new Error('Error updating entry');

        // Refresh the entries list
        fetchEntries();
        // Hide the modal
        document.getElementById('editModal').style.display = "none";
    } catch (error) {
        console.error('Failed to update entry:', error);
    }
}


// Delete an entry
async function deleteEntry(entryId) {
    try {
        const response = await fetch(`${apiUrl}${entryId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error deleting entry');
        fetchEntries(); 
    } catch (error) {
        console.error('Failed to delete entry:', error);
    }
}


fetchEntries();

const apiUrl = "https://jsonplaceholder.typicode.com/posts"; // Simulated server API

const quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Do what you can, with what you have, where you are.", category: "Inspiration" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" }
];

// Simulate periodic fetching from the server
setInterval(fetchQuotesFromServer, 5000); // Every 5 seconds simulate server fetching

async function fetchQuotesFromServer() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const serverQuotes = data.map(quote => ({
            text: quote.title,  // Using 'title' as quote text for simplicity
            category: quote.body // Using 'body' as category for simplicity
        }));
        syncData(serverQuotes);
    } catch (error) {
        console.error("Error fetching server data:", error);
    }
}

function syncData(serverQuotes) {
    const localQuotes = [...quotes];
    const conflicts = [];

    // Compare local quotes with server quotes
    serverQuotes.forEach((serverQuote, index) => {
        const localQuote = localQuotes[index];
        if (localQuote && serverQuote && (localQuote.text !== serverQuote.text || localQuote.category !== serverQuote.category)) {
            conflicts.push({ index, localQuote, serverQuote });
        }
    });

    if (conflicts.length > 0) {
        resolveConflicts(conflicts, serverQuotes);
    } else {
        // If no conflict, just sync
        updateLocalStorage(serverQuotes);
    }
}

function resolveConflicts(conflicts, serverQuotes) {
    conflicts.forEach(conflict => {
        const userChoice = confirm(`Conflict detected for quote #${conflict.index + 1}. Do you want to overwrite with server data?`);

        if (userChoice) {
            // User accepts server data
            quotes[conflict.index] = serverQuotes[conflict.index];
        } else {
            // User keeps local data (no change)
            console.log("User kept local data for quote:", conflict.localQuote);
        }
    });

    updateLocalStorage(quotes);
    alert("Conflicts resolved.");
}

function updateLocalStorage(updatedQuotes) {
    localStorage.setItem("quotes", JSON.stringify(updatedQuotes));
    populateCategories();
    showRandomQuote();
}

// Add functionality to send new quote data to the server (POST request)
async function addQuoteToServer(newQuote) {
    try {
        const response = await fetch(apiUrl, {
            method: "POST", // Use POST to send new data
            headers: {
                "Content-Type": "application/json", // Content type is JSON
            },
            body: JSON.stringify(newQuote) // Send the new quote in the request body
        });

        const result = await response.json();
        console.log("Quote added to server:", result);
    } catch (error) {
        console.error("Error adding quote to server:", error);
    }
}

function showRandomQuote(filteredQuotes = quotes) {
    const quoteDisplay = document.getElementById("quoteDisplay");
    if (!quoteDisplay || filteredQuotes.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    
    const categoryElement = document.createElement('p');
    categoryElement.textContent = `Category: ${quote.category}`;
    const textElement = document.createElement('p');
    textElement.textContent = quote.text;
    
    quoteDisplay.textContent = '';
    quoteDisplay.appendChild(categoryElement);
    quoteDisplay.appendChild(textElement);
    
    sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Existing functionality (Add quotes, populate categories, etc.)
document.addEventListener("DOMContentLoaded", () => {
    populateCategories();
    showRandomQuote();
    
    document.getElementById("newQuote").addEventListener("click", () => showRandomQuote());
    document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
    createAddQuoteForm();
});

function addQuote(event) {
    event.preventDefault();
    
    const text = document.getElementById("newQuoteText").value.trim();
    const category = document.getElementById("newQuoteCategory").value.trim();
    
    if (text && category) {
        quotes.push({ text, category });
        localStorage.setItem("quotes", JSON.stringify(quotes));

        // Send the new quote to the server
        addQuoteToServer({ text, category });

        populateCategories();
        showRandomQuote();
        
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
    }
}

function createAddQuoteForm() {
    const formContainer = document.createElement("div");
    formContainer.innerHTML = `
        <h3>Add a New Quote</h3>
        <form id="addQuoteForm">
            <input id="newQuoteText" type="text" placeholder="Enter a new quote" required />
            <input id="newQuoteCategory" type="text" placeholder="Enter quote category" required />
            <button type="submit">Add Quote</button>
        </form>
        <button onclick="exportToJsonFile()">Export Quotes</button>
        <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
    `;
    document.body.appendChild(formContainer);

    document.getElementById("addQuoteForm").addEventListener("submit", addQuote);
}

function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    if (!categoryFilter) return;
    
    const categories = ["All Categories", ...new Set(quotes.map(q => q.category))];
    categoryFilter.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join("\n");
}

function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("selectedCategory", selectedCategory);
    
    if (selectedCategory === "All Categories") {
        showRandomQuote();
    } else {
        const filteredQuotes = quotes.filter(q => q.category === selectedCategory);
        showRandomQuote(filteredQuotes);
    }
}

function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        localStorage.setItem("quotes", JSON.stringify(quotes));
        populateCategories();
        alert("Quotes imported successfully!");
    };
    fileReader.readAsText(event.target.files[0]);
}

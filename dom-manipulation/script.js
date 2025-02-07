const quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Do what you can, with what you have, where you are.", category: "Inspiration" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" }
];

function showRandomQuote(filteredQuotes = quotes) {
    const quoteDisplay = document.getElementById("quoteDisplay");
    if (!quoteDisplay || filteredQuotes.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    
    // Using textContent instead of innerHTML
    const categoryElement = document.createElement('p');
    categoryElement.textContent = `Category: ${quote.category}`;
    const textElement = document.createElement('p');
    textElement.textContent = quote.text;
    
    // Clear the previous content before adding new content
    quoteDisplay.textContent = '';
    quoteDisplay.appendChild(categoryElement);
    quoteDisplay.appendChild(textElement);
    
    sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

document.addEventListener("DOMContentLoaded", () => {
    populateCategories();
    showRandomQuote();
    
    // Event listeners for interaction
    document.getElementById("newQuote").addEventListener("click", () => showRandomQuote());
    document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
    createAddQuoteForm();
});

function addQuote(event) {
    event.preventDefault(); // Prevent form submission reload
    
    const text = document.getElementById("newQuoteText").value.trim();
    const category = document.getElementById("newQuoteCategory").value.trim();
    
    if (text && category) {
        quotes.push({ text, category });
        localStorage.setItem("quotes", JSON.stringify(quotes));
        populateCategories();
        showRandomQuote();
        
        // Clear input fields after adding quote
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

    // Attach event listener to form submission
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

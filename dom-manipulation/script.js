const quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Do what you can, with what you have, where you are.", category: "Inspiration" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" }
];

function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    if (!quoteDisplay) return;
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    
    quoteDisplay.innerHTML = `<p><strong>Category:</strong> ${quote.category}</p><p>${quote.text}</p>`;
    sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

document.addEventListener("DOMContentLoaded", () => {
    showRandomQuote();
    document.getElementById("newQuote").addEventListener("click", showRandomQuote);
    createAddQuoteForm();
});

function addQuote() {
    const text = document.getElementById("newQuoteText").value.trim();
    const category = document.getElementById("newQuoteCategory").value.trim();
    
    if (text && category) {
        quotes.push({ text, category });
        localStorage.setItem("quotes", JSON.stringify(quotes));
        showRandomQuote();
        
        // Clear input fields after adding quote
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
    }
}

function createAddQuoteForm() {
    const formContainer = document.createElement("div");
    formContainer.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button onclick="addQuote()">Add Quote</button>
        <button onclick="exportToJsonFile()">Export Quotes</button>
        <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
    `;
    document.body.appendChild(formContainer);
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
        alert("Quotes imported successfully!");
    };
    fileReader.readAsText(event.target.files[0]);
}

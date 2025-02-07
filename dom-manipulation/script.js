const quotes = [
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
}

document.addEventListener("DOMContentLoaded", () => {
    showRandomQuote();
    document.getElementById("newQuote").addEventListener("click", showRandomQuote);
});

function addQuote() {
    const text = document.getElementById("newQuoteText").value.trim();
    const category = document.getElementById("newQuoteCategory").value.trim();
    
    if (text && category) {
        quotes.push({ text, category });
        showRandomQuote(); // Update the displayed quote
    }
}

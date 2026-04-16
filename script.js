

// 1. SELECTING ELEMENTS
const searchBtn = document.getElementById('search-btn');
const wordInput = document.getElementById('word-input');
const resultDisplay = document.getElementById('result-display');

// 2. EVENT LISTENER: Triggered when user clicks search
searchBtn.addEventListener('click', () => {
    const word = wordInput.value.trim();
    if (word) {
        fetchDictionaryData(word);
    }
});

// 3. FETCH 
async function fetchDictionaryData(word) {
    const apiURL = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    
    // Show a loading state
    resultDisplay.innerHTML = `<p>Searching for "${word}"...</p>`;

    try {
        const response = await fetch(apiURL);
        
        // ERROR HANDLING: Requirement "Display message if word is not found"
        if (!response.ok) {
            throw new Error("We couldn't find that word. Check your spelling!");
        }

        const data = await response.json();
        renderResult(data[0]); // Send first object in array to display function

    } catch (error) {
        resultDisplay.innerHTML = `<p class="error-text">${error.message}</p>`;
    }
}

// 4. Rendering the function
function renderResult(data) {
    // Extracting synonyms safely
    const synonyms = data.meanings[0].synonyms.length > 0 
        ? data.meanings[0].synonyms.slice(0, 3).map(s => `<span>${s}</span>`).join('')
        : "No synonyms found.";

    // Finding the audio if the word exists
    const audioSrc = data.phonetics.find(p => p.audio !== "")?.audio || "";

    resultDisplay.innerHTML = `
        <div class="word-header">
            <h2>${data.word}</h2>
            <small>${data.phonetic || ''}</small>
        </div>
        
        <p><strong>${data.meanings[0].partOfSpeech}</strong></p>
        <p>${data.meanings[0].definitions[0].definition}</p>
        
        <div class="synonyms">
            <p><strong>Synonyms:</strong> ${synonyms}</p>
        </div>

        ${audioSrc ? `<button onclick="new Audio('${audioSrc}').play()">🔊 Play Pronunciation</button>` : ''}
    `;
}
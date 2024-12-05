let tooltip = null;
let timer = null;

// Create tooltip element
function createTooltip() {
  const div = document.createElement('div');
  div.className = 'word-helper-tooltip';
  div.style.display = 'none';
  document.body.appendChild(div);
  return div;
}

// Get word information from API
async function getWordInfo(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error('Error fetching word info:', error);
    return null;
  }
}

// Format word information for display
function formatWordInfo(info) {
  if (!info) return 'No information available';

  let html = '';
  
  // Definition
  if (info.meanings && info.meanings[0]) {
    html += `
      <div class="word-helper-section">
        <div class="word-helper-section-title">Definition:</div>
        ${info.meanings[0].definitions[0].definition}
      </div>
    `;
  }

  // Synonyms
  if (info.meanings && info.meanings[0].synonyms && info.meanings[0].synonyms.length > 0) {
    html += `
      <div class="word-helper-section">
        <div class="word-helper-section-title">Synonyms:</div>
        ${info.meanings[0].synonyms.slice(0, 3).join(', ')}
      </div>
    `;
  }

  // Example
  if (info.meanings && info.meanings[0].definitions[0].example) {
    html += `
      <div class="word-helper-section">
        <div class="word-helper-section-title">Example:</div>
        "${info.meanings[0].definitions[0].example}"
      </div>
    `;
  }

  return html;
}

// Show tooltip with word information
async function showTooltip(event) {
  const selection = window.getSelection();
  const word = selection.toString().trim();

  if (word.length < 2) return;

  if (!tooltip) {
    tooltip = createTooltip();
  }

  const wordInfo = await getWordInfo(word);
  tooltip.innerHTML = formatWordInfo(wordInfo);
  
  // Position tooltip near the selected text
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  tooltip.style.left = `${rect.left + window.scrollX}px`;
  tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;
  tooltip.style.display = 'block';
}

// Hide tooltip
function hideTooltip() {
  if (tooltip) {
    tooltip.style.display = 'none';
  }
}

// Event listeners
document.addEventListener('mouseup', (event) => {
  clearTimeout(timer);
  timer = setTimeout(() => showTooltip(event), 200);
});

document.addEventListener('mousedown', () => {
  clearTimeout(timer);
  hideTooltip();
});
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const clearBtn = document.getElementById('clear-btn');

let conversation = [];

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  conversation.push({ role: 'user', text: userMessage });

  const loadingId = Date.now();

  appendMessage('bot', '...', loadingId);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation })
    });

    const data = await response.json();

    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) loadingElement.remove();

    if (data.result) {
      appendMessage('bot', data.result);
      conversation.push({ role: 'model', text: data.result });
    } else {
      throw new Error(data.message || 'Error');
    }

  } catch (error) {
    console.error(error);
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) loadingElement.remove();
    appendMessage('bot', 'system error: ' + error.message);
  }
});

function appendMessage(sender, text, id = null) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  if (id) msg.id = id;
  msg.textContent = text;
  chatBox.appendChild(msg);
  
  chatBox.scrollTop = chatBox.scrollHeight;
}

clearBtn.addEventListener('click', () => {
    if (confirm("bersihkan seluruh percakapan?")) {
        chatBox.innerHTML = '';
        conversation = [];
    }
});
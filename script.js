document.addEventListener("DOMContentLoaded", function () {
    // Check if the popup has been shown before (using localStorage)
    if (!localStorage.getItem("popupShown")) {
        // Show the popup
        document.getElementById("popup-overlay").style.display = "block";
        document.getElementById("popup-container").style.display = "block";

        // Set flag in localStorage to indicate that the popup has been shown
        localStorage.setItem("popupShown", "true");
    }
});

function closePopup() {
    // Hide the popup
    document.getElementById("popup-overlay").style.display = "none";
    document.getElementById("popup-container").style.display = "none";
}


document.getElementById('message-form').addEventListener('submit', sendMessage);


function copyMessage(btn) {
    const messageText = btn.previousElementSibling.textContent; // Get the text content of the message
    navigator.clipboard.writeText(messageText); // Copy the text to clipboard
    alert("Message copied to clipboard!"); // Optional: Show a notification to the user
}

async function sendMessage(event) {
    event.preventDefault();

    const userInput = document.getElementById('user-input');
    const userMessage = userInput.value.trim();

    if (userMessage === '') return;

    appendMessage('user', userMessage);
    userInput.value = '';

    const response = await fetch('/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();
    const assistantMessage = data.message;
    appendMessage('assistant', assistantMessage);
}

function appendMessage(sender, message) {
    const chatContainer = document.getElementById('chat-container');
    const messageElement = document.createElement('div');
    messageElement.classList.add(`${sender}-message`);
    messageElement.textContent = message;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

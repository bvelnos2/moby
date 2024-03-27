document.getElementById('message-form').addEventListener('submit', sendMessage);

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

function copyMessage(btn) {
    const messageText = btn.previousElementSibling.textContent; // Get the text content of the message
    navigator.clipboard.writeText(messageText); // Copy the text to clipboard
    alert("Message copied to clipboard!"); // Optional: Show a notification to the user
}

// script.js
function copyMessage(btn) {
    // Find the message content relative to the clicked button
    const messageContent = btn.parentElement.nextElementSibling.textContent.trim();

    // Copy the message content to the clipboard
    navigator.clipboard.writeText(messageContent);

    // Optional: Show a notification to the user
    alert("Message copied to clipboard!");
}

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

async function sendMessage(message) {
    try {
        const response = await fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', { // Use the ChatGPT 3.5 model
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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' // Replace with your actual API key
            },
            body: JSON.stringify({
                model: 'text-davinci-003', // Use the ChatGPT 3.5 model
                prompt: `Moby: ${message}`, // Prefix the message with the assistant's name
                max_tokens: 10000
            })
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to send message: ${errorMessage}`);
        }

        const data = await response.json();
        return data.choices[0].text.trim();
    } catch (error) {
        console.error('Error:', error);
        return 'Oops! Something went wrong.';
    }
}

// Define a function to handle form submission
document.getElementById('message-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form submission

    const userInput = document.getElementById('user-input').value;
    if (!userInput.trim()) {
        return;
    }

    // Display user's message
    displayMessage('You', userInput);

    // Send user's message to the OpenAI Assistant
    const assistantResponse = await sendMessage(userInput);

    // Display assistant's response
    displayMessage('Moby', assistantResponse);

    // Clear input field
    document.getElementById('user-input').value = '';
});

// Define a function to display messages in the chat container
function displayMessage(sender, message) {
    const chatContainer = document.getElementById('chat-container');
    const messageElement = document.createElement('div');
    messageElement.classList.add('assistant-message');
    const senderElement = document.createElement('div');
    senderElement.classList.add('sender');
    senderElement.textContent = sender;
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.innerHTML = `
        <img src="https://raw.githubusercontent.com/bvelnos2/tmoprojects/main/assets/images/Moby%20Logo-w.png" alt="Assistant Avatar" class="avatar">
        <div class="copy-message-btn" onclick="copyMessage(this)">
            <i class="material-icons">content_copy</i>
        </div>
    `;
    const messageText = document.createElement('p');
    messageText.textContent = message;
    messageElement.appendChild(senderElement);
    messageElement.appendChild(messageContent);
    messageElement.appendChild(messageText);
    chatContainer.appendChild(messageElement);
}

// Define a function to copy message text to clipboard
function copyMessage(button) {
    const messageText = button.parentNode.nextSibling.textContent;
    navigator.clipboard.writeText(messageText)
        .then(() => {
            console.log('Message copied to clipboard:', messageText);
        })
        .catch((error) => {
            console.error('Error copying message:', error);
        });
}

// Define a function to close the popup
function closePopup() {
    document.getElementById('popup-container').style.display = 'none';
    document.getElementById('popup-overlay').style.display = 'none';
}

// Show the popup on first-time visit
document.addEventListener('DOMContentLoaded', function () {
    const isFirstTimeVisit = localStorage.getItem('isFirstTimeVisit');
    if (!isFirstTimeVisit) {
        document.getElementById('popup-container').style.display = 'block';
        document.getElementById('popup-overlay').style.display = 'block';
        localStorage.setItem('isFirstTimeVisit', 'true');
    }
});


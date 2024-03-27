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
        const response = await fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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'
            },
            body: JSON.stringify({
                model: 'text-davinci-003',
                prompt: `Moby: ${message}`,
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


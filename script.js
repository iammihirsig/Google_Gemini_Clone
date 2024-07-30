const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");

let userMessage = null;

// Create a new message element and return it
const createMessageElement = (content, ...classes) => {
	const div = document.createElement("div");
	div.classList.add("message", ...classes);
	div.innerHTML = content;
	return div;
};

// Show a loading animation while waiting for the API response
const showLoadingAnimation = () => {
	const html = `<div class="message-content">
					<img src="img/gemini.svg" alt="Gemini Image" class="avatar" />
					<p class="text"></p>
                    <div class="loading-indicator">
                        <div class="loading-bar"></div>
                        <div class="loading-bar"></div>
                        <div class="loading-bar"></div>
                    </div>
				</div>
				<span class="icon material-symbols-rounded">content_copy</span>`;

	const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
	chatList.appendChild(incomingMessageDiv);
};

// Handle sending outgoing messages
const handleOutgoingChat = () => {
	// Access the value of the input field correctly
	userMessage = typingForm.querySelector(".typing-input").value.trim();
	if (!userMessage) return; // Exit if there is no message

	const html = `<div class="message-content">
					<img src="img/user.jpg" alt="User Image" class="avatar" />
					<p class="text"></p>
				</div>`;

	const outgoingMessageDiv = createMessageElement(html, "outgoing");
	outgoingMessageDiv.querySelector(".text").innerText = userMessage;
	chatList.appendChild(outgoingMessageDiv);

	// Clear the input field after sending the message
	// typingForm.querySelector(".typing-input").value = '';
	typingForm.reset(); // Clear Input Field
	setTimeout(showLoadingAnimation, 500); // Show loading animation after a delay
};

// Prevent default from submission and handle outgoing chat
typingForm.addEventListener("submit", (e) => {
	e.preventDefault();

	handleOutgoingChat();
});

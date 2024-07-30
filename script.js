const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");

let userMessage = null;

// Create a new message element and return it
const createMessageElement = (content, className) => {
	const div = document.createElement("div");
	div.classList.add("message", className);
	div.innerHTML = content;
	return div;
};

// Handle sending outgoing messages
const handleOutgoingChat = () => {
	userMessage = typingForm.querySelector(".typing-input").ariaValueMax.trim();
	if (!userMessage) return; // Exit if there is no message

	const html = `<div class="message-content">
					<img src="img/user.jpg" alt="User Image" class="avatar" />
					<p class="text"></p>
				</div>`;

	const outgoingMessageDiv = createMessageElement(html, "outgoing");
	outgoingMessageDiv.querySelector(".text").innerText = userMessage;
	chatList.appendChild(outgoingMessageDiv);
};

// Prevent default from submission and handle outgoing chat
typingForm.addEventListener("submit", (e) => {
	e.preventDefault();

	handleOutgoingChat();
});
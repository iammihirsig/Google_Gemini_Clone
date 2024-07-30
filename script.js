const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");

let userMessage = null;

// API Configuration
const API_KEY = "ENTER_YOUR_API"; // Enter your own API Key
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

// Create a new message element and return it
const createMessageElement = (content, ...classes) => {
	const div = document.createElement("div");
	div.classList.add("message", ...classes);
	div.innerHTML = content;
	return div;
};

// Show typing effect by displaying words one by one
const showTypingEffect = (text, textElement) => {
	const words = text.split(" ");
	let currentWordIndex = 0;

	const typingInterval = setInterval(() => {
		// Append each word to the text element with a space
		textElement.innerText +=
			(currentWordIndex === 0 ? "" : " ") + words[currentWordIndex++];

		// If all words are displayed
		if (currentWordIndex === words.length) {
			clearInterval(typingInterval);
		}
	}, 75);
};

// Fetch response from the API based on user message
const generateAPIResponse = async (incomingMessageDiv) => {
	const textElement = incomingMessageDiv.querySelector(".text"); // Get text element

	// Send a POST request to the API with user's message
	try {
		const response = await fetch(API_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				contents: [
					{
						role: "user",
						parts: [{ text: userMessage }],
					},
				],
			}),
		});

		// Get the API Response text
		const data = await response.json();
		const apiResponse = data?.candidates[0].content.parts[0].text;

		// Display the API response text with typing effect
		showTypingEffect(apiResponse, textElement);
	} catch (error) {
		console.log(error);
	} finally {
		incomingMessageDiv.classList.remove("loading");
	}
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
				<span onclick="copyMessage(this)" class="icon material-symbols-rounded">content_copy</span>`;

	const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
	chatList.appendChild(incomingMessageDiv);

	generateAPIResponse(incomingMessageDiv);
};

const copyMessage = (copyIcon) => {
	const messageText = copyIcon.parentElement.querySelector(".text").innerText;

	navigator.clipboard.writeText(messageText);
	copyIcon.innerText = "done"; // Show tick icon
	setTimeout(() => (copyIcon.innerText = "content_copy"), 1000); // Revert icon after 1 sec
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
	typingForm.reset(); // Clear Input Field
	setTimeout(showLoadingAnimation, 500); // Show loading animation after a delay
};

// Prevent default from submission and handle outgoing chat
typingForm.addEventListener("submit", (e) => {
	e.preventDefault();

	handleOutgoingChat();
});

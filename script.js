const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");
const toggleThemeButton = document.querySelector("#toggle-theme-button");

// Key for local storage
const THEME_STORAGE_KEY = "themeColor";
const CHAT_STORAGE_KEY = "savedChats";

// Initialize the theme from local storage
const applyStoredTheme = () => {
	const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
	if (savedTheme) {
		document.body.classList.toggle("light_mode", savedTheme === "light_mode");
		toggleThemeButton.innerText =
			savedTheme === "light_mode" ? "dark_mode" : "light_mode";
	}
};

// Apply stored theme on page load
applyStoredTheme();

// Initialize the chat from local storage
const applyStoredChat = () => {
	const savedChat = localStorage.getItem(CHAT_STORAGE_KEY);
	if (savedChat) {
		chatList.innerHTML = savedChat;
	}
};

// Apply stored chat on page load
applyStoredChat();

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

		// Scroll to the bottom while typing
		chatList.scrollTop = chatList.scrollHeight;

		// If all words are displayed
		if (currentWordIndex === words.length) {
			clearInterval(typingInterval);
			saveChatHistory(); // Save chats to local storage after typing effect

			// Show the copy icon after typing effect is done
			textElement.parentElement.querySelector(".icon").style.display = "inline";
		}
	}, 75);
};

// Fetch response from the API based on user message
const generateAPIResponse = async (incomingMessageDiv) => {
	const textElement = incomingMessageDiv.querySelector(".text"); // Get text element
	const copyIcon = incomingMessageDiv.querySelector(".icon");

	// Hide the copy icon while response is being typed
	copyIcon.style.display = "none";

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

		// Remove asterisks from the response
		const cleanedResponse = apiResponse.replace(/\*/g, "");

		// Display the API response text with typing effect
		showTypingEffect(cleanedResponse, textElement);
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

	// Scroll to the bottom after adding the loading animation
	chatList.scrollTop = chatList.scrollHeight;

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
					<p class="text">${userMessage}</p>
				</div>`;

	const outgoingMessageDiv = createMessageElement(html, "outgoing");
	chatList.appendChild(outgoingMessageDiv);

	// Scroll to the bottom after adding the outgoing message
	chatList.scrollTop = chatList.scrollHeight;

	// Clear the input field after sending the message
	typingForm.reset(); // Clear Input Field
	setTimeout(showLoadingAnimation, 500); // Show loading animation after a delay
};

// Save chat history to local storage
const saveChatHistory = () => {
	localStorage.setItem(CHAT_STORAGE_KEY, chatList.innerHTML);
};

// Toggle between light and dark themes
toggleThemeButton.addEventListener("click", () => {
	const isLightMode = document.body.classList.toggle("light_mode");
	localStorage.setItem(
		THEME_STORAGE_KEY,
		isLightMode ? "light_mode" : "dark_mode"
	);
	toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";
});

// Prevent default from submission and handle outgoing chat
typingForm.addEventListener("submit", (e) => {
	e.preventDefault();

	handleOutgoingChat();
});

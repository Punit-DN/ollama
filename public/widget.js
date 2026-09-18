(function () {
  "use strict";

  // ==========================================
  // CONFIGURATION
  // ==========================================

  const CHATBOT_API =
  "https://aichatbot-nu-gules.vercel.app/api/chat";

  // ==========================================
  // PREVENT DUPLICATE INITIALIZATION
  // ==========================================

  if (window.__DN_CHATBOT_LOADED__) {
    return;
  }

  window.__DN_CHATBOT_LOADED__ = true;

  // ==========================================
  // CHAT HISTORY
  // ==========================================

  let messages = [
    {
      role: "assistant",
      content: "Hi 👋 How can I help you today?",
    },
  ];

  let isOpen = false;
  let isLoading = false;

  // ==========================================
  // CREATE STYLES
  // ==========================================

  const style = document.createElement("style");

  style.textContent = `
    .dn-chatbot-button {
      position: fixed;
      right: 25px;
      bottom: 25px;

      width: 60px;
      height: 60px;

      border: none;
      border-radius: 50%;

      background: #111;
      color: #fff;

      font-size: 25px;

      cursor: pointer;

      box-shadow: 0 8px 30px rgba(0,0,0,.2);

      z-index: 999999;
    }

    .dn-chatbot-window {
      position: fixed;

      right: 25px;
      bottom: 25px;

      width: 370px;
      height: 520px;

      background: #fff;

      border-radius: 18px;

      overflow: hidden;

      box-shadow: 0 15px 50px rgba(0,0,0,.2);

      display: none;
      flex-direction: column;

      z-index: 999999;

      border: 1px solid #e5e5e5;

      font-family:
        Arial,
        Helvetica,
        sans-serif;
    }

    .dn-chatbot-header {
      padding: 18px 20px;

      background: #111;
      color: #fff;

      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .dn-chatbot-title {
      font-size: 17px;
      font-weight: 600;
    }

    .dn-chatbot-status {
      margin-top: 4px;

      font-size: 12px;

      opacity: .8;

      display: flex;
      align-items: center;

      gap: 6px;
    }

    .dn-status-dot {
      width: 7px;
      height: 7px;

      background: #4ade80;

      border-radius: 50%;
    }

    .dn-chatbot-close {
      border: none;

      background: transparent;

      color: #fff;

      font-size: 28px;

      line-height: 1;

      cursor: pointer;
    }

    .dn-chatbot-messages {
      flex: 1;

      padding: 20px;

      overflow-y: auto;

      display: flex;
      flex-direction: column;

      gap: 12px;

      background: #fafafa;
    }

    .dn-chat-message {
      max-width: 80%;

      padding: 11px 14px;

      border-radius: 14px;

      font-size: 14px;

      line-height: 1.5;

      word-break: break-word;
    }

    .dn-assistant-message {
      align-self: flex-start;

      background: #fff;

      color: #222;

      border: 1px solid #e8e8e8;

      border-bottom-left-radius: 5px;
    }

    .dn-user-message {
      align-self: flex-end;

      background: #111;

      color: #fff;

      border-bottom-right-radius: 5px;
    }

    .dn-chatbot-input-area {
      padding: 12px;

      background: #fff;

      border-top: 1px solid #e5e5e5;

      display: flex;

      gap: 8px;
    }

    .dn-chatbot-input {
      flex: 1;

      height: 42px;

      border: 1px solid #ddd;

      border-radius: 10px;

      padding: 0 12px;

      outline: none;

      font-size: 14px;

      min-width: 0;
    }

    .dn-chatbot-send {
      width: 42px;
      height: 42px;

      border: none;

      border-radius: 10px;

      background: #111;

      color: #fff;

      cursor: pointer;

      font-size: 17px;
    }

    .dn-chatbot-send:disabled {
      opacity: .4;

      cursor: not-allowed;
    }

    .dn-chatbot-typing {
      display: flex;

      gap: 4px;

      width: fit-content;
    }

    .dn-chatbot-typing span {
      width: 6px;
      height: 6px;

      background: #777;

      border-radius: 50%;

      animation: dnChatTyping 1.2s infinite ease-in-out;
    }

    .dn-chatbot-typing span:nth-child(2) {
      animation-delay: .15s;
    }

    .dn-chatbot-typing span:nth-child(3) {
      animation-delay: .3s;
    }

    @keyframes dnChatTyping {
      0%,
      60%,
      100% {
        transform: translateY(0);
        opacity: .4;
      }

      30% {
        transform: translateY(-4px);
        opacity: 1;
      }
    }

    @media (max-width: 500px) {

      .dn-chatbot-window {
        right: 10px;
        bottom: 10px;

        width: calc(100vw - 20px);

        height: calc(100vh - 100px);

        max-height: 650px;
      }

      .dn-chatbot-button {
        right: 18px;
        bottom: 18px;
      }
    }
  `;

  document.head.appendChild(style);

  // ==========================================
  // CHAT BUTTON
  // ==========================================

  const button = document.createElement("button");

  button.className = "dn-chatbot-button";

  button.innerHTML = "💬";

  button.setAttribute(
    "aria-label",
    "Open AI assistant"
  );

  document.body.appendChild(button);

  // ==========================================
  // CHAT WINDOW
  // ==========================================

  const chatWindow = document.createElement("div");

  chatWindow.className = "dn-chatbot-window";

  chatWindow.innerHTML = `
    <div class="dn-chatbot-header">

      <div>
        <div class="dn-chatbot-title">
          AI Assistant
        </div>

        <div class="dn-chatbot-status">
          <span class="dn-status-dot"></span>
          Online
        </div>
      </div>

      <button
        class="dn-chatbot-close"
        aria-label="Close chatbot"
      >
        ×
      </button>

    </div>

    <div class="dn-chatbot-messages"></div>

    <div class="dn-chatbot-input-area">

      <input
        class="dn-chatbot-input"
        type="text"
        placeholder="Type your message..."
      />

      <button
        class="dn-chatbot-send"
        aria-label="Send message"
      >
        ➤
      </button>

    </div>
  `;

  document.body.appendChild(chatWindow);

  // ==========================================
  // ELEMENTS
  // ==========================================

  const closeButton =
    chatWindow.querySelector(
      ".dn-chatbot-close"
    );

  const messagesContainer =
    chatWindow.querySelector(
      ".dn-chatbot-messages"
    );

  const input =
    chatWindow.querySelector(
      ".dn-chatbot-input"
    );

  const sendButton =
    chatWindow.querySelector(
      ".dn-chatbot-send"
    );

  // ==========================================
  // RENDER MESSAGES
  // ==========================================

  function renderMessages() {
    messagesContainer.innerHTML = "";

    messages.forEach(function (message) {
      const messageElement =
        document.createElement("div");

      messageElement.className =
        "dn-chat-message " +
        (message.role === "user"
          ? "dn-user-message"
          : "dn-assistant-message");

      messageElement.textContent =
        message.content;

      messagesContainer.appendChild(
        messageElement
      );
    });

    messagesContainer.scrollTop =
      messagesContainer.scrollHeight;
  }

  // ==========================================
  // TYPING INDICATOR
  // ==========================================

  function showTyping() {
    const typing =
      document.createElement("div");

    typing.className =
      "dn-chat-message dn-assistant-message dn-chatbot-typing";

    typing.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;

    messagesContainer.appendChild(typing);

    messagesContainer.scrollTop =
      messagesContainer.scrollHeight;
  }

  // ==========================================
  // OPEN CHAT
  // ==========================================

  button.addEventListener("click", function () {
    isOpen = true;

    button.style.display = "none";

    chatWindow.style.display = "flex";

    renderMessages();

    input.focus();
  });

  // ==========================================
  // CLOSE CHAT
  // ==========================================

  closeButton.addEventListener(
    "click",
    function () {
      isOpen = false;

      chatWindow.style.display = "none";

      button.style.display = "block";
    }
  );

  // ==========================================
  // SEND MESSAGE
  // ==========================================

  async function sendMessage() {
    const userMessage =
      input.value.trim();

    if (!userMessage || isLoading) {
      return;
    }

    // Add user message
    messages.push({
      role: "user",
      content: userMessage,
    });

    input.value = "";

    renderMessages();

    // Loading
    isLoading = true;

    sendButton.disabled = true;

    input.disabled = true;

    showTyping();

    try {
      const response =
        await fetch(CHATBOT_API, {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            messages: messages.slice(-15),
          }),
        });

      const data =
        await response.json();

      // Remove typing indicator
      const typing =
        messagesContainer.querySelector(
          ".dn-chatbot-typing"
        );

      if (typing) {
        typing.remove();
      }

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ||
            "Something went wrong."
        );
      }

      // Add AI response
      messages.push({
        role: "assistant",
        content: data.message,
      });

      renderMessages();
    } catch (error) {
      console.error(
        "DN Chatbot Error:",
        error
      );

      const typing =
        messagesContainer.querySelector(
          ".dn-chatbot-typing"
        );

      if (typing) {
        typing.remove();
      }

      messages.push({
        role: "assistant",
        content:
          "Sorry, something went wrong. Please try again.",
      });

      renderMessages();
    } finally {
      isLoading = false;

      sendButton.disabled = false;

      input.disabled = false;

      input.focus();
    }
  }

  // ==========================================
  // SEND BUTTON
  // ==========================================

  sendButton.addEventListener(
    "click",
    sendMessage
  );

  // ==========================================
  // ENTER KEY
  // ==========================================

  input.addEventListener(
    "keydown",
    function (event) {
      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {
        event.preventDefault();

        sendMessage();
      }
    }
  );

  // ==========================================
  // INITIAL RENDER
  // ==========================================

  renderMessages();
})();
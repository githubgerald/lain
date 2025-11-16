// ==========================================
// CHAT RENDERER - Populates messages dynamically
// ==========================================

const CHAT_ID = 1234; // Current chat ID
const API_URL = `http://localhost:5000/api/v0/chats/${CHAT_ID}`;

/**
 * STEP 1: Create HTML for a single message
 * This function takes message data and returns HTML string
 */
function createMessageHTML(messageData) {
  const {
    username,
    userType,
    message,
    time,
    date,
    mediaType,
    mediaUrl
  } = messageData;

  // Determine the styling ID based on userType
  const styleMap = {
    'user': 'userStyling',
    'admin': 'adminStyling',
    'others': 'othersStyling',
    'mention': 'mentionStyling'
  };
  
  const stylingId = styleMap[userType] || 'othersStyling';

  // Create media HTML if media exists
  let mediaHTML = '';
  if (mediaType && mediaUrl) {
    if (mediaType === 'image') {
      mediaHTML = `
        <div class="media-wrapper" data-media-type="image">
          <div class="media-container">
            <img src="${mediaUrl}" alt="Shared image" class="media-content">
            <div class="grain-overlay"></div>
          </div>
        </div>
      `;
    } else if (mediaType === 'video') {
      mediaHTML = `
        <div class="media-wrapper" data-media-type="video">
          <div class="media-container">
            <div class="target">
              <video class="media-content" loop muted>
                <source src="${mediaUrl}" type="video/mp4">
              </video>
              <div class="video-controls">
                <div class="visualizer-container">
                  <canvas class="audio-visualizer" width="100" height="40"></canvas>
                </div>
                <div class="volume-container">
                  <button class="volume-button"></button>
                  <div class="volume-indicator">50</div>
                </div>
              </div>
              <div class="grain-overlay"></div>
            </div>
          </div>
        </div>
      `;
    }
  }

  // Build the complete message HTML
  return `
    <div class="pythonScript">
      <span class="userName" id="${userType}">
        <span id="${stylingId}">[${username}]</span>
      </span>
      <span class="gapBetween">-</span>
      <span class="timeSent">${time}
        ${date ? `<span class="daySent">${date}</span>` : ''}
      </span>
      <p class="messageStyling">
        ${message}
        ${mediaHTML}
      </p>
    </div>
  `;
}

/**
 * STEP 2: Fetch messages from server
 * Makes a GET request to retrieve all messages
 */
async function fetchMessages() {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.messages || [];
    
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

/**
 * STEP 3: Render all messages to the page
 * Takes array of messages and updates the DOM
 */
function renderMessages(messages) {
  // Find the scrollable container
  const chatContainer = document.querySelector('.textSection .scrollable');
  
  if (!chatContainer) {
    console.error('Chat container not found!');
    return;
  }

  // Clear existing content
  chatContainer.innerHTML = '';

  // Create HTML for each message
  messages.forEach(messageData => {
    const messageHTML = createMessageHTML(messageData);
    chatContainer.innerHTML += messageHTML;
  });

  // Initialize media wrappers for any videos/images
  initializeMediaWrappers();

  // Scroll to bottom to show latest messages
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

/**
 * STEP 4: Initialize media elements (videos/images)
 * This reinitializes the MediaWrapper class for new elements
 */
function initializeMediaWrappers() {
  const mediaWrappers = document.querySelectorAll('.media-wrapper');
  mediaWrappers.forEach(wrapper => {
    new MediaWrapper(wrapper);
  });
}

/**
 * STEP 5: Send a new message
 * Posts message to server with metadata
 */
async function sendMessage(messageText, currentUser = 'user') {
  // Don't send empty messages
  if (!messageText.trim()) {
    return;
  }

  // Create message object with metadata
  const messageData = {
    username: getCurrentUsername(), // You'll need to implement this
    userType: currentUser,
    message: messageText,
    time: getCurrentTime(),
    date: getCurrentDate(),
    mediaType: null,
    mediaUrl: null
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // After sending, reload messages to show the new one
    await loadAndRenderMessages();

    return true;

  } catch (error) {
    console.error('Error sending message:', error);
    return false;
  }
}

/**
 * HELPER: Get current time in HH:MM format
 */
function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * HELPER: Get current date in DD/MM/YYYY format
 */
function getCurrentDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * HELPER: Get current username
 * TODO: Replace with actual user authentication
 */
function getCurrentUsername() {
  // For now, return a default username
  // Later, you can get this from login/session
  return 'user';
}

/**
 * STEP 6: Main function to load and display messages
 * Call this when page loads
 */
async function loadAndRenderMessages() {
  const messages = await fetchMessages();
  renderMessages(messages);
}

/**
 * STEP 7: Initialize when page loads
 */
document.addEventListener('DOMContentLoaded', () => {
  // Load messages on page load
  loadAndRenderMessages();

  // Set up the send button
  const sendButton = document.getElementById('txtSend');
  const messageBox = document.getElementById('msgBox');

  if (sendButton) {
    sendButton.addEventListener('click', async () => {
      const messageText = messageBox.value;
      const success = await sendMessage(messageText);
      
      if (success) {
        // Clear the message box
        messageBox.value = '';
        // Update character counter
        document.getElementById('char').textContent = '0';
      }
    });
  }

  // Optional: Send on Enter key (if that checkbox is enabled)
  if (messageBox) {
    messageBox.addEventListener('keypress', async (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        const enterToSendEnabled = document.getElementById('enterToSend')?.checked;
        if (enterToSendEnabled) {
          e.preventDefault();
          sendButton.click();
        }
      }
    });
  }

  // Optional: Auto-refresh messages every 5 seconds
  // Uncomment this if you want real-time updates
  setInterval(loadAndRenderMessages, 1000);
});
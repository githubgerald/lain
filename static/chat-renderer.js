// ==========================================
// MULTI-ROOM CHAT RENDERER - DEBUGGED VERSION
// ==========================================

console.log('🚀 Chat renderer script loaded!');

// Global state - tracks which room we're currently in
let currentChatId = null;
const API_BASE_URL = '/api/v0/chats/';

/**
 * ROOM MANAGEMENT: Switch to a different chat room
 */
function chatSelect(chatId) {
  console.log('📍 chatSelect called with:', chatId);
  
  // Update the current chat ID
  currentChatId = chatId;
  console.log('✅ Current chat ID set to:', currentChatId);
  
  // Visual feedback - highlight the selected room button
  highlightSelectedRoom(chatId);
  
  // Load messages for this room
  loadAndRenderMessages();
  
  // Update the channel name display (optional)
  updateChannelName(chatId);
}

/**
 * Highlight the selected room button
 */
function highlightSelectedRoom(chatId) {
  console.log('🎨 Highlighting room:', chatId);
  
  // Remove 'active-chat' class from all buttons
  const allButtons = document.querySelectorAll('.chatsSection .button');
  allButtons.forEach(btn => {
    btn.classList.remove('active-chat');
  });
  
  // Add 'active-chat' class to selected button
  const selectedButton = document.querySelector(`.chatsSection .button[data-chat-id="${chatId}"]`);
  if (selectedButton) {
    selectedButton.classList.add('active-chat');
    console.log('✅ Button highlighted');
  } else {
    console.warn('⚠️ Could not find button for chat ID:', chatId);
  }
}

/**
 * Update the channel name display
 */
function updateChannelName(chatId) {
  const channelInput = document.getElementById('channelName');
  if (channelInput) {
    channelInput.placeholder = `Room #${chatId}`;
  }
}

/**
 * Get the API URL for the current chat
 */
function getApiUrl() {
  if (!currentChatId) {
    console.error('❌ No chat room selected!');
    return null;
  }
  const url = `${API_BASE_URL}${currentChatId}`;
  console.log('🔗 API URL:', url);
  return url;
}

// ==========================================
// MESSAGE RENDERING
// ==========================================

/**
 * Create HTML for a single message
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
 * Fetch messages from server for current room
 */
async function fetchMessages() {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    return [];
  }

  console.log('📥 Fetching messages from:', apiUrl);

  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Received messages:', data.messages?.length || 0);
    return data.messages || [];
    
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    return [];
  }
}

/**
 * Render all messages to the page
 */
function renderMessages(messages) {
  console.log('🎨 Rendering', messages.length, 'messages');
  
  const chatContainer = document.querySelector('.textSection .scrollable');
  
  if (!chatContainer) {
    console.error('❌ Chat container not found!');
    return;
  }

  // Show loading state
  chatContainer.innerHTML = '<p style="color: #66CCDA; text-align: center;">Loading messages...</p>';

  // If no messages, show empty state
  if (messages.length === 0) {
    chatContainer.innerHTML = '<p style="color: #66CCDA; text-align: center;">No messages yet. Be the first to say something!</p>';
    console.log('📭 No messages in this room');
    return;
  }

  // Clear and add messages
  chatContainer.innerHTML = '';
  messages.forEach((messageData, index) => {
    const messageHTML = createMessageHTML(messageData);
    chatContainer.innerHTML += messageHTML;
  });

  console.log('✅ Messages rendered');

  // Initialize media wrappers
  initializeMediaWrappers();

  // Scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

/**
 * Initialize media elements (videos/images)
 */
function initializeMediaWrappers() {
  if (typeof MediaWrapper === 'undefined') {
    console.warn('⚠️ MediaWrapper class not found - media may not work');
    return;
  }
  
  const mediaWrappers = document.querySelectorAll('.media-wrapper');
  console.log('🎬 Initializing', mediaWrappers.length, 'media elements');
  mediaWrappers.forEach(wrapper => {
    new MediaWrapper(wrapper);
  });
}

// ==========================================
// SENDING MESSAGES
// ==========================================

/**
 * Send a new message to current room
 */
async function sendMessage(messageText, currentUser = 'user') {
  if (!messageText.trim()) {
    console.warn('⚠️ Cannot send empty message');
    return false;
  }

  const apiUrl = getApiUrl();
  if (!apiUrl) {
    alert('Please select a chat room first!');
    return false;
  }

  console.log('📤 Sending message to room', currentChatId);

  const messageData = {
    username: getCurrentUsername(),
    userType: currentUser,
    message: messageText,
    time: getCurrentTime(),
    date: getCurrentDate(),
    mediaType: null,
    mediaUrl: null
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('✅ Message sent successfully');

    // Reload messages to show the new one
    await loadAndRenderMessages();

    return true;

  } catch (error) {
    console.error('❌ Error sending message:', error);
    alert('Failed to send message. Check console for details.');
    return false;
  }
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function getCurrentDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
}

let currentUsername = prompt("Enter your username:") || "Guest";
function getCurrentUsername() {
  return currentUsername || 'Guest';
}

/**
 * Main function to load and display messages for current room
 */
async function loadAndRenderMessages() {
  if (!currentChatId) {
    console.log('📭 No room selected yet');
    const chatContainer = document.querySelector('.textSection .scrollable');
    if (chatContainer) {
      chatContainer.innerHTML = '<p style="color: #66CCDA; text-align: center;">Select a chat room to begin</p>';
    }
    return;
  }

  console.log('🔄 Loading messages for room:', currentChatId);
  const messages = await fetchMessages();
  renderMessages(messages);
}

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🎬 DOM loaded - Initializing chat system');

  // Debug: Check what we can find
  const allButtons = document.querySelectorAll('.chatsSection .button');
  console.log('🔍 Found .button elements:', allButtons.length);
  
  const buttonsWithData = document.querySelectorAll('.chatsSection .button[data-chat-id]');
  console.log('🔍 Found buttons with data-chat-id:', buttonsWithData.length);

  // Set up room selection buttons
  buttonsWithData.forEach((button, index) => {
    const chatId = button.dataset.chatId;
    console.log(`🎯 Button ${index}: chat-id=${chatId}, value="${button.value}"`);
    
    button.addEventListener('click', () => {
      console.log('🖱️ Button clicked! Switching to room:', chatId);
      chatSelect(parseInt(chatId));
    });
  });

  if (buttonsWithData.length === 0) {
    console.error('❌ NO ROOM BUTTONS FOUND!');
    console.log('💡 Check that your HTML has:');
    console.log('   - class="button"');
    console.log('   - data-chat-id="1234"');
    console.log('   - inside element with class="chatsSection"');
  }

  // Set up the send button
  const sendButton = document.getElementById('txtSend');
  const messageBox = document.getElementById('msgBox');

  if (sendButton) {
    console.log('✅ Send button found');
    sendButton.addEventListener('click', async () => {
      console.log('📤 Send button clicked');
      const messageText = messageBox.value;
      const success = await sendMessage(messageText);
      
      if (success) {
        messageBox.value = '';
        const charCounter = document.getElementById('char');
        if (charCounter) {
          charCounter.textContent = '0';
        }
      }
    });
  } else {
    console.warn('⚠️ Send button not found (id="txtSend")');
  }

  // Send on Enter key
  if (messageBox) {
    console.log('✅ Message box found');
    messageBox.addEventListener('keypress', async (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        const enterToSendEnabled = document.getElementById('enterToSend')?.checked;
        if (enterToSendEnabled !== false) { // Default to true if setting not found
          e.preventDefault();
          sendButton?.click();
        }
      }
    });
  } else {
    console.warn('⚠️ Message box not found (id="msgBox")');
  }

  // Auto-select first room if available
  if (buttonsWithData.length > 0) {
    const firstChatId = parseInt(buttonsWithData[0].dataset.chatId);
    console.log('🎯 Auto-selecting first room:', firstChatId);
    chatSelect(firstChatId);
  } else {
    console.log('📭 No rooms to auto-select');
  }

  console.log('✅ Chat system initialization complete!');
});
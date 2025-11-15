// Settings menu toggle
function myFunction() {
  var popup = document.getElementById("settingsMenu");
  popup.classList.toggle("show");
}

/* // Media Wrapper functionality
class MediaWrapper {
    constructor(element) {
        this.wrapper = element;
        this.mediaType = element.dataset.mediaType;
        this.mediaContent = element.querySelector('.media-content');
        this.volume = 50; // Default volume
        
        if (this.mediaType === 'video') {
            this.initVideo();
        } else if (this.mediaType === 'image') {
            this.initImage();
        }
    }

    initImage() {
        // Images will naturally size themselves within the max constraints
        // No additional processing needed due to CSS handling
        this.mediaContent.addEventListener('load', () => {
            console.log('Image loaded:', this.mediaContent.src);
        });
    }

    initVideo() {
        this.video = this.mediaContent;
        this.controls = this.wrapper.querySelector('.video-controls');
        this.volumeButton = this.wrapper.querySelector('.volume-button');
        this.volumeIndicator = this.wrapper.querySelector('.volume-indicator');
        this.canvas = this.wrapper.querySelector('.audio-visualizer');
        this.canvasCtx = this.canvas.getContext('2d');

        // Set initial volume
        this.video.volume = this.volume / 100;
        this.updateVolumeIndicator();

        // Volume button click
        this.volumeButton.addEventListener('click', () => this.toggleMute());

        // Scroll to change volume
        this.wrapper.addEventListener('wheel', (e) => this.handleScroll(e), { passive: false });

        // Initialize audio visualizer
        this.video.addEventListener('play', () => this.initAudioContext(), { once: true });
        
        // Unmute on interaction
        this.video.addEventListener('click', () => {
            if (this.video.muted) {
                this.video.muted = false;
                this.volume = 50;
                this.video.volume = 0.5;
                this.updateVolumeIndicator();
            }
        });
    }

    handleScroll(e) {
        e.preventDefault();
        
        // Scroll down = decrease volume, scroll up = increase volume
        const delta = e.deltaY > 0 ? -5 : 5;
        this.volume = Math.max(0, Math.min(100, this.volume + delta));
        
        this.video.volume = this.volume / 100;
        this.video.muted = false;
        this.updateVolumeIndicator();
    }

    toggleMute() {
        if (this.volume === 0) {
            this.volume = 50;
            this.video.muted = false;
        } else {
            this.volume = 0;
        }
        
        this.video.volume = this.volume / 100;
        this.updateVolumeIndicator();
    }

    updateVolumeIndicator() {
        this.volumeIndicator.textContent = `${this.volume}%`;
    }

    initAudioContext() {
        try {
            // Create audio context
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            
            // Create media element source
            this.audioSource = this.audioContext.createMediaElementSource(this.video);
            
            // Create analyser
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
            
            // Connect nodes
            this.audioSource.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            // Start visualization
            this.drawVisualizer();
            
        } catch (error) {
            console.error('Error initializing audio context:', error);
        }
    }

    drawVisualizer() {
        if (!this.canvas || !this.analyser) return;

        const draw = () => {
            requestAnimationFrame(draw);
            
            this.analyser.getByteFrequencyData(this.dataArray);
            
            // Clear canvas with primary color
            this.canvasCtx.fillStyle = '#66CCDA';
            this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw frequency bars
            const barWidth = (this.canvas.width / this.bufferLength) * 2.5;
            let x = 0;
            
            for (let i = 0; i < this.bufferLength; i++) {
                const barHeight = (this.dataArray[i] / 255) * this.canvas.height * 0.8;
                
                // Create gradient effect
                const brightness = 100 + (this.dataArray[i] / 255) * 155;
                this.canvasCtx.fillStyle = `rgb(${brightness}, 204, 218)`;
                
                // Draw bar from bottom
                this.canvasCtx.fillRect(
                    x, 
                    this.canvas.height - barHeight, 
                    barWidth - 1, 
                    barHeight
                );
                
                x += barWidth;
            }
        };
        
        draw();
    }

    calculateDimensions(naturalWidth, naturalHeight) {
        const maxWidth = window.innerWidth * 0.7;
        const maxHeight = window.innerHeight * 0.7;
        
        let width = naturalWidth;
        let height = naturalHeight;
        
        // Scale down if too wide
        if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
        }
        
        // Scale down if too tall
        if (height > maxHeight) {
            width = (maxHeight / height) * width;
            height = maxHeight;
        }
        
        return { width: Math.floor(width), height: Math.floor(height) };
    }
}

// Initialize all media wrappers on page load
document.addEventListener('DOMContentLoaded', () => {
    const mediaWrappers = document.querySelectorAll('.media-wrapper');
    
    mediaWrappers.forEach(wrapper => {
        new MediaWrapper(wrapper);
    });
    
    console.log(`Initialized ${mediaWrappers.length} media wrappers`);
}); */

// GET request the chatlog

async function GETchatlog(url) {
    const response = await fetch("http://localhost:5000/api/v0/chats/1234");
    var chatlog = await response.json();
    console.log(chatlog)
}

// Character counter

let area = document.getElementById('msgBox');
let char = document.getElementById('char');

area.addEventListener('input', function () {

    let content = this.value;
    char.textContent = content.length;
});

// Chat / Share mode selector

let chat = document.getElementById('chatBtn');
let share = document.getElementById('shareBtn');

chat.addEventListener("change", function() {
    if (this.checked) {
        share.checked = false
        share.disabled = false
        this.disabled = true
    }
})

share.addEventListener("change", function() {
    if (this.checked) {
        chat.checked = false
        chat.disabled = false
        this.disabled = true
    }
})

// Update current time
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    const currentTime = `${hours}:${minutes}`;
    document.getElementById('timeTxt').textContent = currentTime;
}

// Update the time every minute
setInterval(updateTime, 60000);

// Initial call to display time immediately
updateTime()


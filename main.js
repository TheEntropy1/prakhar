document.addEventListener('DOMContentLoaded', function() {
    // Initialize player
    initPlayer();
    
    // Load content
    loadFeaturedContent();
    
    // Setup event listeners
    setupEventListeners();
});

function initPlayer() {
    // Create audio element if it doesn't exist
    if (!window.entropyAudio) {
        window.entropyAudio = new Audio();
        window.entropyAudio.crossOrigin = "anonymous";
        
        // Create audio context for advanced audio features
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            window.audioContext = new AudioContext();
            window.audioSource = window.audioContext.createMediaElementSource(window.entropyAudio);
            
            // Create audio nodes for effects
            window.analyser = window.audioContext.createAnalyser();
            window.gainNode = window.audioContext.createGain();
            window.stereoPanner = window.audioContext.createStereoPanner();
            window.convolver = window.audioContext.createConvolver();
            
            // Connect nodes
            window.audioSource.connect(window.analyser);
            window.analyser.connect(window.stereoPanner);
            window.stereoPanner.connect(window.gainNode);
            window.gainNode.connect(window.audioContext.destination);
            
            // Setup audio visualization
            setupAudioVisualization();
        } catch (e) {
            console.error('Web Audio API not supported', e);
        }
    }
}

function setupAudioVisualization() {
    // Audio visualization setup would go here
    // This would connect to canvas elements for visual effects
}

function loadFeaturedContent() {
    // In a real app, this would fetch from the API
    console.log('Loading featured content...');
}

function setupEventListeners() {
    // Player controls
    document.querySelector('.play-pause').addEventListener('click', togglePlay);
    document.querySelector('.next').addEventListener('click', playNext);
    document.querySelector('.previous').addEventListener('click', playPrevious);
    document.querySelector('.shuffle').addEventListener('click', toggleShuffle);
    document.querySelector('.repeat').addEventListener('click', toggleRepeat);
    
    // Volume control
    document.querySelector('.volume-button').addEventListener('click', toggleMute);
    
    // Progress bar
    const progressBar = document.querySelector('.player-progress-bar');
    progressBar.addEventListener('click', seek);
    
    // Volume bar
    const volumeBar = document.querySelector('.player-volume-bar');
    volumeBar.addEventListener('click', adjustVolume);
    
    // Card clicks
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            const id = this.getAttribute('data-id');
            navigateToContent(type, id);
        });
    });
    
    // Audio events
    window.entropyAudio.addEventListener('timeupdate', updateProgress);
    window.entropyAudio.addEventListener('ended', handleSongEnded);
}

function togglePlay() {
    if (window.entropyAudio.paused) {
        window.entropyAudio.play();
        document.querySelector('.play-pause').innerHTML = '<svg viewBox="0 0 16 16"><rect x="2" y="2" width="4" height="12"/><rect x="10" y="2" width="4" height="12"/></svg>';
    } else {
        window.entropyAudio.pause();
        document.querySelector('.play-pause').innerHTML = '<svg viewBox="0 0 16 16"><polygon points="2,2 14,8 2,14"/></svg>';
    }
}

function playNext() {
    // In a real app, this would play the next song in queue
    console.log('Playing next song');
}

function playPrevious() {
    // In a real app, this would play the previous song
    console.log('Playing previous song');
}

function toggleShuffle() {
    const shuffleButton = document.querySelector('.shuffle');
    shuffleButton.classList.toggle('active');
    console.log('Shuffle toggled');
}

function toggleRepeat() {
    const repeatButton = document.querySelector('.repeat');
    repeatButton.classList.toggle('active');
    console.log('Repeat toggled');
}

function toggleMute() {
    const volumeButton = document.querySelector('.volume-button');
    if (window.entropyAudio.volume === 0) {
        window.entropyAudio.volume = 0.7;
        volumeButton.innerHTML = '<svg viewBox="0 0 16 16"><path d="M12.945 1.379l-.651.763c1.577 1.462 2.57 3.544 2.57 5.858s-.993 4.396-2.57 5.858l.651.763a8.966 8.966 0 002.9-6.621 8.966 8.966 0 00-2.9-6.621zm-2.272 2.66l-.651.763a4.484 4.484 0 011.446 3.278 4.484 4.484 0 01-1.446 3.278l.651.763c1.04-.966 1.7-2.343 1.7-4.041 0-1.698-.66-3.075-1.7-4.041zM0 5v6h2.804L8 14V2L2.804 5H0zm7-1.268v8.536L3.072 10H1V6h2.072L7 3.732z"/></svg>';
    } else {
        window.entropyAudio.volume = 0;
        volumeButton.innerHTML = '<svg viewBox="0 0 16 16"><path d="M0 5v6h2.804L8 14V2L2.804 5H0zm7-1.268v8.536L3.072 10H1V6h2.072L7 3.732zm8.25 3.482a6.982 6.982 0 00-1.298-2.538l-.651.763a5.99 5.99 0 011.07 2.135l.879-.36zm-1.298 1.304a6.982 6.982 0 001.298-2.538l-.879-.36a5.99 5.99 0 01-1.07 2.135l.651.763z"/></svg>';
    }
}

function seek(e) {
    const percent = e.offsetX / this.offsetWidth;
    window.entropyAudio.currentTime = percent * window.entropyAudio.duration;
    document.querySelector('.player-progress-bar-fill').style.width = `${percent * 100}%`;
}

function adjustVolume(e) {
    const percent = e.offsetX / this.offsetWidth;
    window.entropyAudio.volume = percent;
    document.querySelector('.player-volume-bar-fill').style.width = `${percent * 100}%`;
}

function updateProgress() {
    const progress = (window.entropyAudio.currentTime / window.entropyAudio.duration) * 100;
    document.querySelector('.player-progress-bar-fill').style.width = `${progress}%`;
    
    // Update time display
    document.querySelector('.player-progress-time.current').textContent = formatTime(window.entropyAudio.currentTime);
    document.querySelector('.player-progress-time.total').textContent = formatTime(window.entropyAudio.duration);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function handleSongEnded() {
    // In a real app, this would handle what happens when a song ends
    console.log('Song ended');
}

function navigateToContent(type, id) {
    // In a real app, this would navigate to the appropriate page
    console.log(`Navigating to ${type} with id ${id}`);
}

// PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful');
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
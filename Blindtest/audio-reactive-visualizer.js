// Replace the current visualization code with this Web Audio API implementation

// Set up audio context and analyzer
let audioContext;
let analyzer;
let dataArray;
const bufferLength = 128; // Number of data points to analyze

// Initialize Web Audio API components
function initAudioAnalyzer() {
    // Create audio context
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create analyzer node
    analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256; // Must be power of 2
    
    // Connect audio element to analyzer
    const audioSource = audioContext.createMediaElementSource(audioElement);
    audioSource.connect(analyzer);
    analyzer.connect(audioContext.destination);
    
    // Create data array for frequency data
    dataArray = new Uint8Array(analyzer.frequencyBinCount);
}

// Start visualization that responds to audio
function startVisualization() {
    if (!audioContext) {
        initAudioAnalyzer();
    }
    
    // Resume audio context if suspended (browser policy)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    // Get frequency data and update visualization
    function updateVisualizer() {
        if (!isPlaying) return;
        
        // Get frequency data
        analyzer.getByteFrequencyData(dataArray);
        
        // Update each bar height based on frequency data
        // We'll use specific frequency ranges for each bar
        const numBars = musicBars.length;
        const segmentSize = Math.floor(bufferLength / numBars);
        
        for (let i = 0; i < numBars; i++) {
            // Calculate average value for this frequency segment
            let sum = 0;
            const startIndex = i * segmentSize;
            
            for (let j = 0; j < segmentSize; j++) {
                sum += dataArray[startIndex + j];
            }
            
            const average = sum / segmentSize;
            
            // Scale the value (0-255) to a reasonable bar height (10-100px)
            const height = 10 + (average / 255) * 90;
            
            // Apply height with a smooth transition
            musicBars[i].style.height = `${height}px`;
        }
        
        // Call the next frame
        visualizationFrame = requestAnimationFrame(updateVisualizer);
    }
    
    // Start the animation loop
    visualizationFrame = requestAnimationFrame(updateVisualizer);
}

// Stop visualization
function stopVisualization() {
    if (visualizationFrame) {
        cancelAnimationFrame(visualizationFrame);
        visualizationFrame = null;
    }
    
    // Reset bars to minimal height
    musicBars.forEach(bar => {
        bar.style.height = '5px';
    });
}

// Updated toggle play function
function togglePlay() {
    if (isPlaying) {
        audioElement.pause();
        playButton.innerHTML = '<i class="fas fa-play"></i>';
        stopVisualization();
    } else {
        // Create audio context on first play (to meet browser autoplay policies)
        if (!audioContext) {
            initAudioAnalyzer();
        }
        
        audioElement.play();
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
        startVisualization();
        
        // Auto-show the result after listening time
        setTimeout(() => {
            endRound();
        }, 10000); // Give users 10 seconds to listen
    }
    
    isPlaying = !isPlaying;
}

// Load a song with audio support
function loadSong(song) {
    // Set the audio source from the song object
    audioElement.src = song.audioUrl || 'https://example.com/placeholder.mp3';
    
    // Reset UI states
    playButton.innerHTML = '<i class="fas fa-play"></i>';
    isPlaying = false;
    resultContainer.style.display = 'none';
    stopVisualization();
}

// Update song data to include audio URLs (these would be real in production)
songs.forEach(song => {
    // For demo purposes, use a placeholder or sample audio files
    song.audioUrl = 'https://example.com/audio/' + song.id + '.mp3';
});

// Clean up function to run when changing songs
function cleanupAudio() {
    if (visualizationFrame) {
        cancelAnimationFrame(visualizationFrame);
    }
    
    if (audioContext && audioContext.state !== 'closed') {
        // Don't actually close it as that would require reinitializing
        audioContext.suspend();
    }
}

// Add cleanup to nextSong function
function nextSong() {
    cleanupAudio();
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(songs[currentSongIndex]);
}

// Add event listener for page unload to clean up resources
window.addEventListener('beforeunload', () => {
    if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
    }
});

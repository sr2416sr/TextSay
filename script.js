// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const text = document.getElementById("textToConvert");
    const convertBtn = document.getElementById("convertBtn");
    const error = document.querySelector('.error-para');
    const speechSynth = window.speechSynthesis;

    // Track if speech is currently playing
    let isPlaying = false;

    // Ensure button is visible and has correct text
    if (convertBtn) {
        convertBtn.textContent = "Play Converted Sound";
        convertBtn.style.display = "block";
    }

    // Function to reset button state
    function resetButton() {
        isPlaying = false;
        if (convertBtn) {
            convertBtn.textContent = "Play Converted Sound";
            convertBtn.disabled = false;
            convertBtn.style.display = "block";
            convertBtn.style.visibility = "visible";
        }
    }

    if (convertBtn) {
        convertBtn.addEventListener('click', function () {
            const enteredText = text ? text.value.trim() : "";

            // Check if text is empty
            if (!enteredText.length) {
                if (error) {
                    error.textContent = 'Nothing to Convert! Enter text in the text area.';
                }
                return;
            }

            // If speech is currently playing, stop it and return
            if (isPlaying) {
                speechSynth.cancel();
                resetButton();
                if (error) {
                    error.textContent = "";
                }
                return;
            }

            // Clear any previous error
            if (error) {
                error.textContent = "";
            }
            
            // Cancel any existing speech to clear the queue
            speechSynth.cancel();
            
            // Create new utterance
            const newUtterance = new SpeechSynthesisUtterance(enteredText);
            
            // Update button text when speech starts
            newUtterance.onstart = function() {
                isPlaying = true;
                if (convertBtn) {
                    convertBtn.textContent = "Sound is Playing...";
                }
            };
            
            // Reset button text when speech ends
            newUtterance.onend = function() {
                resetButton();
            };
            
            // Reset button text if there's an error
            newUtterance.onerror = function(event) {
                resetButton();
                if (error) {
                    error.textContent = "Error occurred while playing speech.";
                }
            };
            
            // Start speaking
            try {
                speechSynth.speak(newUtterance);
            } catch (e) {
                resetButton();
                if (error) {
                    error.textContent = "Error: Could not start speech.";
                }
            }
        });
    }
});
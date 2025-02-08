document.addEventListener("DOMContentLoaded", function () { 
    var userDataTS = JSON.parse(localStorage.getItem('userData') || '{}');

    // Ensure userDataTS has data before proceeding
    if (!userDataTS || Object.keys(userDataTS).length === 0) {
        // Default values
        userDataTS = {
            level: 1, // Default to level 1
            exp: 0,
            avgAccuracy: 100,
            avgKeysPerMinute: 0,
            lessonsCompleted: 0,
            keyStats: {},
            bestKey: '',
            worstKey: '',
            bestKPM: 0,
            dailyTimeSpent: {},
            loginStreak: 1,
            lastLogin: new Date().toDateString(),
        };
    }

    // Function to determine plant emoji based on level
    function getPlantEmoji(level) {
        if (level >= 4) return "🌳";  // Level 6 or above
        if (level >= 3) return "🌲";  // Level 4 or 5
        if (level >= 2) return "🪴";  // Level 2 or 3
        return "🌱";                  // Default Level 1
    }

    // Access and display data
    console.log("User Data:", userDataTS);

    var levelElement = document.getElementById('level');
    var expElement = document.getElementById('exp');
    var wpmElement = document.getElementById('wpm');
    var accuracyElement = document.getElementById('accuracy');
    var lessonsElement = document.getElementById('lessons');
    var bestKPMElement = document.getElementById('bestKPM');
    var streakElement = document.getElementById('streak');
    var bestKeyElement = document.getElementById('bestKey');
    var worstKeyElement = document.getElementById('worstKey');
    var treeEmojiElement = document.getElementById('tree-emoji');

    if (levelElement) levelElement.innerText = userDataTS.level.toString();
    if (expElement) expElement.innerText = userDataTS.exp.toString();
    if (wpmElement) wpmElement.innerText = userDataTS.avgKeysPerMinute.toString();
    if (accuracyElement) accuracyElement.innerText = userDataTS.avgAccuracy.toString();
    if (lessonsElement) lessonsElement.innerText = userDataTS.lessonsCompleted.toString();
    if (bestKPMElement) bestKPMElement.innerText = userDataTS.bestKPM.toString();
    if (streakElement) streakElement.innerText = userDataTS.loginStreak.toString();
    if (bestKeyElement) bestKeyElement.innerText = userDataTS.bestKey || '-';
    if (worstKeyElement) worstKeyElement.innerText = userDataTS.worstKey || '-';

    // Update the tree emoji based on level
    if (treeEmojiElement) {
        treeEmojiElement.innerText = getPlantEmoji(userDataTS.level);
    }
});

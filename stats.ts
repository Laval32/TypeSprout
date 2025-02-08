//this file was used to write the code, then converted to javascript. 
//ignore

document.addEventListener("DOMContentLoaded", () => {
    let userDataTS = JSON.parse(localStorage.getItem('userData') || '{}');
        //gets data, if null, defaults to parameters below


    // Ensure userDataTS has data before proceeding
    if (!userDataTS || Object.keys(userDataTS).length === 0) {
        // You can set default values if necessary
        userDataTS = {
            level: 0,
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

    // Access and display data
    console.log("User Data:", userDataTS);

    const levelElement = document.getElementById('level');
    const expElement = document.getElementById('exp');
    const wpmElement = document.getElementById('wpm');
    const accuracyElement = document.getElementById('accuracy');
    const lessonsElement = document.getElementById('lessons');
    const bestKPMElement = document.getElementById('bestKPM');
    const streakElement = document.getElementById('streak');
    const bestKeyElement = document.getElementById('bestKey');
    const worstKeyElement = document.getElementById('worstKey');

    if (levelElement) levelElement.innerText = userDataTS.level.toString();
    if (expElement) expElement.innerText = userDataTS.exp.toString();
    if (wpmElement) wpmElement.innerText = userDataTS.avgKeysPerMinute.toString();
    if (accuracyElement) accuracyElement.innerText = userDataTS.avgAccuracy.toString();
    if (lessonsElement) lessonsElement.innerText = userDataTS.lessonsCompleted.toString();
    if (bestKPMElement) bestKPMElement.innerText = userDataTS.bestKPM.toString();
    if (streakElement) streakElement.innerText = userDataTS.loginStreak.toString();
    if (bestKeyElement) bestKeyElement.innerText = userDataTS.bestKey || '-';
    if (worstKeyElement) worstKeyElement.innerText = userDataTS.worstKey || '-';
});

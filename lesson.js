// this file is used for collecting user statistics and displaying them on the lesson pages
//the stats page is used to retrieve the same data for other non lesson pages

//this sets the default starting parameters. 
// it gets the JSON saved data from local storage (userData), and if null, uses there parameters
let userData = JSON.parse(localStorage.getItem('userData')) || { 
    level: 1,
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
    lesson: 0
};

// Define eco lessons
const lesson1 = [
    "Small changes can make a big difference for the environment",
    "Turning off lights when not in use saves electricity",
    "Using reusable bags helps reduce plastic waste",
    "Planting trees helps clean the air and provides oxygen",
    "Conserving water prevents shortages and protects wildlife"
];

const lesson2 = [
    "Unplugging electronics when not in use saves energy",
    "Using LED light bulbs reduces energy consumption",
    "Insulating your home keeps it cooler in summer and warmer in winter",
    "Opting for energy-efficient appliances lowers electricity bills",
    "Solar panels use sunlight to generate clean renewable energy"
];

const lesson3 = [
    "Recycling reduces the amount of waste that ends up in landfills",
    "Paper products can be recycled to create new items",
    "Plastic recycling helps reduce the need for new plastic",
    "Glass can be recycled endlessly without losing quality",
    "Recycling metals helps conserve natural resources"
];

const lesson4 = [
    "Walking or biking reduces your carbon footprint",
    "Carpooling helps decrease the number of cars on the road",
    "Public transport is an energy-efficient way to travel",
    "Electric vehicles produce fewer emissions than gasoline cars",
    "Using ride-sharing services reduces traffic and pollution"
];

// Display the default values on page load
window.onload = function() {
    console.log("User Data Loaded:", userData);
    
    setUserDataDisplay();
    
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
        })
        .catch(error => console.error('Error loading header:', error));

    handleLoginStreak(); 

    // Set the lessonFocus parameter based on the page name
    setLessonFocusBasedOnPage();

    // Get lesson focus from URL and call addRandomText with it
    const lessonFocus = getLessonFocusFromURL();
    addRandomText(lessonFocus);
};

// Handle daily login streak
let today = new Date().toDateString(); //todays date
function handleLoginStreak() {
    if (userData.lastLogin !== today) { //if not today
        let lastLoginDate = new Date(userData.lastLogin);
        lastLoginDate.setDate(lastLoginDate.getDate() + 1); //sets next day
        
        if (lastLoginDate.toDateString() === today) { //adds day to login streak or resets
            userData.loginStreak += 1;  
        } else {
            userData.loginStreak = 1;
        }
        
        userData.lastLogin = today;
    }
    
    localStorage.setItem('userData', JSON.stringify(userData)); //basically returns to userData (local storage)
}

// Typing session tracking
let startTime, correctKeys = 0;
const typingInput = document.getElementById('typing-input'); //retrives input from html id 
typingInput.addEventListener('input', handleTyping); //listens to keys typed

document.addEventListener('DOMContentLoaded', () => { //after html loaded, it starts time
    startTime = new Date();
});

function handleTyping(event) { 
    //typed text, targettext, current key, and correct key
    let typedText = event.target.value;
    let targetText = document.getElementById('text-to-type').innerText;
    let currentChar = typedText[typedText.length - 1];
    let expectedChar = targetText[typedText.length - 1] || '';

    if (!userData.keyStats[currentChar]) {
        userData.keyStats[currentChar] = { correct: 0, missed: 0 };
    } //default, if not key pressed

    if (currentChar === expectedChar) { //typed correct key
        userData.keyStats[currentChar].correct++;
        correctKeys++;
    } else { //wrong key pressed
        userData.keyStats[expectedChar].missed++;
    }

    updateStats();
}

function updateStats() {
    let elapsedMinutes = (new Date() - startTime) / 60000; //gets time
    userData.avgKeysPerMinute = (correctKeys / elapsedMinutes).toFixed(2); //calculates the ratio of key/time
    userData.bestKPM = Math.max(userData.bestKPM, userData.avgKeysPerMinute); //tracks the best kpm ratio
    
    let totalCorrect = 0, totalAttempts = 0;  //total correct keys
    let worstKey = '', bestKey = ''; //saves best and worst keys, used for personalized lessons.
    let worstRatio = 0, bestRatio = 100000;

    for (let key in userData.keyStats) {
        let { correct, missed } = userData.keyStats[key];
        let total = correct + missed; //total keys press
        totalCorrect += correct; //correct over total
        totalAttempts += total;

        let missRatio = missed / (total || 1); //if the ratio is worse than current worst ratio, its new worst key. vice versa for best key
        if (missRatio > worstRatio) {
            worstRatio = missRatio;
            worstKey = key;
        }
        if (missRatio < bestRatio) {
            bestRatio = missRatio;
            bestKey = key;
        }
    }

    userData.avgAccuracy = ((totalCorrect / totalAttempts) * 100).toFixed(2); //avg accuracy
    userData.worstKey = worstKey; //sets worstkey to local storage (Userdata)
    userData.bestKey = bestKey; //sets bestkey to local storage (Userdata)

    setUserDataDisplay(); //update display
}

function setUserDataDisplay() { //displays data from local storage to html id elements
    document.getElementById('wpm').innerText = userData.avgKeysPerMinute;
    document.getElementById('accuracy').innerText = userData.avgAccuracy;
    document.getElementById('bestKPM').innerText = userData.bestKPM;
}

// Function to handle lesson completion
function completeLesson() {
    userData.lessonsCompleted++; //adds +1 lesson to counter
    userData.exp += 10; //adds exp
    if (userData.exp >= 50) {
        userData.exp -= 50;
        userData.level++; //levels up if 50 exp.
    }
    userData.lesson++;
    localStorage.setItem('userData', JSON.stringify(userData)); //sets new data to local storage.
    alert('Lesson Completed!'); //alerts user lesson complete
}

// Dynamically set the 'lessonFocus' parameter based on the page name
function setLessonFocusBasedOnPage() { //the lesson focus determines the behavior of the JS depending on page name
    const pageName = window.location.pathname.split('/').pop().split('.').shift(); //gets page name from html
    let lessonFocus = '';

    // Set the lessonFocus based on the page name
    if (pageName === 'home-row') {
        lessonFocus = 'home-row';
    } else if (pageName === 'top-row') {
        lessonFocus = 'top-row';
    } else if (pageName === 'bottom-row') {
        lessonFocus = 'bottom-row';
    } else if (pageName === 'number-row') {
        lessonFocus = 'number-row';
    } else if (pageName === 'eco1') {
        lessonFocus = 'eco1';
    } else if (pageName === 'eco2') {
        lessonFocus = 'eco2';
    } else if (pageName === 'eco3') {
        lessonFocus = 'eco3';
    } else if (pageName === 'eco4') {
        lessonFocus = 'eco4';
    } else {
        lessonFocus = 'default-focus';
    }

    const urlParams = new URLSearchParams(window.location.search);  //gets url of page
    urlParams.set('lessonFocus', lessonFocus); //sets the lessons focus for pages
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`); //update url without reloading page
}

// Function to get the lessonFocus from URL
function getLessonFocusFromURL() {
    const urlParams = new URLSearchParams(window.location.search); //get the url for page
    return urlParams.get('lessonFocus') || 'number-row'; //gets lesson focus, else default to numbers
}

// Function to generate and set random text
function addRandomText(lessonFocus) {
    let randomText = '';

    // Define the keys for each lesson focus
    const homeRow = ['a', 's', 'd', 'f', 'j', 'k', 'l'];
    const topRow = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
    const bottomRow = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];
    const numberRow = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

    // Function to get random sentence from eco lessons
    function getRandomEcoSentence(lessonArray) {
        const randomIndex = Math.floor(Math.random() * lessonArray.length); //gets random index, then rounds down to integer.
        return lessonArray[randomIndex]; //returns the random index
    }

    // Function to generate random text for keyboard practice
    function generateRandomText(row) {
        let randomText = '';
        const numberOfWords = Math.floor(Math.random() * 5) + 3; //randomize word count, uses floor to round down
        
        for (let i = 0; i < numberOfWords; i++) {
            const wordLength = Math.floor(Math.random() * 3) + 3; //randomize word length
            let word = '';
            for (let j = 0; j < wordLength; j++) {
                const randomIndex = Math.floor(Math.random() * row.length); //finds random index
                word += row[randomIndex]; //uses index to get random letter
            }
            randomText += word + ' '; //random text
        }
        return randomText.trim(); //returns the text, used for target text.
    }

    // Generate text based on the lesson focus
    if (lessonFocus === 'eco1') {
        randomText = getRandomEcoSentence(lesson1);
    } else if (lessonFocus === 'eco2') {
        randomText = getRandomEcoSentence(lesson2);
    } else if (lessonFocus === 'eco3') {
        randomText = getRandomEcoSentence(lesson3);
    } else if (lessonFocus === 'eco4') {
        randomText = getRandomEcoSentence(lesson4);
    } else if (lessonFocus === 'home-row') {
        randomText = generateRandomText(homeRow);
    } else if (lessonFocus === 'top-row') {
        randomText = generateRandomText(topRow);
    } else if (lessonFocus === 'bottom-row') {
        randomText = generateRandomText(bottomRow);
    } else if (lessonFocus === 'number-row') {
        randomText = generateRandomText(numberRow);
    } else if (lessonFocus === 'keys-focus') {
        const allKeys = [...homeRow, ...topRow, ...bottomRow, ...numberRow];
        randomText = generateRandomText(allKeys);
    }

    document.getElementById('text-to-type').innerText = randomText;
}

// Monitor completion of typing session
document.getElementById('typing-input').addEventListener('blur', () => {//check to see if completed with eventlistener
    const typedText = document.getElementById('typing-input').value;  // get typed text
    const targetText = document.getElementById('text-to-type').innerText; //retrives target text.
    
    if (typedText === targetText) { // lesson completes if everything is right
        completeLesson();
    }
});
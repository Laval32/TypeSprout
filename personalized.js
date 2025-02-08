//this file controls the personalized lessons for the website.

document.addEventListener("DOMContentLoaded", function () {
    var userDataTS = JSON.parse(localStorage.getItem('userData') || '{}');  //gets user data or creates new data if null

    if (!userDataTS || Object.keys(userDataTS).length === 0) { //if no user data, reset displayed stats. 
        userDataTS = { worstKey: '', avgAccuracy: 100, avgKeysPerMinute: 0 };
    }

    const worstKey = userDataTS.worstKey || getRandomKey(); //gets the worst key for the user
    console.log("User's worst key:", worstKey); //logs the worst key, used for debugging errors

    //gets the stats from html id
    const textToTypeElement = document.getElementById("text-to-type");
    const typingInput = document.getElementById("typing-input");
    const wpmElement = document.getElementById("wpm");
    const accuracyElement = document.getElementById("accuracy");
    
    //default 
    let startTime = null;
    let correctChars = 0;
    let totalChars = 0;

    //uses worst keys to create personalized lesson plan
    function generateTypingText() {
        let randomKeys = getRandomKeys(8, worstKey); 
        let typingText = []; //text that must be typed

        for (let i = 0; i < 5; i++) {
            typingText.push(worstKey.toUpperCase() + worstKey + randomKeys[i]); 
            //pushes random keys to array , mainly the worst key though. 
        }

        return typingText.join(" "); //adds space
    }

    function getRandomKeys(count, excludeKey) {
        const allKeys = "abcdefghijklmnopqrstuvwxyz"; //all keys
        let availableKeys = allKeys.replace(excludeKey, ""); //replaces any key that needs to be replaced
        let selectedKeys = [];

        for (let i = 0; i < count; i++) {
            selectedKeys.push(availableKeys[Math.floor(Math.random() * availableKeys.length)]);
            //push only keys avaliable (uses floor method to round down)
        }
        return selectedKeys; //returns the target array 
    }

    function getRandomKey() {
        const allKeys = "abcdefghijklmnopqrstuvwxyz";
        return allKeys[Math.floor(Math.random() * allKeys.length)]; //rounds down to interger, then gets random key from array
    }

    function updateTypingTest() {
        textToTypeElement.innerText = generateTypingText(); //updates to next line
    }

    typingInput.addEventListener("input", function () {
        if (!startTime) startTime = new Date().getTime(); //starts timer

        let typedText = typingInput.value; 
        let targetText = textToTypeElement.innerText;

        totalChars = typedText.length; //total keys 
        correctChars = 0; //correct keys typed

        for (let i = 0; i < totalChars; i++) {
            if (typedText[i] === targetText[i]) correctChars++; //adds if correct key typed
        }

        let elapsedTime = (new Date().getTime() - startTime) / 60000; // Time in minutes

        // Prevent division by zero
        let wpm = elapsedTime > 0 ? Math.round((correctChars / 5) / elapsedTime) : 0;
         //if greater than 0, it rounds keys then divides by 5, getting the wpm.
        let accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
        //tracks accuracy, using ratio of correct to total then multuplying by 100. 

        wpmElement.innerText = wpm.toString(); //data to text
        accuracyElement.innerText = accuracy.toString(); //data to text

        // Check if the user has typed the target text correctly
        if (typedText === targetText) {
            completeLesson();  // Call completeLesson when the user finishes
            setTimeout(() => { //stops time
                typingInput.value = "";
                startTime = null;
                updateTypingTest(); //updates type text function
            }, 500); //after 500 s
        }
    });

    updateTypingTest();
});

function completeLesson() {
    // Load user data from localStorage
    let userData = JSON.parse(localStorage.getItem('userData')) || {
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
        lastLogin: new Date().toDateString()
    };

    // Increment lessons completed and add experience points
    userData.lessonsCompleted++;
    userData.exp += 10;

    // Level up if enough experience is gained
    if (userData.exp >= 50) {
        userData.exp -= 50;
        userData.level++;
    }

    // Save the updated user data back to localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
    
    console.log(`Lesson Completed! Total lessons completed: ${userData.lessonsCompleted}`);
}

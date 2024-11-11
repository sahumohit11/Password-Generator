const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const PasswordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]")
const symbols = '~`@#$%^&*()_+{[}]|:;"<,>.?/'

let password = "";
let passwordLength = 10;
let checkCount = 0;
setIndicator("#ccc");
handleSlider();

//set passwordLength

function handleSlider() {      //password length ko ui pr reflect krwana
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"%100%";
}

function setIndicator(color) {   //input parameter ko indicate
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRandInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRandInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRandInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRandInteger(65, 91));
}

function generateSymbols() {
    const randNum = generateRandomNumber(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {  //strength calculate

    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    }
    else if (
        (hasLower || hasUpper) &&
        (hasNum||hasSym)&&
        passwordLength >= 6
    ) {
        setIndicator("#ff0")
    } else {
        setIndicator("#f00")
    }
}

async function copyContent() {  //clipboard to copy promise
    try {
        await navigator.clipboard.writeText(PasswordDisplay.value);
        copyMsg.innerText = "copied";

    } catch (e) {
        copyMsg.innerText = "Failed" 
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active")
    }, 2000);

}
function shufflePassword(array) {
    //Fisher Yates Mathod
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));

    console.log("shufllign");
    return str;

    
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });
    //special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if (PasswordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {
    //none checkbox are selected
    if (checkCount <= 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
    console.log("staring the journey");

    //remove old password
    password = "";

    // if (uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }
    // if (lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }
    // if (numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }
    // if (symbolsCheck.checked) {
    //     password += generateSymbols();
    // }

    let funcArr = [];

    if (uppercaseCheck.checked) {
        funcArr.push(generateUpperCase);
    }
    if (lowercaseCheck.checked) {
        funcArr.push(generateLowerCase);
    }
    if (numbersCheck.checked) {
        funcArr.push(generateRandomNumber);
    }
    if (symbolsCheck.checked) {
        funcArr.push(generateSymbols );
    }

    //compulsary addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();

       
    }
    console.log("compulsary addition");

    //remaining addition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRandInteger(0, funcArr.length);
        password += funcArr[randIndex]();
        
    }
    console.log("remaining addition");

    //shuffle password

    password = shufflePassword(Array.from(password));
    console.log("shuffle done");

    PasswordDisplay.value = password;
    console.log("ui done");

    //calculation strength
    calcStrength();


})
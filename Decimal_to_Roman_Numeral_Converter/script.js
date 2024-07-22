//define variables and connect to elements
const numberInput = document.getElementById("number");
const convertBtn = document.getElementById("convert-btn");
const output = document.getElementById("output");
//const result = document.getElementById("result");

//create a dictionary of decimal and roman numerals
const numeralsTable = [
  [1, 'I'],
  [4, 'IV'],
  [5, 'V'],
  [9, 'IX'],
  [10, 'X'],
  [40, 'XL'],
  [50, 'L'],
  [90, 'XC'],
  [100, 'C'],
  [400, 'CD'],
  [500, 'D'],
  [900, 'CM'],
  [1000, 'M']
];

//used an algorithm I researched when solving Leetcode challenges
const convertToRoman = (num) => {
  if (isNaN(num) || num === ""){
    return "Please enter a valid number";
  } else if (num <= 0) {
    return "Please enter a number greater than or equal to 1";
  } else if (num >= 4000) {
    return "Please enter a number less than or equal to 3999";
  } 
  
  let numeral = [];
  for (let i = numeralsTable.length - 1; i >= 0; i--) {
    while (num >= numeralsTable[i][0]) {
            numeral.push(numeralsTable[i][1]);
            num -= numeralsTable[i][0];
      }
    }
    return numeral.join('');
  };

//event listeners for the button and enter keypress
convertBtn.addEventListener("click", () => {
  const num = parseInt(numberInput.value);
  const result = convertToRoman(num);
  //set and reset the elements
  output.textContent = result;
  numberInput.value = "";
});
numberInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const num = parseInt(numberInput.value);
    const result = convertToRoman(num);
    //set and reset the elements
    output.textContent = result;
    numberInput.value = "";
  }
});

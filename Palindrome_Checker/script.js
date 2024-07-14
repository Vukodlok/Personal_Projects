//initialize input
const originalInput = document.getElementById('text-input');
const result = document.getElementById('result');
const button = document.getElementById('check-btn');

//sanitize input by removing whitespace, special characters, and changin to all lowercase
const sanitizeInput = (input) => {
  return input.toLowerCase().replace(/[^a-z0-9]/g, "");
};

//check if input is a palindrome
const isPalindrome = (input) => {
  let left = 0;
  let right = input.length - 1;
  while (left < right) {
    if (input[left] !== input[right]) {
      return false;
    }
    left++;
    right--;
  }
  return true;
};

function update() {
  const input = originalInput.value;

  console.log(`Original input: ${input}`); // Log original input

  //check for empty input
  if (!input) {
    alert('Please input a value');
    return;
  }
  const sanitized = sanitizeInput(input);

  console.log(`Sanitized input: ${sanitized}`); // Log sanitized input

  if (isPalindrome(sanitized)) {
    result.innerHTML = `${input} is a palindrome`;
  } else {
    result.innerHTML = `${input} is not a palindrome`;
  }
  console.log(`Result: ${result.innerHTML}`); // Log result
}

button.addEventListener("click", update);

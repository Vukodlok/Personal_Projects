document.getElementById("check-btn").addEventListener("click", () => {
  const phoneNumber = document.getElementById("user-input").value;
  const output = document.getElementById("results-div");
  const phoneRegex = /^1?\s?(\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/;
  if (phoneRegex.test(phoneNumber)) {
        output.textContent = `Valid US number: ${phoneNumber}`;
        output.style.color = 'green';
    } else {
        output.textContent = `Invalid US number: ${phoneNumber}`;
        output.style.color = 'red';
        alert("Please provide a phone number");
    }
});

document.getElementById("clear-btn").addEventListener("click", () => {
  document.getElementById("user-input").value = "";
  document.getElementById("results-div").textContent = "";
});

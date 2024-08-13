let price = 1.87;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

const cashInput = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const changeDueElement = document.getElementById("change-due");

// Get elements to update with denomination values
const denominationElements = document.querySelectorAll('.denomination');

// Function to display starting change in the register
function displayStartingChange() {
  denominationElements.forEach((element, index) => {
    const denominationName = cid[index][0];
    const amount = cid[index][1].toFixed(2);
    element.textContent = `${denominationName}: $${amount}`;
  });
}

// Call the function to display the starting change when the script runs
displayStartingChange();

const calculateChange = (changeDue) => {
  let change = changeDue;
  const changeArray = [];
  
  // Define the value of each denomination in dollars
  const currencyUnits = {
    "PENNY": 0.01,
    "NICKEL": 0.05,
    "DIME": 0.10,
    "QUARTER": 0.25,
    "ONE": 1.00,
    "FIVE": 5.00,
    "TEN": 10.00,
    "TWENTY": 20.00,
    "ONE HUNDRED": 100.00
  };

  // Get the total cash in the drawer
  const totalCash = cid.reduce((total, denomination) => total + denomination[1], 0);

  // Iterate over the cash in drawer in reverse order to start with the highest denomination
  for (let i = cid.length - 1; i >= 0; i--) {
    const denominationName = cid[i][0];
    let amountInDrawer = cid[i][1];
    let value = 0;

    // Calculate how many of this denomination are needed
    while (change >= currencyUnits[denominationName] && amountInDrawer > 0) {
      change -= currencyUnits[denominationName];
      amountInDrawer -= currencyUnits[denominationName];
      value += currencyUnits[denominationName];

      // Round change to avoid precision issues
      change = Math.round(change * 100) / 100;
    }

    // If some denomination was used, add it to the changeArray
    if (value > 0) {
      changeArray.push([denominationName, value]);
    }
  }

  // Check if we were able to provide the exact change
  if (change > 0) {
    changeDueElement.textContent = "Status: INSUFFICIENT_FUNDS";
    return [];
  } else {
    const totalChange = changeArray.reduce((acc, [_, amount]) => acc + amount, 0);

    if (Math.abs(totalChange - totalCash) < 0.01) { // Handle floating-point precision issue
      changeDueElement.innerHTML = `Status: CLOSED<br>${formatChangeArray(changeArray)}`;
    } else {
      changeDueElement.innerHTML = `Status: OPEN<br>${formatChangeArray(changeArray)}`;
    }
    return changeArray;
  }
};

// Update the screen
const updateScreen = (changeArray) => {
  changeArray.forEach(change => {
    const [denominationName, amount] = change;
    const element = Array.from(denominationElements).find(el => el.textContent.startsWith(denominationName));
    if (element) {
      element.textContent = `${denominationName}: $${amount.toFixed(2)}`;
    }
  });
}

// Helper function to format change array
const formatChangeArray = (changeArray) => {
  return changeArray.map(([denominationName, amount]) => `${denominationName}: $${amount.toFixed(2)}`).join(" ");
};

purchaseBtn.addEventListener("click", () => {
  const cashAmount = parseFloat(cashInput.value);

  // Check for edge cases
  if (cashAmount < price) {
    alert("Customer does not have enough money to purchase the item");
  } else if (cashAmount === price) {
    changeDueElement.textContent = "No change due - customer paid with exact cash";
  } else {
    const changeDue = cashAmount - price;
    const changeArray = calculateChange(changeDue);
    if (changeArray.length > 0) {
      updateScreen(changeArray);
    }
  }
});

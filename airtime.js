const balances = { MTN: 0, Airtel: 0, GLO: 0, "9Mobile": 0 };
let currentNet = "";
let currentPin = "";
let cards = [];

function setBalanceBg(net) {
  const balanceDisplay = document.getElementById("balanceDisplay");
  balanceDisplay.style.backgroundColor = networkColors[net] || "#f0f0f0";
}

function selectNetwork(net) {
  currentNet = net;
  document.getElementById(
    `balanceDisplay`
  ).innerHTML = `Balance: ₦${balances[net]}`;

  document.getElementById(`priceInput`).value = "";
  document.getElementById(`cardLoad`).value = "";

  document.getElementById(`generate`).innerHTML = `
  <button id="generateBtn" onclick="genPin()">Generate PIN</button>
  <button id="loadBtn" onclick="loadPin()">Load PIN</button>`;

  document.getElementById(`pinText`).innerHTML = `<div id="pinDisplay"></div>
        <div id="loadStatus"></div>`;
}

let priceInput = document.getElementById(`priceInput`);
function firstPrice() {
  priceInput.value = `₦50.00`;
}
function secPrice() {
  priceInput.value = `₦100.00`;
}
function thirdPrice() {
  priceInput.value = `₦200.00`;
}
function forthPrice() {
  priceInput.value = `₦500.00`;
}
function fifthPrice() {
  priceInput.value = `₦1000.00`;
}
function sixthPrice() {
  priceInput.value = `₦2000.00`;
}

let formatPin = ""; // Make formatPin global to be accessible in loadPin

function genPin() {
  const pinDisplay = document.getElementById("pinDisplay");

  if (priceInput.value === "₦" || !priceInput.value) {
    pinDisplay.innerHTML = `Please input your Price!`;
  } else {
    let pin = "";
    for (let i = 0; i < 16; i++) {
      pin += Math.floor(Math.random() * 10);
    }

    formatPin = pin.match(/.{1,4}/g).join(" ");
    pinDisplay.innerHTML = `Your PIN for your ${priceInput.value} ${currentNet} is:<br>${formatPin}`;
    document.getElementById("cardLoad").value = `*311*${formatPin}#`;

    // Save to cards array
    const newCard = {
      network: currentNet,
      amount: priceInput.value,
      pin: formatPin,
      used: false,
    };
    cards.push(newCard);

    updateTable(); // Update the card table
  }
}


function loadPin() {
  const loadStatus = document.getElementById("loadStatus");
  const balanceDisplay = document.getElementById("balanceDisplay");
  const enteredPin = document.getElementById("cardLoad").value;

  // Find the card in the cards array
  const card = cards.find(
    (card) => `*311*${card.pin}#` === enteredPin && card.network === currentNet
  );

  if (card && !card.used) {
    const rawValue = card.amount.replace(/[₦,\s]/g, "");
    const amount = parseFloat(rawValue);
    balances[currentNet] += amount;

    card.used = true;

    balanceDisplay.innerHTML = `Balance: ₦${balances[currentNet]}`;
    loadStatus.innerHTML = `Load Successful`;
    loadStatus.style.color = `green`;
    document.getElementById("cardLoad").value = "";

    updateTable(); // Refresh table with updated "used" status
  } else {
    loadStatus.innerHTML = `Invalid or Already Used Card`;
    loadStatus.style.color = `red`;
  }
}


function updateTable() {
  const tableBody = document.getElementById("cardTableBody");
  tableBody.innerHTML = ""; // Clear previous rows

  cards.forEach((card, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${card.network}</td>
      <td>${card.amount}</td>
      <td>${card.pin}</td>
      <td>${card.used ? "Used" : "Unused"}</td>
      <td>
        ${
          !card.used
            ? `<button onclick="reloadCard(${index})">Load</button>`
            : "—"
        }
      </td>
    `;

    tableBody.appendChild(row);
  });
}

function reloadCard(index) {
  const card = cards[index];
  currentNet = card.network;
  document.getElementById("priceInput").value = card.amount;
  document.getElementById("cardLoad").value = `*131*${card.pin}#`;
  loadPin();
}




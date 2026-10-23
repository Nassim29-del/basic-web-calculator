/*
  ============================================
  Project:     Calculator
  File:        script.js
  Description: Calculator logic for input, operators, results and keyboard support.
  Author:      Nasim Bidel
  Created:     October 2026
  ============================================
*/
const currentEl = document.getElementById("current");
const previousEl = document.getElementById("previous");
const opButtons = document.querySelectorAll("[data-op]");

let current = "0";
let previous = null;
let operator = null;
let justCalculated = false;

function updateDisplay() {
  currentEl.textContent = current;
  previousEl.textContent = previous !== null && operator ? `${previous} ${operator}` : "";
  opButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.op === operator && current === "");
  });
}

function inputNumber(num) {
  if (justCalculated) {
    current = "0";
    justCalculated = false;
  }
  if (num === "." && current.includes(".")) return;
  if (current === "0" && num !== ".") {
    current = num;
  } else if (current === "") {
    current = num === "." ? "0." : num;
  } else {
    current += num;
  }
  updateDisplay();
}

function chooseOperator(op) {
  if (current === "" && previous !== null) {
    operator = op; // switch operator
    updateDisplay();
    return;
  }
  if (previous !== null && operator) {
    calculate();
  }
  previous = current;
  operator = op;
  current = "";
  justCalculated = false;
  updateDisplay();
}

function calculate() {
  if (previous === null || operator === null || current === "") return;

  const a = parseFloat(previous);
  const b = parseFloat(current);
  let result;

  switch (operator) {
    case "+": result = a + b; break;
    case "−": result = a - b; break;
    case "×": result = a * b; break;
    case "÷":
      if (b === 0) {
        current = "Error";
        previous = null;
        operator = null;
        justCalculated = true;
        updateDisplay();
        return;
      }
      result = a / b;
      break;
  }

  // Avoid floating point noise like 0.1 + 0.2 = 0.30000000000000004
  current = String(parseFloat(result.toPrecision(12)));
  previous = null;
  operator = null;
  justCalculated = true;
  updateDisplay();
}

function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  justCalculated = false;
  updateDisplay();
}

function deleteLast() {
  if (justCalculated || current === "Error") {
    clearAll();
    return;
  }
  current = current.length > 1 ? current.slice(0, -1) : "0";
  updateDisplay();
}

function percent() {
  if (current === "" || current === "Error") return;
  current = String(parseFloat(current) / 100);
  updateDisplay();
}

// Button clicks
document.querySelector(".keys").addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.dataset.num) inputNumber(btn.dataset.num);
  else if (btn.dataset.op) chooseOperator(btn.dataset.op);
  else if (btn.dataset.action === "equals") calculate();
  else if (btn.dataset.action === "clear") clearAll();
  else if (btn.dataset.action === "delete") deleteLast();
  else if (btn.dataset.action === "percent") percent();
});

// Keyboard support
document.addEventListener("keydown", e => {
  const key = e.key;
  if (/^[0-9.]$/.test(key)) inputNumber(key);
  else if (key === "+") chooseOperator("+");
  else if (key === "-") chooseOperator("−");
  else if (key === "*") chooseOperator("×");
  else if (key === "/") { e.preventDefault(); chooseOperator("÷"); }
  else if (key === "Enter" || key === "=") { e.preventDefault(); calculate(); }
  else if (key === "Backspace") deleteLast();
  else if (key === "Escape") clearAll();
  else if (key === "%") percent();
});

updateDisplay();
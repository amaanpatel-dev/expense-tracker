document.addEventListener("DOMContentLoaded", () => {
  const expenseForm = document.getElementById("expense-form");
  const expenseNameInput = document.getElementById("expense-name");
  const expenseAmountInput = document.getElementById("expense-amount");
  const expenseList = document.getElementById("expense-list");
  const totalAmountDisplay = document.getElementById("total-amount");

  // Load expenses from local storage or initialize as an empty array
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  let totalAmount = calculateTotal();

  // Render expenses and update total on page load
  renderExpenses();
  updateTotal();

  // Form submit handler
  expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value.trim());

    if (name !== "" && !isNaN(amount) && amount > 0) {
      const newExpense = {
        id: Date.now(),
        name: name,
        amount: amount,
      };
      expenses.push(newExpense);
      saveExpensesToLocal();
      renderExpenses();
      updateTotal();

      // Clear input fields
      expenseNameInput.value = "";
      expenseAmountInput.value = "";
    }
  });

  // Render the list of expenses
  function renderExpenses() {
    expenseList.innerHTML = "";
    expenses.forEach((expense) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div>
          <span>${expense.name} - ₹${expense.amount.toFixed(2)}</span>
          <small>${formatDate(expense.id)}</small>
        </div>
        <button data-id="${expense.id}">Delete</button>
      `;
      expenseList.appendChild(li);
    });
  }

  // Save expenses to local storage
  function saveExpensesToLocal() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }

  // Calculate the total amount of expenses
  function calculateTotal() {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  // Update the total amount displayed
  function updateTotal() {
    totalAmount = calculateTotal();
    totalAmountDisplay.textContent = `${totalAmount.toFixed(2)}`;
  }

  // Format the date from an expense's ID
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Delete expense handler
  expenseList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const expenseId = parseInt(e.target.getAttribute("data-id"));
      expenses = expenses.filter((expense) => expense.id !== expenseId);
      saveExpensesToLocal();
      renderExpenses();
      updateTotal();
    }
  });
});

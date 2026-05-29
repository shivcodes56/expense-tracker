// Initialize transactions from localStorage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [
    {
        id: 1,
        date: "2025-01-14",
        category: "Subscription",
        amount: -440,
        status: "Success",
        type: 'expense',
    },
    {
        id: 2,
        date: "2025-01-10",
        category: "Subscription",
        amount: -440,
        status: "Success",
        type: 'expense',
    },
    {
        id: 3,
        date: "2025-01-08",
        category: "Subscription",
        amount: -440,
        status: "Success",
        type: 'expense',
    },
];

let monthlyIncome = 2645;
let monthlyExpense = 1895;
let today;

function openIncomeModal() {
    document.getElementById('incomeModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function openExpenseModal() {
    document.getElementById('expenseModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';

    if (modalId == 'incomeModal') {
        document.getElementById('incomeForm').reset();
        document.getElementById('incomeDate').value = today;
    } else {
        document.getElementById('expenseForm').reset();
        document.getElementById('expenseDate').value = today;
    }
}

window.onclick = function (event) {
    const incomeModal = document.getElementById('incomeModal');
    const expenseModal = document.getElementById('expenseModal');

    if (event.target === incomeModal) {
        closeModal('incomeModal')
    }
    if (event.target === expenseModal) {
        closeModal('expenseModal')
    }
}

function addIncome(event) {
    if (event) event.preventDefault();
    
    const amount = parseFloat(document.getElementById('incomeAmount').value);
    const category = document.getElementById('incomeCategory').value;
    const description = document.getElementById('incomeDescription').value;
    const date = document.getElementById('incomeDate').value;

    if (!amount || !category || !date) {
        alert('Please fill in all required fields');
        return;
    }

    const newTransaction = {
        id: new Date().getTime(),
        date: date,
        category: category.charAt(0).toUpperCase() + category.slice(1),
        amount: amount,
        status: 'Success',
        type: 'income',
        description: description,
        createdAt: new Date()
    };

    transactions.unshift(newTransaction);
    saveTransactions();
    monthlyIncome += amount;
    
    closeModal('incomeModal');
    updateDashboard();
    updateTransactionsTable();
    showNotification('Income added successfully!', 'success');
}

function addExpense(event) {
    if (event) event.preventDefault();
    
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const category = document.getElementById('expenseCategory').value;
    const description = document.getElementById('expenseDescription').value;
    const date = document.getElementById('expenseDate').value;

    if (!amount || !category || !date) {
        alert('Please fill in all required fields');
        return;
    }

    const newTransaction = {
        id: new Date().getTime(),
        date: date,
        category: category.charAt(0).toUpperCase() + category.slice(1),
        amount: -Math.abs(amount), // Ensure it's negative
        status: 'Success',
        type: 'expense',
        description: description,
        createdAt: new Date()
    };

    transactions.unshift(newTransaction);
    saveTransactions();
    monthlyExpense += Math.abs(amount);
    
    closeModal('expenseModal');
    updateDashboard();
    updateTransactionsTable();
    showNotification('Expense added successfully!', 'success');
}

function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function updateDashboard() {
    document.querySelector('.income-amount').textContent = `$${monthlyIncome.toLocaleString()}.00`;
    document.querySelector('.expense-amount').textContent = `$${monthlyExpense.toLocaleString()}.00`;
    let spendingLimit = 12645;
    const usedAmount = monthlyExpense;
    const percentage = (usedAmount / spendingLimit) * 100;
    document.querySelector('.spending-limit').textContent = `$${spendingLimit.toLocaleString()}.00`;
    document.querySelector('.spending-used').textContent = `used from $${usedAmount.toLocaleString()}.00`;
    document.querySelector('.progress-fill').style.width = `${Math.min(percentage, 100)}%`;
}

function updateTransactionsTable() {
    const tbody = document.querySelector('.transaction-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const recentTransactions = transactions.slice(0, 10);
    
    recentTransactions.forEach((transaction) => {
        const row = document.createElement('tr');
        const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        const amountDisplay = transaction.amount > 0 
            ? `+$${transaction.amount.toLocaleString()}.00` 
            : `-$${Math.abs(transaction.amount).toLocaleString()}.00`;
        const color = transaction.amount > 0 ? '#10b981' : '#ef4444';

        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${transaction.category}</td>
            <td style="color: ${color}">${amountDisplay}</td>
            <td><span class="status-success">${transaction.status}</span></td>
            <td><button class="action-btn"><i class="fas fa-ellipsis-h"></i></button></td>
        `;
        tbody.appendChild(row);
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position:fixed;
        top:2rem;
        right:2rem;
        color:white;
        padding:1rem 1.5rem;
        border-radius:8px;
        box-shadow:0 4px 12px rgba(0,0,0,0.15);
        z-index:2000;
        animation:slideInRight 0.3s ease;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add animation styles dynamically
const style = document.createElement('style');
style.textContent = `
@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
@keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}
`;
document.head.appendChild(style);

// Expose functions to window since we are using type="module"
window.openIncomeModal = openIncomeModal;
window.openExpenseModal = openExpenseModal;
window.closeModal = closeModal;
window.addIncome = addIncome;
window.addExpense = addExpense;

// Prevent form submission reloads
document.getElementById('incomeForm').addEventListener('submit', addIncome);
document.getElementById('expenseForm').addEventListener('submit', addExpense);

document.addEventListener('DOMContentLoaded', () => {
    // Initialize today's date
    today = new Date().toISOString().split('T')[0];
    document.getElementById('incomeDate').value = today;
    document.getElementById('expenseDate').value = today;
    
    // Calculate totals from localStorage transactions
    monthlyIncome = 0;
    monthlyExpense = 0;
    transactions.forEach(t => {
        if (t.type === 'income') {
            monthlyIncome += t.amount;
        } else if (t.type === 'expense') {
            monthlyExpense += Math.abs(t.amount);
        }
    });
    
    // Update UI
    updateDashboard();
    updateTransactionsTable();
});
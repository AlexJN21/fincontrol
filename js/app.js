const STORAGE_KEY = "fincontrol.transactions.v1";
const OPENING_BALANCE_KEY = "fincontrol.openingBalance.v1";
let openingBalance = loadOpeningBalance();
function loadOpeningBalance() { try { const stored = localStorage.getItem(OPENING_BALANCE_KEY); if (stored === null) return 0; const value = Number(stored); return Number.isFinite(value) && value >= 0 ? value : 0; } catch (error) { console.error("Não foi possível ler o saldo inicial:", error); return 0; } }
function saveOpeningBalance(value) { try { localStorage.setItem(OPENING_BALANCE_KEY, String(value)); openingBalance = value; return true; } catch (error) { console.error("Não foi possível salvar o saldo inicial:", error); showToast("Não foi possível salvar. Verifique o armazenamento do navegador."); return false; } }
const categories = {
  expense: ["Moradia", "Alimentação", "Transporte", "Contas", "Saúde", "Lazer", "Educação", "Compras", "Dívidas", "Pets", "Outros"],
  income: ["Salário", "Freelance", "Vendas", "Investimentos", "Reembolso", "Outros"]
};
const categoryColors = {
  Moradia: "#5868df", Alimentação: "#ed9a54", Transporte: "#32a9a0", Contas: "#8b76df",
  Saúde: "#e46f83", Lazer: "#e6bd4d", Educação: "#5a9ce0", Compras: "#df7cbd",
  Dívidas: "#d85b65", Pets: "#7cbd76", Outros: "#9aa4b2", Salário: "#28a77d",
  Freelance: "#5b9fdd", Vendas: "#8c79db", Investimentos: "#d0a23b", Reembolso: "#3daeb0"
};
const $ = (selector) => document.querySelector(selector);
const money = (value) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
const localDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const formatDate = (dateString) => {
  if (!dateString) return "—";
  const [year, month, day] = dateString.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR").format(new Date(year, month - 1, day));
};
const monthKey = (dateString) => dateString?.slice(0, 7);
let transactions = loadTransactions();
let showAll = false;
let toastTimer;

function loadTransactions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Não foi possível ler os dados salvos:", error);
    return [];
  }
}
function saveTransactions() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error("Não foi possível salvar os dados:", error);
    showToast("Não foi possível salvar. Verifique o armazenamento do navegador.");
  }
}
function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}
function currentMonthTransactions() {
  const currentMonth = localDateString().slice(0, 7);
  return transactions.filter((item) => monthKey(item.date) === currentMonth);
}
function renderSummary() {
  const openingInput = $("#opening-balance-input"); const openingStatus = $("#opening-balance-status");
  if (openingInput && document.activeElement !== openingInput) openingInput.value = openingBalance ? openingBalance.toFixed(2) : "";
  if (openingStatus) openingStatus.textContent = openingBalance > 0 ? `Saldo inicial salvo: ${money(openingBalance)}. O saldo atual soma esse valor às receitas e subtrai as despesas registradas.` : "Nenhum saldo inicial configurado. Informe o dinheiro que você já tem disponível.";
  const monthTransactions = currentMonthTransactions();
  const income = monthTransactions.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0);
  const expenses = monthTransactions.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0);
  const allIncome = transactions.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0);
  const allExpenses = transactions.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0);
  const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;
  $("#balance").textContent = money(openingBalance + allIncome - allExpenses);
  $("#income-total").textContent = money(income);
  $("#expense-total").textContent = money(expenses);
  $("#savings-rate").textContent = `${savingsRate}%`;
  $("#month-summary").textContent = monthTransactions.length
    ? `Você registrou ${monthTransactions.length} movimentação(ões) neste mês. ${expenses > income ? "Suas despesas estão acima das receitas." : "Continue acompanhando suas receitas e despesas."}`
    : "Adicione transações para ver o resumo do mês.";
  if (income === 0 && expenses === 0) {
    $("#financial-tip").textContent = "Registre suas movimentações com frequência. Pequenos hábitos ajudam a enxergar melhor seu dinheiro.";
  } else if (expenses > income) {
    $("#financial-tip").textContent = "Neste mês, suas despesas superam suas receitas. Revise os gastos por categoria e priorize o que é essencial.";
  } else if (savingsRate >= 20) {
    $("#financial-tip").textContent = "Bom trabalho! Sua diferença entre receitas e despesas está positiva. Considere reservar parte dela para sua meta financeira.";
  } else {
    $("#financial-tip").textContent = "Confira suas despesas por categoria e escolha um gasto que possa reduzir sem comprometer suas necessidades.";
  }
}
function filteredTransactions() {
  const query = $("#search-input").value.trim().toLocaleLowerCase("pt-BR");
  const type = $("#type-filter").value;
  let result = [...transactions].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  if (type !== "all") result = result.filter((item) => item.type === type);
  if (query) result = result.filter((item) => `${item.description} ${item.category} ${item.notes || ""}`.toLocaleLowerCase("pt-BR").includes(query));
  return showAll ? result : result.slice(0, 6);
}
function renderTransactions() {
  const rows = filteredTransactions();
  const body = $("#transactions-body");
  body.innerHTML = rows.map((item) => {
    const isIncome = item.type === "income";
    const symbol = isIncome ? "↗" : "↘";
    const safeDescription = escapeHTML(item.description);
    const safeCategory = escapeHTML(item.category);
    return `<tr>
      <td><div class="transaction-name"><span class="transaction-symbol ${item.type}">${symbol}</span><span>${safeDescription}<span class="transaction-subtitle">${isIncome ? "Entrada" : "Saída"}${item.notes ? ` · ${escapeHTML(item.notes)}` : ""}</span></span></div></td>
      <td><span class="category-pill">${safeCategory}</span></td>
      <td>${formatDate(item.date)}</td>
      <td class="amount ${item.type}">${isIncome ? "+" : "−"} ${money(item.amount)}</td>
      <td><div class="row-actions"><button class="icon-button" data-edit="${item.id}" aria-label="Editar ${safeDescription}" title="Editar">✎</button><button class="icon-button" data-delete="${item.id}" aria-label="Excluir ${safeDescription}" title="Excluir">×</button></div></td>
    </tr>`;
  }).join("");
  const isEmpty = transactions.length === 0 || rows.length === 0;
  $("#empty-state").classList.toggle("visible", isEmpty);
  body.closest("table").style.display = isEmpty ? "none" : "table";
  if (transactions.length > 6 && !$("#search-input").value && $("#type-filter").value === "all") {
    $("#show-all").hidden = false;
    $("#show-all").innerHTML = showAll ? "Mostrar menos ↑" : "Ver todas →";
  } else {
    $("#show-all").hidden = true;
  }
}
function renderCategories() {
  const expenses = currentMonthTransactions().filter((item) => item.type === "expense");
  const totals = expenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});
  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  $("#category-total").textContent = money(total);
  $("#category-breakdown").innerHTML = entries.length ? entries.slice(0, 6).map(([category, amount]) => {
    const percentage = total ? (amount / total) * 100 : 0;
    const color = categoryColors[category] || "#9aa4b2";
    return `<div class="category-row">
      <div class="category-row-top"><span class="category-label"><span class="category-color" style="background:${color}"></span>${escapeHTML(category)}</span><span class="category-amount">${money(amount)}</span></div>
      <div class="progress-track"><div class="progress-fill" style="width:${percentage}%;background:${color}"></div></div>
    </div>`;
  }).join("") : `<div class="empty-category"><p style="font-size:12px;color:#8c97a7;line-height:1.7">Su distribuição por categoria aparecerá aqui quando você registrar despesas neste mês.</p></div>`;
}
function render() {
  renderSummary();
  renderTransactions();
  renderCategories();
}
function populateCategories(selected = "Outros") {
  const type = document.querySelector('input[name="type"]:checked').value;
  $("#category").innerHTML = categories[type].map((category) => `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`).join("");
  $("#category").value = categories[type].includes(selected) ? selected : categories[type][categories[type].length - 1];
}
function openModal(transaction = null) {
  $("#transaction-form").reset();
  $("#transaction-id").value = transaction?.id || "";
  $("#modal-title").textContent = transaction ? "Editar transação" : "Nova transação";
  document.querySelector(`input[name="type"][value="${transaction?.type || "expense"}"]`).checked = true;
  populateCategories(transaction?.category || "Outros");
  $("#description").value = transaction?.description || "";
  $("#amount").value = transaction?.amount ?? "";
  $("#date").value = transaction?.date || localDateString();
  $("#notes").value = transaction?.notes || "";
  $("#form-error").textContent = "";
  $("#transaction-modal").showModal();
  $("#description").focus();
}
function closeModal() {
  $("#transaction-modal").close();
}
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function handleSubmit(event) {
  event.preventDefault();
  const id = $("#transaction-id").value;
  const description = $("#description").value.trim();
  const amount = Number($("#amount").value);
  const date = $("#date").value;
  const type = document.querySelector('input[name="type"]:checked').value;
  const category = $("#category").value;
  const notes = $("#notes").value.trim();
  if (!description || !Number.isFinite(amount) || amount <= 0 || !date || !category) {
    $("#form-error").textContent = "Preencha a descrição, um valor maior que zero, a data e a categoria.";
    return;
  }
  const existing = transactions.find((item) => item.id === id);
  const transaction = { id: id || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`), description, amount, date, type, category, notes, createdAt: existing?.createdAt || Date.now() };
  if (existing) transactions = transactions.map((item) => item.id === id ? transaction : item);
  else transactions.push(transaction);
  saveTransactions();
  closeModal();
  render();
  showToast(existing ? "Transação atualizada com sucesso." : "Transação adicionada com sucesso.");
}
function handleTableClick(event) {
  const editButton = event.target.closest("[data-edit]");
  const deleteButton = event.target.closest("[data-delete]");
  if (editButton) {
    const transaction = transactions.find((item) => item.id === editButton.dataset.edit);
    if (transaction) openModal(transaction);
  }
  if (deleteButton) {
    const transaction = transactions.find((item) => item.id === deleteButton.dataset.delete);
    if (!transaction) return;
    if (confirm(`Deseja excluir a transação "${transaction.description}"?`)) {
      transactions = transactions.filter((item) => item.id !== transaction.id);
      saveTransactions();
      render();
      showToast("Transação excluída.");
    }
  }
}
function init() {
  const now = new Date();
  $("#today-label").textContent = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(now);
  $("#open-modal").addEventListener("click", () => openModal());
  $("#opening-balance-form").addEventListener("submit", (event) => { event.preventDefault(); const input = $("#opening-balance-input"); const value = Number(input.value); if (input.value.trim() === "" || !Number.isFinite(value) || value < 0) { showToast("Informe um saldo inicial válido."); return; } if (saveOpeningBalance(value)) { render(); showToast("Saldo inicial salvo com sucesso."); } });
  $("#empty-add").addEventListener("click", () => openModal());
  $("#close-modal").addEventListener("click", closeModal);
  $("#cancel-modal").addEventListener("click", closeModal);
  $("#transaction-form").addEventListener("submit", handleSubmit);
  document.querySelectorAll('input[name="type"]').forEach((radio) => radio.addEventListener("change", () => populateCategories()));
  $("#transactions-body").addEventListener("click", handleTableClick);
  $("#search-input").addEventListener("input", renderTransactions);
  $("#type-filter").addEventListener("change", renderTransactions);
  $("#show-all").addEventListener("click", () => { showAll = !showAll; renderTransactions(); });
  $("#transaction-modal").addEventListener("click", (event) => {
    if (event.target === $("#transaction-modal")) closeModal();
  });
  populateCategories();
  render();
}
document.addEventListener("DOMContentLoaded", init);

// Simple Todo App (easy to read + understand)

const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const emptyText = document.getElementById("emptyState");
const clearBtn = document.getElementById("clearBtn");
const filterBtns = document.querySelectorAll(".filter-btn");

let tasks = [];
let filter = "all";

function saveToStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadFromStorage() {
  const data = localStorage.getItem("tasks");
  tasks = data ? JSON.parse(data) : [];
}

function showOrHideEmpty() {
  emptyText.style.display = tasks.length === 0 ? "block" : "none";
}

function createTaskItem(task) {
  const li = document.createElement("li");
  if (task.done) li.classList.add("done");

  const label = document.createElement("label");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;

  const span = document.createElement("span");
  span.textContent = task.text;

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.classList.add("delete");

  label.appendChild(checkbox);
  label.appendChild(span);
  li.appendChild(label);
  li.appendChild(delBtn);

  checkbox.addEventListener("change", function () {
    task.done = checkbox.checked;
    saveToStorage();
    renderList();
  });

  delBtn.addEventListener("click", function () {
    tasks = tasks.filter(function (t) {
      return t.id !== task.id;
    });
    saveToStorage();
    renderList();
  });

  return li;
}

function renderList() {
  list.innerHTML = "";

  const visibleTasks = tasks.filter(function (t) {
    if (filter === "done") return t.done;
    if (filter === "pending") return !t.done;
    return true;
  });

  visibleTasks.forEach(function (task) {
    list.appendChild(createTaskItem(task));
  });

  showOrHideEmpty();
}

function addTask() {
  const text = input.value.trim();
  if (text === "") return;

  tasks.push({
    id: Date.now(),
    text: text,
    done: false,
  });

  input.value = "";
  saveToStorage();
  renderList();
}

addBtn.addEventListener("click", addTask);

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") addTask();
});

clearBtn.addEventListener("click", function () {
  tasks = [];
  saveToStorage();
  renderList();
});

filterBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    filterBtns.forEach(function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    filter = btn.dataset.filter;
    renderList();
  });
});

loadFromStorage();
renderList();

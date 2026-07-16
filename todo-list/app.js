const inputContainer = document.getElementById("#inputContainer");
const todoInput = document.getElementById("#todoInput");
const todoList = document.getElementById("#todoList");

function addTodo(todoText) {
  const todoItem = document.createElement("li");
  todoItem.className = "todoItem";

  const todoContent = document.createElement("span");
  todoContent.className = "todoContent";
  todoContent.textContent = todoText;

  const completeButton = document.createElement("button");
  completeButton.type = "button";
  completeButton.className = "completeButton";
  completeButton.textContent = "완료";

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "deleteButton";
  deleteButton.textContent = "삭제";

  completeButton.addEventListener("click", () => {
    todoItem.classList.toggle("completed");
  });
  
  deleteButton.addEventListener("click", () => {
    todoList.removeChild(todoItem);
  });

  todoItem.appendChild(todoContent);
  todoItem.appendChild(completeButton);
  todoItem.appendChild(deleteButton);

  todoList.appendChild(todoItem);
}

inputContainer.addEventListener("submit", (event) => {
  event.preventDefault();
  const todoText = todoInput.value.trim();

  if (todoText !== "") {
    addTodo();
    todoInput.value = "";
  }

  addTodo(todoText);

  todoInput.value = "";
  todoInput.focus();
});
import { v4 as uuidV4 } from 'uuid';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};

const list = document.querySelector<HTMLUListElement>('#list');
const form = document.querySelector<HTMLFormElement>(
  '#new-task-form',
) as HTMLFormElement | null;
const input = document.querySelector<HTMLInputElement>('#new-task-title');

const tasks: Task[] = loadTasks();
tasks.forEach(addListItem);

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (input?.value === '' || input?.value === null) return;

  const newTask: Task = {
    id: uuidV4(),
    title: input?.value as string,
    completed: false,
    createdAt: new Date(),
  };
  tasks.push(newTask);
  saveTasks();

  addListItem(newTask);
  input.value = '';
});

function addListItem(task: Task) {
  const itemContainer = document.createElement('div');
  itemContainer.className = 'item-container';
  const item = document.createElement('li');
  const label = document.createElement('label');
  label.textContent = task.title;
  label.className = 'task-title';
  const checkbox = document.createElement('input');
  const deleteBtn = document.createElement('button');
  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', () => {
    const newTitle = prompt('Enter new title', task.title);
    if (newTitle === null || newTitle === '') return;
    task.title = newTitle;
    label.textContent = newTitle;
    saveTasks();
  });

  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => {
    const index = tasks.findIndex((t) => t.id === task.id);
    tasks.splice(index, 1);
    saveTasks();
    item.remove();
  });

  checkbox.addEventListener('change', (event) => {
    task.completed = checkbox.checked;
    saveTasks();
  });

  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  itemContainer.append(checkbox);
  itemContainer.append(label);
  itemContainer.append(deleteBtn);
  itemContainer.append(editBtn);
  item.append(itemContainer);
  list?.insertBefore(item, list.firstChild);
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks(): Task[] {
  const tasksString = localStorage.getItem('tasks');
  if (tasksString === null) return [];
  return JSON.parse(tasksString);
}

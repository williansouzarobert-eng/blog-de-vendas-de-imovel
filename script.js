/**
 * Módulo de Gerenciamento de Aplicação
 */
class AppManager {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    this.initElements();
    this.bindEvents();
    this.renderTasks();
  }

  // Centraliza a seleção de elementos do DOM
  initElements() {
    this.form = document.querySelector('#task-form');
    this.input = document.querySelector('#task-input');
    this.list = document.querySelector('#task-list');
    this.btnFetch = document.querySelector('#btn-fetch-user');
    this.userContainer = document.querySelector('#user-info');
  }

  // Vincula os ouvintes de eventos
  bindEvents() {
    this.form?.addEventListener('submit', (e) => this.handleAddTask(e));
    this.list?.addEventListener('click', (e) => this.handleListClick(e));
    this.btnFetch?.addEventListener('click', () => this.fetchUserData());
  }

  // Adiciona uma nova tarefa
  handleAddTask(e) {
    e.preventDefault();
    const text = this.input.value.trim();
    if (!text) return;

    const newTask = { id: Date.now(), title: text, completed: false };
    this.tasks.push(newTask);
    this.saveAndRender();
    this.input.value = '';
  }

  // Delegação de eventos para alternar ou excluir tarefas
  handleListClick(e) {
    const id = Number(e.target.dataset.id);
    if (!id) return;

    if (e.target.classList.contains('btn-delete')) {
      this.tasks = this.tasks.filter(task => task.id !== id);
    } else if (e.target.classList.contains('btn-toggle')) {
      this.tasks = this.tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      );
    }
    this.saveAndRender();
  }

  // Persiste os dados e atualiza a interface
  saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    this.renderTasks();
  }

  renderTasks() {
    if (!this.list) return;
    this.list.innerHTML = this.tasks.map(task => `
      <li class="${task.completed ? 'completed' : ''}">
        <span>${task.title}</span>
        <button data-id="${task.id}" class="btn-toggle">✓</button>
        <button data-id="${task.id}" class="btn-delete">✕</button>
      </li>
    `).join('');
  }

  // Consumo de API externa com tratamento de erros
  async fetchUserData() {
    try {
      if (this.userContainer) this.userContainer.textContent = 'Carregando dados...';
      
      const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
      if (!response.ok) throw new Error(`Status HTTP: ${response.status}`);
      
      const user = await response.json();
      if (this.userContainer) {
        this.userContainer.innerHTML = `
          <strong>${user.name}</strong> (${user.email}) - <em>${user.company.name}</em>
        `;
      }
    } catch (error) {
      console.error('[ERRO API]:', error);
      if (this.userContainer) {
        this.userContainer.textContent = 'Erro ao carregar dados do usuário.';
      }
    }
  }
}

// Inicialização segura após o carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
  new AppManager();
});


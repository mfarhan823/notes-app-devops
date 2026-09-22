let notes = [];
let selectedColor = '#2a2d3a';
let searchTerm = '';

const board = document.getElementById('board');
const emptyState = document.getElementById('emptyState');
const noteCount = document.getElementById('noteCount');
const searchInput = document.getElementById('searchInput');

const fab = document.getElementById('fab');
const modalOverlay = document.getElementById('modalOverlay');
const cancelBtn = document.getElementById('cancelBtn');
const saveBtn = document.getElementById('saveBtn');
const titleInput = document.getElementById('titleInput');
const bodyInput = document.getElementById('bodyInput');
const colourPicker = document.getElementById('colourPicker');

function loadNotes() {
  const saved = localStorage.getItem('notes');
  notes = saved ? JSON.parse(saved) : [];
  render();
}

function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

function openModal() {
  modalOverlay.classList.add('show');
  titleInput.focus();
}

function closeModal() {
  modalOverlay.classList.remove('show');
  titleInput.value = '';
  bodyInput.value = '';
}

function addNote() {
  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();
  if (title === '' && body === '') return;

  notes.unshift({
    id: Date.now(),
    title: title || 'Untitled',
    body: body,
    color: selectedColor,
    createdAt: new Date().toLocaleString()
  });

  saveNotes();
  render();
  closeModal();
}

function deleteNote(id) {
  notes = notes.filter(n => n.id !== id);
  saveNotes();
  render();
}

function render() {
  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(searchTerm) ||
    n.body.toLowerCase().includes(searchTerm)
  );

  board.innerHTML = '';

  filtered.forEach(note => {
    const card = document.createElement('div');
    card.className = 'note-card';
    card.style.background = note.color;

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = '\u00d7';
    delBtn.addEventListener('click', () => deleteNote(note.id));

    const title = document.createElement('h3');
    title.textContent = note.title;

    const body = document.createElement('p');
    body.textContent = note.body;

    const time = document.createElement('div');
    time.className = 'timestamp';
    time.textContent = note.createdAt;

    card.appendChild(delBtn);
    card.appendChild(title);
    card.appendChild(body);
    card.appendChild(time);
    board.appendChild(card);
  });

  emptyState.classList.toggle('show', filtered.length === 0);
  noteCount.textContent = notes.length;
}

fab.addEventListener('click', openModal);
cancelBtn.addEventListener('click', closeModal);
saveBtn.addEventListener('click', addNote);

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Enter' && modalOverlay.classList.contains('show')) {
    addNote();
  }
  if (e.key === 'Escape') closeModal();
});

searchInput.addEventListener('input', (e) => {
  searchTerm = e.target.value.toLowerCase();
  render();
});

colourPicker.addEventListener('click', (e) => {
  if (!e.target.classList.contains('dot')) return;
  document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
  e.target.classList.add('active');
  selectedColor = e.target.dataset.color;
});

loadNotes();
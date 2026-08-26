const API_BASE    = '../api';
const GET_URL     = API_BASE + '/get_projects.php';
const UPLOAD_URL  = API_BASE + '/upload_project.php';
const UPDATE_URL  = API_BASE + '/update_project.php';
const DELETE_URL  = API_BASE + '/delete_project.php';

const EXP_GET_URL    = API_BASE + '/get_experiences.php';
const EXP_ADD_URL    = API_BASE + '/add_experience.php';
const EXP_UPDATE_URL = API_BASE + '/update_experience.php';
const EXP_DELETE_URL = API_BASE + '/delete_experience.php';

const projectsTbody = document.getElementById('projects-tbody');
const emptyState    = document.getElementById('empty-state');
const projectCount  = document.getElementById('project-count');
const statTotal     = document.getElementById('stat-total');
const statDemo      = document.getElementById('stat-demo');
const statMonth     = document.getElementById('stat-month');
const notif         = document.getElementById('notification');

const uploadModal   = document.getElementById('upload-modal');
const deleteModal   = document.getElementById('delete-modal');
const btnAdd        = document.getElementById('btn-add-project');
const modalClose    = document.getElementById('modal-close');
const modalCancel   = document.getElementById('modal-cancel');
const modalBackdrop = document.getElementById('modal-backdrop');
const deleteCancel  = document.getElementById('delete-cancel');
const deleteBackdrop = document.getElementById('delete-backdrop');
const deleteConfirm = document.getElementById('delete-confirm');
const projectForm   = document.getElementById('project-form');
const submitBtn     = document.getElementById('submit-btn');
const modalTitle    = document.getElementById('modal-title');
const formProjectId = document.getElementById('form-project-id');
const formRemoveCollage = document.getElementById('form-remove-collage');
const existingSection   = document.getElementById('existing-images-section');
const existingGrid      = document.getElementById('existing-images-grid');

const expTbody          = document.getElementById('experiences-tbody');
const expEmptyState     = document.getElementById('exp-empty-state');
const experienceCount   = document.getElementById('experience-count');
const experienceModal   = document.getElementById('experience-modal');
const expModalClose     = document.getElementById('exp-modal-close');
const expModalBackdrop  = document.getElementById('exp-modal-backdrop');
const expModalCancel    = document.getElementById('exp-modal-cancel');
const expModalTitle     = document.getElementById('exp-modal-title');
const expSubmitBtn      = document.getElementById('exp-submit-btn');
const experienceForm    = document.getElementById('experience-form');
const formExpId         = document.getElementById('form-exp-id');
const btnAddExpNav      = document.getElementById('btn-add-experience-nav');
const btnAddExp         = document.getElementById('btn-add-experience');
const tabProjects       = document.getElementById('tab-projects');
const tabExperiences    = document.getElementById('tab-experiences');
const projectsSection   = document.getElementById('projects-section');
const experiencesSection = document.getElementById('experiences-section');
const deleteModalTitle  = document.getElementById('delete-modal-title');

let projects     = [];
let deleteId     = null;
let editingId    = null;
let removeCollageIds = [];

let experiences      = [];
let deleteExpId      = null;
let editingExpId     = null;
let deleteTarget     = 'project';

function showNotif(message, success = true) {
  notif.textContent = message;
  notif.className   = success
    ? 'mb-6 p-4 rounded-lg text-sm font-semibold bg-emerald-900/50 border border-emerald-700 text-emerald-300'
    : 'mb-6 p-4 rounded-lg text-sm font-semibold bg-red-900/50 border border-red-700 text-red-300';
  notif.classList.remove('hidden');
  setTimeout(() => notif.classList.add('hidden'), 4000);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

function updateStats() {
  const total   = projects.length;
  const withDemo = projects.filter((p) => p.demo_url && p.demo_url !== '#').length;

  const now     = new Date();
  const thisMonth = projects.filter((p) => {
    const d = new Date(p.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  statTotal.textContent  = total;
  statDemo.textContent   = withDemo;
  statMonth.textContent  = thisMonth;
  projectCount.textContent = total + ' project' + (total !== 1 ? 's' : '');
}

function renderTable() {
  if (projects.length === 0) {
    projectsTbody.parentElement.parentElement.querySelector('table').classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  projectsTbody.parentElement.parentElement.querySelector('table').classList.remove('hidden');

  projectsTbody.innerHTML = projects.map((p) => {
    const tags = p.tags
      ? p.tags.split(',').slice(0, 3).map((t) =>
          '<span class="px-2 py-0.5 text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-full">' + t.trim() + '</span>'
        ).join('')
      : '';

    const collageCount = p.collage_images
      ? p.collage_images.split(',').filter((s) => s.trim()).length
      : 0;
    const imageInfo = collageCount > 0
      ? '<span class="text-zinc-600 text-xs ml-1">+' + collageCount + ' imgs</span>'
      : '';

    return `
      <tr class="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
        <td class="px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
              <img src="${p.thumbnail_url}" alt="" class="w-full h-full object-cover" onerror="this.style.display='none'" />
            </div>
            <div class="min-w-0">
              <p class="text-white font-semibold text-sm truncate">${p.title}${imageInfo}</p>
              <p class="text-zinc-500 text-xs truncate max-w-[200px] sm:max-w-none">${p.description}</p>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 hidden sm:table-cell">
          <div class="flex flex-wrap gap-1.5">${tags}</div>
        </td>
        <td class="px-6 py-4 hidden md:table-cell text-xs text-zinc-500">${formatDate(p.created_at)}</td>
        <td class="px-6 py-4 text-right">
          <div class="flex items-center justify-end gap-3">
            <button data-id="${p.id}" class="edit-btn text-zinc-500 hover:text-white transition-colors text-sm">
              Edit
            </button>
            <button data-id="${p.id}" class="delete-btn text-zinc-500 hover:text-red-400 transition-colors text-sm">
              Delete
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  document.querySelectorAll('.edit-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const project = projects.find((p) => p.id == btn.dataset.id);
      if (project) openEditModal(project);
    });
  });

  document.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      deleteTarget = 'project';
      deleteId = btn.dataset.id;
      deleteModalTitle.textContent = 'Delete Project?';
      deleteModal.classList.remove('hidden');
    });
  });
}

async function loadProjects() {
  try {
    const res  = await fetch(GET_URL);
    const data = await res.json();
    projects   = Array.isArray(data) ? data : [];
  } catch (err) {
    projects = [];
  }
  renderTable();
  updateStats();
}

function openUploadModal() {
  editingId = null;
  removeCollageIds = [];
  formRemoveCollage.value = '';
  formProjectId.value = '';
  modalTitle.textContent = 'New Project';
  submitBtn.textContent = 'Upload Project';
  existingSection.classList.add('hidden');
  existingGrid.innerHTML = '';
  uploadModal.classList.remove('hidden');
}

function openEditModal(project) {
  editingId = project.id;
  removeCollageIds = [];
  formRemoveCollage.value = '';
  formProjectId.value = project.id;
  modalTitle.textContent = 'Edit Project';
  submitBtn.textContent = 'Save Changes';

  projectForm.elements['title'].value = project.title || '';
  projectForm.elements['description'].value = project.description || '';
  projectForm.elements['tags'].value = project.tags || '';
  projectForm.elements['demo_url'].value = project.demo_url || '';
  projectForm.elements['github_url'].value = project.github_url || '';

  const thumbnailInput = projectForm.elements['thumbnail'];
  thumbnailInput.removeAttribute('required');

  existingGrid.innerHTML = '';

  const thumbnailUrl = project.thumbnail_url;
  if (thumbnailUrl) {
    const wrapper = document.createElement('div');
    wrapper.className = 'relative group/img rounded-lg overflow-hidden bg-zinc-800 aspect-video';
    wrapper.innerHTML = `
      <img src="${thumbnailUrl}" alt="Thumbnail" class="w-full h-full object-cover" />
      <span class="absolute top-1 left-1 bg-zinc-900/80 text-zinc-300 text-[10px] px-1.5 py-0.5 rounded-full">thumb</span>
    `;
    existingGrid.appendChild(wrapper);
  }

  const collageImages = project.collage_images
    ? project.collage_images.split(',').filter((s) => s.trim())
    : [];

  collageImages.forEach((src, i) => {
    const trimmed = src.trim();
    const wrapper = document.createElement('div');
    wrapper.className = 'relative group/img rounded-lg overflow-hidden bg-zinc-800 aspect-video';
    wrapper.dataset.collageIndex = i;
    wrapper.dataset.collagePath = trimmed;
    wrapper.innerHTML = `
      <img src="${trimmed}" alt="Collage ${i + 1}" class="w-full h-full object-cover" />
      <button type="button" data-remove="${i}"
        class="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded-full bg-red-600/80 hover:bg-red-500 text-white text-xs opacity-0 group-hover/img:opacity-100 transition-opacity">
        &times;
      </button>
    `;
    existingGrid.appendChild(wrapper);
  });

  existingGrid.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.remove, 10);
      const path = collageImages[idx];
      if (path) {
        removeCollageIds.push(idx);
        formRemoveCollage.value = removeCollageIds.join(',');
      }
      btn.closest('.group\\/img').remove();
    });
  });

  if (collageImages.length > 0 || thumbnailUrl) {
    existingSection.classList.remove('hidden');
  } else {
    existingSection.classList.add('hidden');
  }

  uploadModal.classList.remove('hidden');
}

function closeModal() {
  uploadModal.classList.add('hidden');
  projectForm.reset();
  editingId = null;
  removeCollageIds = [];
  formRemoveCollage.value = '';
  formProjectId.value = '';
  existingSection.classList.add('hidden');
  existingGrid.innerHTML = '';
  modalTitle.textContent = 'New Project';
  submitBtn.textContent = 'Upload Project';

  const thumbnailInput = projectForm.elements['thumbnail'];
  thumbnailInput.setAttribute('required', '');
}

btnAdd.addEventListener('click', openUploadModal);
modalClose.addEventListener('click', closeModal);
modalCancel.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

deleteCancel.addEventListener('click', () => {
  deleteModal.classList.add('hidden');
  deleteId = null;
  deleteTarget = 'project';
});
deleteBackdrop.addEventListener('click', () => {
  deleteModal.classList.add('hidden');
  deleteId = null;
  deleteTarget = 'project';
});

deleteConfirm.addEventListener('click', async () => {
  if (!deleteId) return;
  const isExp = deleteTarget === 'experience';
  const url = isExp ? EXP_DELETE_URL + '?id=' + deleteId : DELETE_URL + '?id=' + deleteId;
  const method = 'DELETE';
  try {
    const res  = await fetch(url, { method });
    const data = await res.json();
    if (data.success) {
      showNotif(isExp ? 'Experience deleted.' : 'Project deleted.', true);
      if (isExp) await loadExperiences();
      else await loadProjects();
    } else {
      showNotif(data.error || 'Delete failed.', false);
    }
  } catch (err) {
    showNotif('Network error: ' + err.message, false);
  }
  deleteModal.classList.add('hidden');
  deleteId = null;
  deleteTarget = 'project';
});

projectForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = submitBtn.textContent;
  const isEdit = editingId !== null;

  submitBtn.disabled    = true;
  submitBtn.textContent = isEdit ? 'Saving...' : 'Uploading...';

  const url = isEdit ? UPDATE_URL : UPLOAD_URL;

  try {
    const fd = new FormData();
    fd.append('title', projectForm.elements['title'].value);
    fd.append('description', projectForm.elements['description'].value);
    fd.append('tags', projectForm.elements['tags'].value);
    fd.append('demo_url', projectForm.elements['demo_url'].value);
    fd.append('github_url', projectForm.elements['github_url'].value);

    if (isEdit) {
      fd.append('project_id', editingId);
      if (removeCollageIds.length > 0) {
        fd.append('remove_collage', removeCollageIds.join(','));
      }
    }

    const thumbFile = projectForm.elements['thumbnail'].files[0];
    if (thumbFile) {
      const b64 = await fileToBase64(thumbFile);
      fd.append('thumbnail_data', b64);
    } else if (!isEdit) {
      throw new Exception('Thumbnail image is required');
    }

    const collageFiles = projectForm.elements['collage_images'].files;
    if (collageFiles.length > 0) {
      const arr = [];
      for (const f of collageFiles) {
        arr.push(await fileToBase64(f));
      }
      fd.append('collage_data', JSON.stringify(arr));
    }

    const res  = await fetch(url, { method: 'POST', body: fd });
    const data = await res.json();

    if (data.success) {
      showNotif(isEdit ? 'Project updated.' : 'Project uploaded (ID: ' + data.id + ')', true);
      closeModal();
      await loadProjects();
    } else {
      showNotif(data.error || 'Operation failed.', false);
    }
  } catch (err) {
    showNotif(err.message || 'Network error', false);
  } finally {
    submitBtn.disabled    = false;
    submitBtn.textContent = btn;
  }
});

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── TABS ───
const btnAddProject = document.getElementById('btn-add-project');

function switchTab(tab) {
  if (tab === 'projects') {
    tabProjects.className = 'tab-btn px-5 py-2 text-sm font-semibold rounded-full bg-white text-black transition-colors';
    tabExperiences.className = 'tab-btn px-5 py-2 text-sm font-semibold rounded-full text-zinc-400 hover:text-white transition-colors';
    projectsSection.classList.remove('hidden');
    experiencesSection.classList.add('hidden');
    btnAddProject.classList.remove('hidden');
    btnAddExpNav.classList.add('hidden');
  } else {
    tabExperiences.className = 'tab-btn px-5 py-2 text-sm font-semibold rounded-full bg-white text-black transition-colors';
    tabProjects.className = 'tab-btn px-5 py-2 text-sm font-semibold rounded-full text-zinc-400 hover:text-white transition-colors';
    experiencesSection.classList.remove('hidden');
    projectsSection.classList.add('hidden');
    btnAddProject.classList.add('hidden');
    btnAddExpNav.classList.remove('hidden');
  }
}

tabProjects.addEventListener('click', () => switchTab('projects'));
tabExperiences.addEventListener('click', () => switchTab('experiences'));

// ─── EXPERIENCES CRUD ───
async function loadExperiences() {
  try {
    const res  = await fetch(EXP_GET_URL);
    const data = await res.json();
    experiences = Array.isArray(data) ? data : [];
  } catch (err) {
    experiences = [];
  }
  renderExpTable();
}

function renderExpTable() {
  if (experiences.length === 0) {
    expTbody.parentElement.parentElement.querySelector('table').classList.add('hidden');
    expEmptyState.classList.remove('hidden');
    experienceCount.textContent = '0 experiences';
    return;
  }

  expEmptyState.classList.add('hidden');
  expTbody.parentElement.parentElement.querySelector('table').classList.remove('hidden');
  experienceCount.textContent = experiences.length + ' experience' + (experiences.length !== 1 ? 's' : '');

  expTbody.innerHTML = experiences.map((e) => {
    const descShort = e.description
      ? (e.description.length > 60 ? e.description.substring(0, 60) + '...' : e.description)
      : '—';

    return `
      <tr class="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
        <td class="px-6 py-4">
          <p class="text-white font-semibold text-sm">${e.role}</p>
        </td>
        <td class="px-6 py-4 hidden sm:table-cell text-sm text-zinc-300">${e.event_name || e.event}</td>
        <td class="px-6 py-4 hidden md:table-cell text-xs text-zinc-500">${e.year}</td>
        <td class="px-6 py-4 hidden lg:table-cell text-xs text-zinc-500">${descShort}</td>
        <td class="px-6 py-4 text-right">
          <div class="flex items-center justify-end gap-3">
            <button data-id="${e.id}" class="exp-edit-btn text-zinc-500 hover:text-white transition-colors text-sm">
              Edit
            </button>
            <button data-id="${e.id}" class="exp-delete-btn text-zinc-500 hover:text-red-400 transition-colors text-sm">
              Delete
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  document.querySelectorAll('.exp-edit-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const exp = experiences.find((e) => e.id == btn.dataset.id);
      if (exp) openExpEditModal(exp);
    });
  });

  document.querySelectorAll('.exp-delete-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      deleteTarget = 'experience';
      deleteId = btn.dataset.id;
      deleteModalTitle.textContent = 'Delete Experience?';
      deleteModal.classList.remove('hidden');
    });
  });
}

// ─── EXPERIENCE MODAL ───
function openExpUploadModal() {
  editingExpId = null;
  formExpId.value = '';
  expModalTitle.textContent = 'New Experience';
  expSubmitBtn.textContent = 'Save Experience';
  experienceModal.classList.remove('hidden');
}

function openExpEditModal(exp) {
  editingExpId = exp.id;
  formExpId.value = exp.id;
  expModalTitle.textContent = 'Edit Experience';
  expSubmitBtn.textContent = 'Save Changes';

  experienceForm.elements['role'].value = exp.role || '';
  experienceForm.elements['event_name'].value = exp.event_name || exp.event || '';
  experienceForm.elements['year'].value = exp.year || '';
  experienceForm.elements['description'].value = exp.description || '';
  experienceForm.elements['sort_order'].value = exp.sort_order || exp.sortOrder || 0;

  experienceModal.classList.remove('hidden');
}

function closeExpModal() {
  experienceModal.classList.add('hidden');
  experienceForm.reset();
  editingExpId = null;
  formExpId.value = '';
}

expModalClose.addEventListener('click', closeExpModal);
expModalCancel.addEventListener('click', closeExpModal);
expModalBackdrop.addEventListener('click', closeExpModal);
btnAddExpNav.addEventListener('click', openExpUploadModal);
btnAddExp.addEventListener('click', openExpUploadModal);

experienceForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd  = new FormData(experienceForm);
  const isEdit = editingExpId !== null;

  expSubmitBtn.disabled = true;
  expSubmitBtn.textContent = 'Saving...';

  const url = isEdit ? EXP_UPDATE_URL : EXP_ADD_URL;

  try {
    const res  = await fetch(url, { method: 'POST', body: fd });
    const data = await res.json();

    if (data.success) {
      showNotif(isEdit ? 'Experience updated.' : 'Experience added.', true);
      closeExpModal();
      await loadExperiences();
    } else {
      showNotif(data.error || 'Operation failed.', false);
    }
  } catch (err) {
    showNotif('Network error: ' + err.message, false);
  } finally {
    expSubmitBtn.disabled = false;
    expSubmitBtn.textContent = isEdit ? 'Save Changes' : 'Save Experience';
  }
});

loadProjects();
loadExperiences();

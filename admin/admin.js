const form      = document.getElementById('project-form');
const notif     = document.getElementById('notification');
const submitBtn = document.getElementById('submit-btn');
const API_URL   = '../api/upload_project.php';

function showNotif(message, success = true) {
  notif.textContent = message;
  notif.className   = success
    ? 'mb-6 p-4 rounded-lg text-sm font-semibold bg-emerald-900/50 border border-emerald-700 text-emerald-300'
    : 'mb-6 p-4 rounded-lg text-sm font-semibold bg-red-900/50 border border-red-700 text-red-300';
  notif.classList.remove('hidden');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const fd  = new FormData(form);
  const btn = submitBtn.textContent;

  submitBtn.disabled    = true;
  submitBtn.textContent = 'Uploading...';

  try {
    const res  = await fetch(API_URL, { method: 'POST', body: fd });
    const data = await res.json();

    if (data.success) {
      showNotif('Project uploaded successfully (ID: ' + data.id + ')', true);
      form.reset();
    } else {
      showNotif(data.error || 'Upload failed', false);
    }
  } catch (err) {
    showNotif('Network error: ' + err.message, false);
  } finally {
    submitBtn.disabled    = false;
    submitBtn.textContent = btn;
  }
});
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

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = submitBtn.textContent;
  submitBtn.disabled    = true;
  submitBtn.textContent = 'Uploading...';

  try {
    const fd = new FormData();
    fd.append('title', form.elements['title'].value);
    fd.append('description', form.elements['description'].value);
    fd.append('tags', form.elements['tags'].value);
    fd.append('demo_url', form.elements['demo_url'].value);
    fd.append('github_url', form.elements['github_url'].value);

    const thumbFile = form.elements['thumbnail'].files[0];
    if (thumbFile) {
      fd.append('thumbnail_data', await fileToBase64(thumbFile));
    } else {
      throw new Error('Thumbnail image is required');
    }

    const collageFiles = form.elements['collage_images'].files;
    if (collageFiles.length > 0) {
      const arr = [];
      for (const f of collageFiles) {
        arr.push(await fileToBase64(f));
      }
      fd.append('collage_data', JSON.stringify(arr));
    }

    const res  = await fetch(API_URL, { method: 'POST', body: fd });
    const data = await res.json();

    if (data.success) {
      showNotif('Project uploaded successfully (ID: ' + data.id + ')', true);
      form.reset();
    } else {
      showNotif(data.error || 'Upload failed', false);
    }
  } catch (err) {
    showNotif(err.message || 'Network error', false);
  } finally {
    submitBtn.disabled    = false;
    submitBtn.textContent = btn;
  }
});

const API_BASE_URL = 'http://localhost:5000/api';

const FALLBACK_PROJECTS = [
  {
    _id: '1',
    title: 'Process Scheduler Visualizer',
    description: 'A desktop/web CPU process scheduling visualizer implementing Priority Scheduling and CPU time execution tracking.',
    tags: ['C++', 'Algorithms', 'WebAssembly'],
    github: 'https://github.com',
    liveUrl: '#'
  },
  {
    _id: '2',
    title: 'Green Computing Analytics Platform',
    description: 'A dashboard providing metric tracking for server power efficiency and automated resource optimization.',
    tags: ['Node.js', 'Express', 'Chart.js', 'MongoDB'],
    github: 'https://github.com',
    liveUrl: '#'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  fetchProjects();
  setupContactForm();
});

async function fetchProjects() {
  const container = document.getElementById('projects-grid');

  try {
    const res = await fetch(`${API_BASE_URL}/projects`);
    const result = await res.json();

    if (result.success && result.data.length > 0) {
      renderProjects(result.data, container);
    } else {
      renderProjects(FALLBACK_PROJECTS, container);
    }
  } catch (err) {
    console.warn('Backend unreachable. Rendering fallback projects.', err);
    renderProjects(FALLBACK_PROJECTS, container);
  }
}

function renderProjects(projects, container) {
  container.innerHTML = '';

  projects.forEach((proj) => {
    const card = document.createElement('div');
    card.className = 'project-card';

    const tagsHtml = proj.tags.map(t => `<span>#${t}</span>`).join('');

    card.innerHTML = `
      <div>
        <h3>${escapeHtml(proj.title)}</h3>
        <p>${escapeHtml(proj.description)}</p>
      </div>
      <div>
        <div class="tag-list">${tagsHtml}</div>
        <div class="card-links">
          <a href="${proj.github}" target="_blank" rel="noopener">GitHub ↗</a>
          <a href="${proj.liveUrl}" target="_blank" rel="noopener">Live Demo ↗</a>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function setupContactForm() {
  const form = document.getElementById('contact-form');
  const statusDiv = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      message: document.getElementById('message').value.trim()
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    statusDiv.textContent = '';

    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (res.ok && result.success) {
        statusDiv.style.color = '#64ffda';
        statusDiv.textContent = 'Message sent successfully!';
        form.reset();
      } else {
        throw new Error(result.message || 'Error sending message');
      }
    } catch (err) {
      statusDiv.style.color = '#ff6b6b';
      statusDiv.textContent = 'Failed to send message. Try again later.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[m]);
}
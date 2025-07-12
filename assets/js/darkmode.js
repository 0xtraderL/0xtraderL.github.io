// Dark mode toggle script
(function() {
  const toggle = document.getElementById('darkmode-toggle');
  if (!toggle) return;

  // Create button
  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.style.marginLeft = '1rem';
  btn.style.background = 'none';
  btn.style.color = 'inherit';
  btn.style.border = '1px solid #888';
  btn.style.fontSize = '1em';
  btn.style.padding = '0.3em 0.8em';
  btn.style.cursor = 'pointer';

  function setDarkMode(on) {
    if (on) {
      document.body.classList.add('dark-mode');
      btn.textContent = '🌙';
      localStorage.setItem('darkmode', 'on');
    } else {
      document.body.classList.remove('dark-mode');
      btn.textContent = '☀️';
      localStorage.setItem('darkmode', 'off');
    }
  }

  // Initial state
  const userPref = localStorage.getItem('darkmode');
  const systemPref = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setDarkMode(userPref === 'on' || (!userPref && systemPref));

  btn.onclick = function() {
    setDarkMode(!document.body.classList.contains('dark-mode'));
  };

  toggle.appendChild(btn);
})(); 
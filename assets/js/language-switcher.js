// Enhanced Language Switcher with Dynamic Creation
document.addEventListener('DOMContentLoaded', function() {
  // Get current language from URL path
  const currentPath = window.location.pathname;
  let currentLang = 'en';
  
  if (currentPath.startsWith('/zh/')) {
    currentLang = 'zh';
  } else if (currentPath.startsWith('/ja/')) {
    currentLang = 'ja';
  } else if (currentPath.startsWith('/ko/')) {
    currentLang = 'ko';
  }
  
  // Store current language
  document.documentElement.setAttribute('lang', currentLang);
  
  // Language mappings
  const languages = {
    'en': { name: 'English', flag: '🇺🇸', path: '/' },
    'zh': { name: '中文', flag: '🇨🇳', path: '/zh/' },
    'ja': { name: '日本語', flag: '🇯🇵', path: '/ja/' },
    'ko': { name: '한국어', flag: '🇰🇷', path: '/ko/' }
  };
  
  // Create language switcher HTML
  function createLanguageSwitcher() {
    const currentLangInfo = languages[currentLang];
    
    const switcher = document.createElement('div');
    switcher.className = 'language-switcher-fixed';
    switcher.innerHTML = `
      <div class="language-switcher">
        <div class="custom-dropdown">
          <button class="dropdown-toggle" type="button" id="languageDropdown" onclick="toggleLanguageDropdown()">
            ${currentLangInfo.flag} ${currentLangInfo.name}
            <span class="dropdown-arrow">▼</span>
          </button>
          <ul class="dropdown-menu" id="languageDropdownMenu">
            ${Object.keys(languages).filter(lang => lang !== currentLang).map(lang => 
              `<li>
                <a class="dropdown-item" href="${lang === 'en' ? '/' : `/${lang}/`}">
                  ${languages[lang].flag} ${languages[lang].name}
                </a>
              </li>`
            ).join('')}
          </ul>
        </div>
      </div>
    `;
    
    document.body.appendChild(switcher);
  }
  
  // Create the switcher
  createLanguageSwitcher();
  
  // Function to switch language
  function switchLanguage(targetLang) {
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    
    // Remove current language prefix from path
    let cleanPath = currentPath;
    Object.keys(languages).forEach(lang => {
      if (lang !== 'en' && currentPath.startsWith(`/${lang}/`)) {
        cleanPath = currentPath.replace(`/${lang}/`, '/');
      }
    });
    
    // Add new language prefix
    let newPath;
    if (targetLang === 'en') {
      newPath = cleanPath;
    } else {
      newPath = `/${targetLang}${cleanPath}`;
    }
    
    // Navigate to new URL
    window.location.href = newPath + currentSearch;
  }
  
  // Bind language switcher events
  function bindLanguageSwitcher() {
    const languageLinks = document.querySelectorAll('.language-switcher .dropdown-item');
    
    languageLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        
        let targetLang = 'en';
        if (href.startsWith('/zh/')) {
          targetLang = 'zh';
        } else if (href.startsWith('/ja/')) {
          targetLang = 'ja';
        } else if (href.startsWith('/ko/')) {
          targetLang = 'ko';
        }
        
        switchLanguage(targetLang);
      });
    });
  }
  
  // Global function for dropdown toggle
  window.toggleLanguageDropdown = function() {
    const dropdown = document.getElementById('languageDropdownMenu');
    const arrow = document.querySelector('.dropdown-arrow');
    
    if (dropdown.style.display === 'block') {
      dropdown.style.display = 'none';
      arrow.innerHTML = '▼';
    } else {
      dropdown.style.display = 'block';
      arrow.innerHTML = '▲';
    }
  };
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(event) {
    const dropdown = document.querySelector('.custom-dropdown');
    if (dropdown && !dropdown.contains(event.target)) {
      const menu = document.getElementById('languageDropdownMenu');
      const arrow = document.querySelector('.dropdown-arrow');
      if (menu) {
        menu.style.display = 'none';
        arrow.innerHTML = '▼';
      }
    }
  });
  
  // Initialize after creating the switcher
  setTimeout(bindLanguageSwitcher, 100);
  
  // Store language preference
  localStorage.setItem('preferred-language', currentLang);
  
  // Auto-redirect based on browser language preference (first visit only)
  if (localStorage.getItem('first-visit') === null) {
    const browserLang = navigator.language || navigator.userLanguage;
    let detectedLang = 'en';
    
    if (browserLang.startsWith('zh')) {
      detectedLang = 'zh';
    } else if (browserLang.startsWith('ja')) {
      detectedLang = 'ja';
    } else if (browserLang.startsWith('ko')) {
      detectedLang = 'ko';
    }
    
    const isHomePage = currentPath === '/' || currentPath === '/index.html';
    
    if (isHomePage && detectedLang !== 'en' && currentLang === 'en') {
      localStorage.setItem('first-visit', 'done');
      switchLanguage(detectedLang);
    } else {
      localStorage.setItem('first-visit', 'done');
    }
  }
}); 
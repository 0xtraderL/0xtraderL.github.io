// Language switcher functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get current language from page
  const currentLang = document.documentElement.lang || 'en';
  
  // Language mappings
  const languages = {
    'en': { name: 'English', flag: '🇺🇸', path: '/' },
    'zh': { name: '中文', flag: '🇨🇳', path: '/zh/' },
    'ja': { name: '日本語', flag: '🇯🇵', path: '/ja/' },
    'ko': { name: '한국어', flag: '🇰🇷', path: '/ko/' }
  };
  
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
  
  // Add event listeners to language switcher links with more robust selection
  function bindLanguageSwitcher() {
    const languageLinks = document.querySelectorAll('.language-switcher .dropdown-item');
    console.log('Found language links:', languageLinks.length);
    
    languageLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        console.log('Language link clicked:', href);
        
        let targetLang = 'en';
        if (href.startsWith('/zh/')) {
          targetLang = 'zh';
        } else if (href.startsWith('/ja/')) {
          targetLang = 'ja';
        } else if (href.startsWith('/ko/')) {
          targetLang = 'ko';
        }
        
        console.log('Switching to language:', targetLang);
        switchLanguage(targetLang);
      });
    });
  }
  
  // Initial binding
  bindLanguageSwitcher();
  
  // Re-bind after any dynamic content changes
  setTimeout(bindLanguageSwitcher, 1000);
  
  // Store language preference
  localStorage.setItem('preferred-language', currentLang);
});

// Auto-redirect based on browser language preference
function autoRedirectLanguage() {
  const preferredLang = localStorage.getItem('preferred-language');
  const browserLang = navigator.language || navigator.userLanguage;
  
  if (preferredLang) {
    // Use stored preference
    return;
  }
  
  // Auto-detect language
  let detectedLang = 'en';
  if (browserLang.startsWith('zh')) {
    detectedLang = 'zh';
  } else if (browserLang.startsWith('ja')) {
    detectedLang = 'ja';
  } else if (browserLang.startsWith('ko')) {
    detectedLang = 'ko';
  }
  
  // Redirect if needed
  const currentPath = window.location.pathname;
  const isHomePage = currentPath === '/' || currentPath === '/index.html';
  
  if (isHomePage && detectedLang !== 'en') {
    window.location.href = `/${detectedLang}/`;
  }
}

// Run auto-redirect on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoRedirectLanguage);
} else {
  autoRedirectLanguage();
} 
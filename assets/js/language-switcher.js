(function() {
    // 语言配置
    const languages = {
        'en': 'English',
        'zh': '中文',
        'ja': '日本語',
        'ko': '한국어'
    };

    // 获取当前语言
    function getCurrentLanguage() {
        const path = window.location.pathname;
        if (path.startsWith('/zh/')) return 'zh';
        if (path.startsWith('/ja/')) return 'ja';
        if (path.startsWith('/ko/')) return 'ko';
        return 'en';
    }

    // 创建语言切换器
    function createLanguageSwitcher() {
        const currentLang = getCurrentLanguage();
        const switcher = document.createElement('div');
        switcher.className = 'language-switcher-fixed';
        
        switcher.innerHTML = `
            <div class="language-switcher">
                <div class="custom-dropdown">
                    <button class="dropdown-toggle" type="button" aria-expanded="false">
                        <span class="language-label">${languages[currentLang]}</span>
                        <span class="dropdown-arrow">▾</span>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a href="/" class="dropdown-item" data-lang="en">English</a></li>
                        <li><a href="/zh/" class="dropdown-item" data-lang="zh">中文</a></li>
                        <li><a href="/ja/" class="dropdown-item" data-lang="ja">日本語</a></li>
                        <li><a href="/ko/" class="dropdown-item" data-lang="ko">한국어</a></li>
                    </ul>
                </div>
            </div>
        `;

        document.body.appendChild(switcher);
        
        // 绑定事件
        bindSwitcherEvents(switcher);
    }

    // 绑定切换器事件
    function bindSwitcherEvents(switcher) {
        const toggle = switcher.querySelector('.dropdown-toggle');
        const menu = switcher.querySelector('.dropdown-menu');
        const items = switcher.querySelectorAll('.dropdown-item');

        // 切换下拉菜单
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !isExpanded);
            menu.style.display = isExpanded ? 'none' : 'block';
        });

        // 点击外部关闭菜单
        document.addEventListener('click', function(e) {
            if (!switcher.contains(e.target)) {
                toggle.setAttribute('aria-expanded', 'false');
                menu.style.display = 'none';
            }
        });

        // 语言选择事件
        items.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const targetUrl = this.getAttribute('href');
                
                // 更新 URL 并刷新页面
                window.location.href = targetUrl;
            });
        });
    }

    // 初始化
    function init() {
        // 页面加载完成后创建语言切换器
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                createLanguageSwitcher();
            });
        } else {
            createLanguageSwitcher();
        }
    }

    // 启动
    init();
})(); 
/* ==========================================================
   JAIZ BANK INTRANET DASHBOARD — COMPLETE JAVASCRIPT
   Brand Colors: Navy #002f5e | Light Blue #aad5ff | Gold #d1c323
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================
     1. NAVIGATION CONFIG — Default structure
     ========================================================== */
  const DEFAULT_NAV = [
    {
      id: 'portals',
      label: 'Portals',
      hasDropdown: true,
      visible: true,
      dropdown: [
        { icon: 'fa-user-tie',        label: 'Employee Portal' },
        { icon: 'fa-users-gear',      label: 'Admin Portal' },
        { icon: 'fa-user-shield',     label: 'Customer Portal' },
        { icon: 'fa-briefcase',       label: 'Vendor Portal' },
        { icon: 'fa-chart-line',      label: 'Executive Dashboard' },
        { icon: 'fa-mosque',          label: 'Shariah Compliance Portal' }
      ]
    },
    {
      id: 'products',
      label: 'Products',
      hasDropdown: true,
      visible: true,
      dropdown: [
        { icon: 'fa-piggy-bank',            label: 'Savings Accounts' },
        { icon: 'fa-hand-holding-dollar',   label: 'Loans & Advances' },
        { icon: 'fa-credit-card',           label: 'Cards' },
        { icon: 'fa-mobile-screen',         label: 'Mobile Banking' },
        { icon: 'fa-globe',                 label: 'Internet Banking' },
        { icon: 'fa-mosque',                label: 'Islamic Finance (Murabaha, Ijara)' }
      ]
    },
    {
      id: 'enterprise',
      label: 'Enterprise Applications',
      hasDropdown: false,
      visible: true,
      dropdown: []
    },
    {
      id: 'hr',
      label: 'HR',
      hasDropdown: false,
      visible: true,
      dropdown: []
    },
    {
      id: 'divisions',
      label: 'Divisions',
      hasDropdown: true,
      visible: true,
      dropdown: [
        { icon: 'fa-building',              label: 'Retail Banking' },
        { icon: 'fa-city',                  label: 'Corporate Banking' },
        { icon: 'fa-vault',                 label: 'Treasury' },
        { icon: 'fa-shield-halved',         label: 'Risk Management' },
        { icon: 'fa-file-invoice-dollar',   label: 'Finance & Accounts' },
        { icon: 'fa-scale-balanced',        label: 'Compliance' },
        { icon: 'fa-computer',              label: 'IT & Operations' },
        { icon: 'fa-mosque',                label: 'Shariah Audit' }
      ]
    },
    {
      id: 'forms',
      label: 'Forms & Templates',
      hasDropdown: true,
      visible: true,
      dropdown: [
        { icon: 'fa-file-lines',      label: 'HR Forms' },
        { icon: 'fa-file-invoice',    label: 'Finance Forms' },
        { icon: 'fa-file-shield',     label: 'Compliance Forms' },
        { icon: 'fa-file-signature',  label: 'Loan Templates' },
        { icon: 'fa-file-excel',      label: 'Reports Templates' },
        { icon: 'fa-mosque',          label: 'Shariah Forms' }
      ]
    },
    {
      id: 'docs',
      label: 'Useful Documents',
      hasDropdown: true,
      visible: true,
      dropdown: [
        { icon: 'fa-book',            label: 'Policy Manual' },
        { icon: 'fa-book-open',       label: 'Employee Handbook' },
        { icon: 'fa-file-contract',   label: 'Circulars' },
        { icon: 'fa-file-pdf',        label: 'Annual Reports' },
        { icon: 'fa-graduation-cap',  label: 'Training Materials' }
      ]
    },
    {
      id: 'kb',
      label: 'Knowledge Base',
      hasDropdown: true,
      visible: true,
      dropdown: [
        { icon: 'fa-circle-question', label: 'FAQs' },
        { icon: 'fa-lightbulb',       label: 'How-To Guides' },
        { icon: 'fa-bug',             label: 'IT Troubleshooting' },
        { icon: 'fa-headset',         label: 'Contact Support' },
        { icon: 'fa-video',           label: 'Video Tutorials' }
      ]
    }
  ];

  const NAV_STORAGE_KEY = 'jaiz_intranet_nav_v2';

  let navConfig = loadNavConfig();

  function loadNavConfig() {
    try {
      const saved = localStorage.getItem(NAV_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.warn('Could not load nav config:', err);
    }
    return JSON.parse(JSON.stringify(DEFAULT_NAV));
  }

  function saveNavConfig() {
    try {
      localStorage.setItem(NAV_STORAGE_KEY, JSON.stringify(navConfig));
    } catch (err) {
      console.warn('Could not save nav config:', err);
    }
  }

  /* ==========================================================
     2. RENDER TOP NAVIGATION
     ========================================================== */
  const navLinksContainer = document.querySelector('.nav-links');

  function renderTopNav() {
    if (!navLinksContainer) return;
    navLinksContainer.innerHTML = '';

    navConfig.forEach(item => {
      if (item.visible === false) return;

      const navItem = document.createElement('div');
      navItem.className = 'nav-item' + (item.hasDropdown ? ' has-dropdown' : '');
      navItem.dataset.id = item.id;

      const trigger = document.createElement('a');
      trigger.href = '#';
      trigger.className = 'nav-trigger';
      trigger.innerHTML = item.hasDropdown
        ? `${escapeHtml(item.label)} <i class="fa-solid fa-caret-down"></i>`
        : escapeHtml(item.label);
      navItem.appendChild(trigger);

      if (item.hasDropdown && item.dropdown && item.dropdown.length > 0) {
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown-menu';
        dropdown.innerHTML = item.dropdown.map(sub => `
          <a href="#">
            <i class="fa-solid ${sub.icon}"></i> ${escapeHtml(sub.label)}
          </a>
        `).join('');
        navItem.appendChild(dropdown);
      }

      navLinksContainer.appendChild(navItem);
    });

    // Add the "..." dots and "Edit navigation" link
    const dots = document.createElement('span');
    dots.className = 'nav-dots';
    dots.textContent = '...';
    navLinksContainer.appendChild(dots);

    const editLink = document.createElement('a');
    editLink.href = '#';
    editLink.className = 'edit-link';
    editLink.id = 'editNavBtn';
    editLink.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit navigation';
    navLinksContainer.appendChild(editLink);

    attachNavHandlers();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ==========================================================
     3. NAV DROPDOWN HANDLERS
     ========================================================== */
  function attachNavHandlers() {
    const navItems = document.querySelectorAll('.nav-item.has-dropdown');

    navItems.forEach(item => {
      const trigger = item.querySelector('.nav-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isActive = item.classList.contains('active');
        navItems.forEach(i => i.classList.remove('active'));

        if (!isActive) item.classList.add('active');
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-item.has-dropdown')) {
        document.querySelectorAll('.nav-item.has-dropdown').forEach(i => i.classList.remove('active'));
      }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.nav-item.has-dropdown').forEach(i => i.classList.remove('active'));
      }
    });

    // Close dropdown when a menu item is clicked
    document.querySelectorAll('.dropdown-menu a').forEach(link => {
      link.addEventListener('click', () => {
        document.querySelectorAll('.nav-item.has-dropdown').forEach(i => i.classList.remove('active'));
      });
    });

    // Rebind "Edit navigation" click
    const editNavBtnNew = document.getElementById('editNavBtn');
    if (editNavBtnNew) {
      editNavBtnNew.addEventListener('click', (e) => {
        e.preventDefault();
        openEditModal();
      });
    }
  }

  /* ==========================================================
     4. EDIT NAVIGATION MODAL — FULLY FUNCTIONAL
     ========================================================== */
  const editModal = document.getElementById('editNavModal');
  const closeEditModalBtn = document.getElementById('closeEditModal');
  const cancelEditBtn = document.getElementById('cancelEditBtn');
  const saveEditBtn = document.getElementById('saveEditBtn');
  const addNavItemBtn = document.getElementById('addNavItemBtn');
  const resetNavBtn = document.getElementById('resetNavBtn');
  const editNavList = document.getElementById('editNavList');
  const editNavSearch = document.getElementById('editNavSearch');
  const editFooterInfo = document.getElementById('editFooterInfo');

  let currentSearchTerm = '';
  let draggedItem = null;

  function openEditModal() {
    if (!editModal) return;
    editModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    currentSearchTerm = '';
    if (editNavSearch) editNavSearch.value = '';
    renderEditNavList();
  }

  function closeEditModal() {
    if (!editModal) return;
    editModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeEditModalBtn) closeEditModalBtn.addEventListener('click', closeEditModal);
  if (cancelEditBtn) cancelEditBtn.addEventListener('click', closeEditModal);

  if (editModal) {
    editModal.addEventListener('click', (e) => {
      if (e.target === editModal) closeEditModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && editModal && editModal.classList.contains('active')) {
      closeEditModal();
    }
  });

  /* ==========================================================
     5. RENDER EDIT LIST
     ========================================================== */
  function renderEditNavList() {
    if (!editNavList) return;

    const filtered = navConfig.filter(item => {
      if (!currentSearchTerm) return true;
      return item.label.toLowerCase().includes(currentSearchTerm);
    });

    editNavList.innerHTML = '';

    if (filtered.length === 0) {
      editNavList.innerHTML = `
        <div class="edit-empty-state">
          <i class="fa-solid fa-magnifying-glass"></i>
          <p>No navigation items match your search.</p>
        </div>
      `;
    } else {
      filtered.forEach(item => {
        const realIndex = navConfig.findIndex(n => n.id === item.id);

        const el = document.createElement('div');
        el.className = 'edit-nav-item' + (item.visible === false ? ' hidden-item' : '');
        el.dataset.id = item.id;
        el.dataset.index = realIndex;
        el.draggable = true;

        el.innerHTML = `
          <div class="edit-nav-drag" title="Drag to reorder">
            <i class="fa-solid fa-grip-vertical"></i>
          </div>

          <div class="edit-nav-icon-preview">
            <i class="fa-solid ${item.hasDropdown ? 'fa-caret-down' : 'fa-link'}"></i>
          </div>

          <input
            type="text"
            class="edit-nav-input"
            value="${escapeHtml(item.label)}"
            data-id="${item.id}"
            placeholder="Nav label"
          />

          <div class="edit-nav-actions">
            <button class="edit-nav-btn" data-action="toggle" title="${item.visible === false ? 'Show' : 'Hide'}">
              <i class="fa-solid ${item.visible === false ? 'fa-eye-slash' : 'fa-eye'}"></i>
            </button>
            <button class="edit-nav-btn" data-action="up" title="Move up" ${realIndex === 0 ? 'disabled' : ''}>
              <i class="fa-solid fa-arrow-up"></i>
            </button>
            <button class="edit-nav-btn" data-action="down" title="Move down" ${realIndex === navConfig.length - 1 ? 'disabled' : ''}>
              <i class="fa-solid fa-arrow-down"></i>
            </button>
            <button class="edit-nav-btn danger" data-action="delete" title="Delete">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        `;

        editNavList.appendChild(el);
      });
    }

    updateFooterInfo();
    attachEditItemListeners();
    attachDragAndDrop();
  }

  function updateFooterInfo() {
    if (!editFooterInfo) return;
    const visibleCount = navConfig.filter(i => i.visible !== false).length;
    editFooterInfo.textContent = `${navConfig.length} item${navConfig.length !== 1 ? 's' : ''} • ${visibleCount} visible • Changes auto-save`;
  }

  /* ==========================================================
     6. EDIT ITEM LISTENERS
     ========================================================== */
  function attachEditItemListeners() {
    if (!editNavList) return;

    // Inline rename
    editNavList.querySelectorAll('.edit-nav-input').forEach(input => {
      input.addEventListener('input', (e) => {
        const id = e.target.dataset.id;
        const item = navConfig.find(n => n.id === id);
        if (item) {
          item.label = e.target.value;
          saveNavConfig();
        }
      });
    });

    // Action buttons
    editNavList.querySelectorAll('.edit-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const parentItem = btn.closest('.edit-nav-item');
        const id = parentItem.dataset.id;
        const index = navConfig.findIndex(n => n.id === id);

        if (index === -1) return;

        switch (action) {
          case 'toggle':
            navConfig[index].visible = navConfig[index].visible === false ? true : false;
            saveNavConfig();
            renderEditNavList();
            renderTopNav();
            break;

          case 'up':
            if (index > 0) {
              [navConfig[index - 1], navConfig[index]] = [navConfig[index], navConfig[index - 1]];
              saveNavConfig();
              renderEditNavList();
              renderTopNav();
            }
            break;

          case 'down':
            if (index < navConfig.length - 1) {
              [navConfig[index], navConfig[index + 1]] = [navConfig[index + 1], navConfig[index]];
              saveNavConfig();
              renderEditNavList();
              renderTopNav();
            }
            break;

          case 'delete':
            if (confirm(`Delete "${navConfig[index].label}" from navigation?`)) {
              navConfig.splice(index, 1);
              saveNavConfig();
              renderEditNavList();
              renderTopNav();
            }
            break;
        }
      });
    });
  }

  /* ==========================================================
     7. DRAG AND DROP
     ========================================================== */
  function attachDragAndDrop() {
    if (!editNavList) return;

    editNavList.querySelectorAll('.edit-nav-item').forEach(item => {
      item.addEventListener('dragstart', (e) => {
        draggedItem = item;
        item.style.opacity = '0.5';
        e.dataTransfer.effectAllowed = 'move';
      });

      item.addEventListener('dragend', () => {
        if (draggedItem) draggedItem.style.opacity = '';
        draggedItem = null;
        editNavList.querySelectorAll('.edit-nav-item').forEach(el => {
          el.style.borderTop = '';
          el.style.borderBottom = '';
        });
      });

      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!draggedItem || draggedItem === item) return;

        const rect = item.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;

        if (e.clientY < midpoint) {
          item.style.borderTop = '3px solid var(--primary)';
          item.style.borderBottom = '';
        } else {
          item.style.borderBottom = '3px solid var(--primary)';
          item.style.borderTop = '';
        }
      });

      item.addEventListener('dragleave', () => {
        item.style.borderTop = '';
        item.style.borderBottom = '';
      });

      item.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!draggedItem || draggedItem === item) return;

        const fromId = draggedItem.dataset.id;
        const toId = item.dataset.id;

        const fromIndex = navConfig.findIndex(n => n.id === fromId);
        const toIndex = navConfig.findIndex(n => n.id === toId);

        if (fromIndex === -1 || toIndex === -1) return;

        const rect = item.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        const dropAfter = e.clientY >= midpoint;

        const [moved] = navConfig.splice(fromIndex, 1);
        let insertIndex = toIndex;
        if (fromIndex < toIndex) insertIndex--;
        if (dropAfter) insertIndex++;

        navConfig.splice(insertIndex, 0, moved);

        saveNavConfig();
        renderEditNavList();
        renderTopNav();
      });
    });
  }

  /* ==========================================================
     8. ADD / RESET / SAVE BUTTONS
     ========================================================== */
  if (addNavItemBtn) {
    addNavItemBtn.addEventListener('click', () => {
      const label = prompt('Enter the name of the new navigation item:', 'New Item');
      if (!label || !label.trim()) return;

      const id = 'nav_' + Date.now();
      navConfig.push({
        id,
        label: label.trim(),
        hasDropdown: false,
        visible: true,
        dropdown: []
      });

      saveNavConfig();
      renderEditNavList();
      renderTopNav();
    });
  }

  if (resetNavBtn) {
    resetNavBtn.addEventListener('click', () => {
      if (!confirm('Reset navigation to default? This will undo all your customizations.')) return;
      navConfig = JSON.parse(JSON.stringify(DEFAULT_NAV));
      saveNavConfig();
      renderEditNavList();
      renderTopNav();
    });
  }

  if (saveEditBtn) {
    saveEditBtn.addEventListener('click', () => {
      saveNavConfig();
      renderTopNav();
      closeEditModal();
    });
  }

  if (editNavSearch) {
    editNavSearch.addEventListener('input', (e) => {
      currentSearchTerm = e.target.value.toLowerCase().trim();
      renderEditNavList();
    });
  }

  /* ==========================================================
     9. APP DATA — Jaiz Bank Internal Applications
     ========================================================== */
  const allApps = [
    { name: 'Finacle',             category: 'Core Banking', icon: 'fa-building-columns',    color: '#002f5e', status: 'active' },
    { name: 'NUBAN Checker',       category: 'Core Banking', icon: 'fa-circle-check',         color: '#0a4d8c', status: 'active' },
    { name: 'Cheque Clearing',     category: 'Core Banking', icon: 'fa-money-check',          color: '#d1c323', status: 'active' },
    { name: 'Account Opening',     category: 'Core Banking', icon: 'fa-user-plus',            color: '#14B8A6', status: 'active' },
    { name: 'Murabaha Manager',    category: 'Core Banking', icon: 'fa-mosque',               color: '#002f5e', status: 'active' },
    { name: 'Ijara Processing',    category: 'Core Banking', icon: 'fa-file-signature',       color: '#0a4d8c', status: 'active' },

    { name: 'NIBSS Instant Pay',   category: 'Payments',     icon: 'fa-bolt',                 color: '#EC4899', status: 'active' },
    { name: 'RTGS Portal',         category: 'Payments',     icon: 'fa-right-left',           color: '#d1c323', status: 'active' },
    { name: 'SWIFT Terminal',      category: 'Payments',     icon: 'fa-globe',                color: '#3B82F6', status: 'active' },
    { name: 'Card Management',     category: 'Payments',     icon: 'fa-credit-card',          color: '#8B5CF6', status: 'maintenance' },
    { name: 'JaizPay Merchant',    category: 'Payments',     icon: 'fa-qrcode',               color: '#002f5e', status: 'active' },

    { name: 'SAP SuccessFactors',  category: 'HR & Payroll', icon: 'fa-chart-pie',            color: '#0FAAFF', status: 'active' },
    { name: 'Leave Manager',       category: 'HR & Payroll', icon: 'fa-calendar-check',       color: '#22C55E', status: 'active' },
    { name: 'Payroll Portal',      category: 'HR & Payroll', icon: 'fa-money-bill-wave',      color: '#d1c323', status: 'active' },
    { name: 'Staff Directory',     category: 'HR & Payroll', icon: 'fa-address-book',         color: '#06B6D4', status: 'active' },

    { name: 'Insights',            category: 'Reporting',    icon: 'fa-chart-line',           color: '#8B5CF6', status: 'active' },
    { name: 'MPR (OBIEE)',         category: 'Reporting',    icon: 'fa-chart-column',         color: '#002f5e', status: 'active' },
    { name: 'FX Report',           category: 'Reporting',    icon: 'fa-money-bill-trend-up',  color: '#22C55E', status: 'active' },
    { name: 'Regulatory Reports',  category: 'Reporting',    icon: 'fa-file-shield',          color: '#EF4444', status: 'active' },
    { name: 'Shariah Audit Report',category: 'Reporting',    icon: 'fa-mosque',               color: '#d1c323', status: 'active' },

    { name: 'Processmaker',        category: 'Operations',   icon: 'fa-diagram-project',      color: '#3B82F6', status: 'active' },
    { name: 'Lead to Loan',        category: 'Operations',   icon: 'fa-hand-holding-dollar',  color: '#d1c323', status: 'active' },
    { name: 'Treasury Desk',       category: 'Operations',   icon: 'fa-vault',                color: '#002f5e', status: 'active' },
    { name: 'Trade Finance',       category: 'Operations',   icon: 'fa-ship',                 color: '#0891B2', status: 'active' }
  ];

  const featuredApps = allApps.slice(0, 8);
  const appGrid = document.getElementById('appGrid');

  function renderFeaturedApps(list) {
    if (!appGrid) return;
    appGrid.innerHTML = '';

    if (list.length === 0) {
      appGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#6b7280; padding:20px;">No apps found.</p>`;
      return;
    }

    list.forEach(app => {
      const card = document.createElement('a');
      card.href = '#';
      card.className = 'app-card';
      card.innerHTML = `
        <div class="app-icon" style="background:${app.color}20; color:${app.color}">
          <i class="fa-solid ${app.icon}"></i>
        </div>
        <span class="app-name">${app.name}</span>
      `;
      appGrid.appendChild(card);
    });
  }
  renderFeaturedApps(featuredApps);

  /* ==========================================================
     10. HOMEPAGE SEARCH
     ========================================================== */
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = featuredApps.filter(app => app.name.toLowerCase().includes(q));
      renderFeaturedApps(filtered);
    });
  }

  /* ==========================================================
     11. MODAL LOGIC (App Directory)
     ========================================================== */
  const modal = document.getElementById('appModal');
  const openBtn = document.getElementById('openModalBtn');
  const closeBtn = document.getElementById('closeModalBtn');
  const closeFooterBtn = document.getElementById('closeModalBtnFooter');
  const modalAppList = document.getElementById('modalAppList');
  const modalSearchInput = document.getElementById('modalSearchInput');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const appCountEl = document.getElementById('appCount');

  let currentFilter = 'all';
  let currentSearch = '';

  function openModal() {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderModalApps();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeFooterBtn) closeFooterBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  function renderModalApps() {
    if (!modalAppList) return;

    let filtered = allApps.filter(app => {
      const matchesFilter = currentFilter === 'all' || app.category === currentFilter;
      const matchesSearch =
        app.name.toLowerCase().includes(currentSearch) ||
        app.category.toLowerCase().includes(currentSearch);
      return matchesFilter && matchesSearch;
    });

    const grouped = {};
    filtered.forEach(app => {
      if (!grouped[app.category]) grouped[app.category] = [];
      grouped[app.category].push(app);
    });

    modalAppList.innerHTML = '';

    if (Object.keys(grouped).length === 0) {
      modalAppList.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-magnifying-glass"></i>
          <p>No applications found matching your search.</p>
        </div>`;
      if (appCountEl) appCountEl.textContent = `0 applications`;
      return;
    }

    Object.keys(grouped).forEach(category => {
      const group = document.createElement('div');
      group.className = 'category-group';

      group.innerHTML = `
        <h3 class="category-title">${category} (${grouped[category].length})</h3>
        <div class="category-grid">
          ${grouped[category].map(app => `
            <a href="#" class="modal-app-card">
              <div class="modal-app-icon" style="background:${app.color}20; color:${app.color}">
                <i class="fa-solid ${app.icon}"></i>
              </div>
              <div class="modal-app-info">
                <div class="modal-app-name">${app.name}</div>
                <div class="modal-app-cat">${app.category}</div>
              </div>
              <span class="status-dot ${app.status}" title="${app.status === 'active' ? 'Active' : 'Maintenance'}"></span>
            </a>
          `).join('')}
        </div>
      `;
      modalAppList.appendChild(group);
    });

    if (appCountEl) {
      appCountEl.textContent = `${filtered.length} application${filtered.length !== 1 ? 's' : ''}`;
    }
  }

  if (modalSearchInput) {
    modalSearchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.toLowerCase().trim();
      renderModalApps();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderModalApps();
    });
  });

  /* ==========================================================
     12. LIVE DATE & TIME
     ========================================================== */
  function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
    const dateStr = now.toLocaleDateString('en-GB', options);
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true
    });
    const dt = document.getElementById('datetime');
    if (dt) dt.textContent = `${dateStr} • ${timeStr}`;
  }
  updateDateTime();
  setInterval(updateDateTime, 60000);

  /* ==========================================================
     13. GREETING
     ========================================================== */
  function updateGreeting() {
    const greetingEl = document.querySelector('.greeting');
    if (greetingEl) greetingEl.textContent = 'Assalamu Alaikum';
  }
  updateGreeting();

  /* ==========================================================
     14. HERO CAROUSEL DOTS
     ========================================================== */
  document.querySelectorAll('.dot').forEach(dot => {
    dot.addEventListener('click', () => {
      document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });

  /* ==========================================================
     15. FLOATING AI BUTTON
     ========================================================== */
  const closeAi = document.querySelector('.close-ai');
  if (closeAi) {
    closeAi.addEventListener('click', (e) => {
      e.stopPropagation();
      const aiFloat = document.querySelector('.ai-float');
      if (aiFloat) aiFloat.style.display = 'none';
    });
  }

  /* ==========================================================
     16. SIDEBAR APPS GRID
     ========================================================== */
  const sidebarApps = [
    { name: 'Outlook',    icon: 'fa-envelope',          color: '#0078D4', brand: false },
    { name: 'SAP',        icon: 'fa-chart-pie',         color: '#0FAAFF', brand: false },
    { name: 'Finacle',    icon: 'fa-building-columns',  color: '#002f5e', brand: false },
    { name: 'Insights',   icon: 'fa-chart-line',        color: '#8B5CF6', brand: false },
    { name: 'HR Portal',  icon: 'fa-users',             color: '#22C55E', brand: false },
    { name: 'SAS',        icon: 'fa-database',          color: '#0EA5E9', brand: false },
    { name: 'SPUK',       icon: 'fa-gears',             color: '#10B981', brand: false },
    { name: 'Clearing',   icon: 'fa-money-check',       color: '#d1c323', brand: false },
    { name: 'NIBSS',      icon: 'fa-bolt',              color: '#F59E0B', brand: false },
    { name: 'NIBBS',      icon: 'fa-credit-card',       color: '#3B82F6', brand: false },
    { name: 'Reports',    icon: 'fa-file-lines',        color: '#6366F1', brand: false },
    { name: 'eBanking',   icon: 'fa-globe',             color: '#22C55E', brand: false },
    { name: 'Treasury',   icon: 'fa-vault',             color: '#002f5e', brand: false },
    { name: 'Card Mgmt',  icon: 'fa-credit-card',       color: '#d1c323', brand: false },
    { name: 'BO Reports', icon: 'fa-file-invoice',      color: '#06B6D4', brand: false },
    { name: 'Murabaha',   icon: 'fa-mosque',            color: '#002f5e', brand: false }
  ];

  const sidebarGrid = document.getElementById('sidebarAppsGrid');
  if (sidebarGrid) {
    sidebarApps.forEach(app => {
      const el = document.createElement('a');
      el.href = '#';
      el.className = 'sidebar-app';
      const iconClass = app.brand ? `fa-brands ${app.icon}` : `fa-solid ${app.icon}`;
      el.innerHTML = `
        <div class="sidebar-app-icon" style="background:${app.color}">
          <i class="${iconClass}"></i>
        </div>
        <span class="sidebar-app-name">${app.name}</span>
      `;
      sidebarGrid.appendChild(el);
    });
  }

  /* ==========================================================
     17. OPEN MODAL FROM SIDEBAR
     ========================================================== */
  const openSidebarBtn = document.getElementById('openModalBtnSidebar');
  if (openSidebarBtn) {
    openSidebarBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  }

  /* ==========================================================
     18. DIVISIONS CAROUSEL SCROLL
     ========================================================== */
  const divisionsTrack = document.getElementById('divisionsTrack');
  const divisionsPrev = document.getElementById('divisionsPrev');
  const divisionsNext = document.getElementById('divisionsNext');

  if (divisionsTrack && divisionsPrev && divisionsNext) {
    const scrollAmount = 420;

    divisionsPrev.addEventListener('click', () => {
      divisionsTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    divisionsNext.addEventListener('click', () => {
      divisionsTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  /* ==========================================================
     19. DIVISIONS PAGINATION DOTS
     ========================================================== */
  if (divisionsTrack) {
    const pageDots = document.querySelectorAll('.divisions-section .page-dot');

    divisionsTrack.addEventListener('scroll', () => {
      if (pageDots.length === 0) return;

      const scrollLeft = divisionsTrack.scrollLeft;
      const scrollWidth = divisionsTrack.scrollWidth;
      const clientWidth = divisionsTrack.clientWidth;
      const totalScroll = scrollWidth - clientWidth;

      if (totalScroll <= 0) return;

      const progress = scrollLeft / totalScroll;
      const activeIndex = Math.min(
        Math.floor(progress * pageDots.length),
        pageDots.length - 1
      );

      pageDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIndex);
      });
    });
  }

  /* ==========================================================
     20. BRAND CLICK → SMOOTH SCROLL TOP
     ========================================================== */
  const brand = document.querySelector('.brand');
  if (brand) {
    brand.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================
     21. CTRL+K → OPEN APP DIRECTORY
     ========================================================== */
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openModal();
    }
  });

  /* ==========================================================
     22. INITIAL RENDER
     ========================================================== */
  renderTopNav();

  /* ==========================================================
     23. CONSOLE BRANDING
     ========================================================== */
  console.log(
    '%c🌿 JAIZ BANK INTRANET',
    'color:#002f5e;background:#aad5ff;font-weight:bold;font-size:16px;padding:6px 12px;border-radius:4px;'
  );
  console.log(
    '%c✅ Dashboard Loaded Successfully',
    'color:#002f5e;font-weight:bold;font-size:13px;'
  );
  console.log(
    '%c🎨 Brand Palette: Navy #002f5e | Light Blue #aad5ff | Gold #d1c323',
    'color:#d1c323;font-size:12px;font-weight:600;'
  );
  console.log(
    '%c💡 Press Ctrl+K to open the App Directory',
    'color:#6b7280;font-size:12px;'
  );
  console.log(
    '%c🛠️ Click "Edit navigation" to customize your menu',
    'color:#6b7280;font-size:12px;'
  );

});

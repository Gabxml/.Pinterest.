
const modal = document.getElementById("myModal");
const modalImg = document.getElementById("img01");
const captionTxt = document.getElementById("caption");
const closeBtn = document.querySelector(".modal .close");

document.querySelectorAll("img.thumb").forEach(img => {
  img.addEventListener("click", () => {
    modal.style.display = "block";
    modalImg.src = img.src;
    captionTxt.innerText = img.alt || "";
  });
});
closeBtn.addEventListener("click", () => modal.style.display = "none");
modal.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });


document.querySelectorAll('.save-btn').forEach(btn => {
  btn.addEventListener('click', event => {
    event.preventDefault();
    const img = btn.closest('.wrap').querySelector('img');
    const title = img?.alt || 'Post';
    alert(`“${title}” has been saved!`);
  });
});

const filterCategories = ['all', 'fits', 'safe_space', 'mantras', 'uni_life', 'clean_diet'];

const homeContainer = document.querySelector('.content[data-cat="home"]');
function showCategory(cat) {
  if (!homeContainer) return;

  // 1) Hide/show all the .wrap items exactly as before:
  homeContainer.querySelectorAll('.wrap').forEach(w => {
    const hideAll = w.dataset.hideAll === 'true';
    const itemCat = w.dataset.cat || 'all';

    let shouldShow;
    if (cat === 'all') {
      shouldShow = !hideAll; 
    } else {
      shouldShow = (itemCat === cat);
    }
    w.style.display = shouldShow ? '' : 'none';
  });

  // 2) Now also hide/show each specificboard header:
  homeContainer.querySelectorAll('.specificboard').forEach(sb => {
    // If we're in “all” mode, hide every specificboard header
    if (cat === 'all') {
      sb.style.display = 'none';
    } else {
      // Otherwise only show the one whose data-cat matches
      sb.style.display = (sb.dataset.cat === cat) ? '' : 'none';
    }
  });
}


document.querySelectorAll('.navdiv a').forEach(link => {
  const href = link.getAttribute('href');
  const icon = link.querySelector('.board, .glogo');
  link.addEventListener('click', e => {
    document.querySelectorAll('.board, .glogo').forEach(el => el.classList.remove('bselected'));
    icon?.classList.add('bselected');
    const cat = href.startsWith('#') ? href.slice(1) : '';
    if (filterCategories.includes(cat)) {
      e.preventDefault();
      showCategory(cat);
      history.replaceState(null, '', href);
    }
  });
});

const scb = document.querySelector('.scb');
let panels = [];
if (scb) {
  panels = Array.from(document.querySelectorAll('.scb + .wrap[data-cat]'));
}
function showTab(cat) {
  if (!panels.length) return;
  document.querySelectorAll('.scb .sc').forEach(el => {
    const isCurrent = el.parentElement.getAttribute('href') === `#${cat}`;
    el.classList.toggle('scselected', isCurrent);
  });
  panels.forEach(panel => {
    panel.style.display = (panel.dataset.cat === cat) ? '' : 'none';
  });
}
if (scb) {
  document.querySelectorAll('.scb a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const cat = link.getAttribute('href').slice(1);
      showTab(cat);
      history.replaceState(null, '', `#${cat}`);
    });
  });
}

document.querySelectorAll('.hboard a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    const raw = link.getAttribute('href').slice(1);
    let categoryToShow = raw === 'home' ? 'all' : raw;

    document.querySelectorAll('.hboardtext').forEach(el => el.classList.remove('hboard‐selected'));
    link.querySelector('.hboardtext').classList.add('hboard‐selected');

    showCategory(categoryToShow);

    history.replaceState(null, '', `#${raw}`);
  });
});


window.addEventListener('DOMContentLoaded', () => {
  const currentHash = window.location.hash.slice(1);
  let initial = 'all';
  if (filterCategories.includes(currentHash)) {
    initial = currentHash;
  }

  if (currentHash === 'home') {
    initial = 'all';
  }

  const anchor = document.querySelector(`.hboard a[href="#${currentHash || 'home'}"]`);
  if (anchor) {
    anchor.querySelector('.hboardtext').classList.add('hboard‐selected');
  } else {

    document.querySelector('.hboard a[href="#home"] .hboardtext').classList.add('hboard‐selected');
  }

  showCategory(initial);
});


document.addEventListener('DOMContentLoaded', () => {
  showCategory('all');


  const profileTabs = document.querySelectorAll('.scb a');
  const profilePanels = document.querySelectorAll('.wrap[data-cat="saved"], .wrap[data-cat="created"]');

  function showProfileTab(tab) {
    profileTabs.forEach(link => {
      const p = link.querySelector('.sc');
      link.getAttribute('href') === `#${tab}`
        ? p.classList.add('scselected')
        : p.classList.remove('scselected');
    });
    profilePanels.forEach(panel => {
      panel.style.display = (panel.dataset.cat === tab) ? '' : 'none';
    });
  }

  profileTabs.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const tab = link.getAttribute('href').slice(1);
      showProfileTab(tab);
      history.replaceState(null, '', `#${tab}`);
    });
  });

  window.addEventListener('load', () => {
    if (document.querySelector('.scb')) {
      const currentHash = window.location.hash.slice(1);
      if (currentHash === 'created') showProfileTab('created');
      else showProfileTab('saved');
    }
  });
  const hash = window.location.hash.slice(1);
  if (filterCategories.includes(hash)) {
    const nav = document.querySelector(`.navdiv a[href='#${hash}'] .board, .navdiv a[href='#${hash}'] .glogo`);
    nav?.classList.add('bselected');
    showCategory(hash);
  }
  if (panels.length) {
    const defaultTab = (hash === 'created') ? 'created' : 'saved';
    showTab(defaultTab);
  }
});

// CREATED

const fileInput = document.getElementById('fileUpload');
const fileNameDisplay = document.getElementById('file-name');
const previewImg = document.getElementById('preview');
const uploadPrompt = document.getElementById('uploadPrompt');

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) {
    fileNameDisplay.textContent = '';
    previewImg.style.display = 'none';
    previewImg.src = '';
    uploadPrompt.style.display = 'block';
    return;
  }


  uploadPrompt.style.display = 'none';
  previewImg.style.display = 'block';

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

const moreOptionsBtn = document.getElementById('moreOptionsBtn');
const moreOptionsSection = document.getElementById('moreOptionsSection');

moreOptionsBtn.addEventListener('click', () => {
  if (moreOptionsSection.style.display === "none") {
    moreOptionsSection.style.display = "block";
    moreOptionsBtn.textContent = "Hide More Options";
  } else {
    moreOptionsSection.style.display = "none";
    moreOptionsBtn.textContent = "More Options";
  }
});

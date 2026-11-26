/* =====================================================
   SCRIPT.JS - Dokumentasi Kunjungan BEI
   JavaScript murni (Vanilla JS), tanpa framework
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Ambil elemen yang dibutuhkan ---------- */
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const toTop = document.getElementById("toTop");

  /* ---------- 1. Navbar berubah + tombol "kembali ke atas" saat di-scroll ---------- */
  function handleScroll() {
    const y = window.scrollY;

    // Tambah class "scrolled" jika halaman sudah digulir
    navbar.classList.toggle("scrolled", y > 60);

    // Tampilkan tombol kembali ke atas setelah scroll 500px
    toTop.classList.toggle("show", y > 500);

    highlightActiveMenu();
  }

  /* ---------- 2. Tandai menu yang sedang aktif sesuai bagian yang dilihat ---------- */
  function highlightActiveMenu() {
    const position = window.scrollY + 140;
    let currentId = "beranda";

    navLinks.forEach(function (link) {
      const section = document.querySelector(link.getAttribute("href"));
      if (section && section.offsetTop <= position) {
        currentId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
    });
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); // jalankan sekali saat halaman dibuka

  /* ---------- 3. Menu hamburger (HP) ---------- */
  function closeMenu() {
    menu.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    navbar.classList.remove("menu-open");
  }

  hamburger.addEventListener("click", function () {
    const isOpen = menu.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    navbar.classList.toggle("menu-open", isOpen);
  });

  /* ---------- 4. Smooth scrolling saat menu / tombol diklik ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      closeMenu(); // tutup menu hamburger setelah memilih
    });
  });

  // Tombol kembali ke atas
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- 5. Animasi muncul saat scroll ---------- */
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // animasi hanya sekali
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach(function (item, i) {
      // Jeda kecil agar elemen muncul berurutan
      item.style.transitionDelay = (i % 4) * 0.08 + "s";
      observer.observe(item);
    });
  } else {
    // Browser lama: langsung tampilkan semua
    revealItems.forEach(function (item) { item.classList.add("visible"); });
  }

  /* ---------- 6. Lightbox galeri foto ---------- */
  const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbCaption = document.getElementById("lbCaption");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");
  let currentIndex = 0;

  // Tampilkan foto sesuai nomor urut
  function showPhoto(index) {
    currentIndex = (index + galleryItems.length) % galleryItems.length; // berputar
    const img = galleryItems[currentIndex].querySelector("img");
    const caption = galleryItems[currentIndex].querySelector("figcaption");
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = caption ? caption.textContent : "";
  }

  function openLightbox(index) {
    showPhoto(index);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden"; // kunci scroll halaman
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    galleryItems[currentIndex].focus();
  }

  galleryItems.forEach(function (item, index) {
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.addEventListener("click", function () { openLightbox(index); });
    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  lbClose.addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", function () { showPhoto(currentIndex - 1); });
  lbNext.addEventListener("click", function () { showPhoto(currentIndex + 1); });

  // Klik area gelap di luar foto untuk menutup
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard: Esc = tutup, panah = pindah foto
  document.addEventListener("keydown", function (e) {
    if (lightbox.hidden) {
      if (e.key === "Escape") closeMenu();
      return;
    }
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPhoto(currentIndex - 1);
    if (e.key === "ArrowRight") showPhoto(currentIndex + 1);
  });

});

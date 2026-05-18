(function () {
  var BASE = "https://www.batmancarpero.com";
  var COMPONENTS = "/components/";

  function setActiveLink(container) {
    var path = window.location.pathname;
    container.querySelectorAll("[data-path]").forEach(function (a) {
      var dp = a.getAttribute("data-path");
      if (path === dp || (dp !== "/" && path.startsWith(dp))) {
        a.classList.add("active");
      }
    });
  }

  function initBurger() {
    var burger = document.querySelector(".nav-burger");
    var mobileMenu = document.querySelector(".nav-mobile-menu");
    if (!burger || !mobileMenu) return;

    burger.addEventListener("click", function () {
      var isOpen = burger.classList.toggle("open");
      mobileMenu.classList.toggle("open", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        burger.classList.remove("open");
        mobileMenu.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });

    document.addEventListener("click", function (e) {
      var nav = document.querySelector("nav");
      if (!nav) return;
      if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
        burger.classList.remove("open");
        mobileMenu.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  async function inject(placeholderId, file, tag) {
    var placeholder = document.getElementById(placeholderId);
    if (!placeholder) return null;
    var res = await fetch(BASE + COMPONENTS + file);
    var html = await res.text();
    placeholder.outerHTML = html;
    return document.querySelector(tag);
  }

  document.addEventListener("DOMContentLoaded", async function () {
    var nav = await inject("nav-root", "nav.html", "nav");
    if (nav) {
      setActiveLink(nav);
      var mobileMenu = document.querySelector(".nav-mobile-menu");
      if (mobileMenu) setActiveLink(mobileMenu);
      initBurger();
    }
    await inject("footer-root", "footer.html", "footer");
  });
})();
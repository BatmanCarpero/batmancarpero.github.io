(function () {
  const BASE = "https://batmancarpero.com";
  const COMPONENTS = "/components/";

  function setActiveLink(nav) {
    const path = window.location.pathname;
    nav.querySelectorAll("[data-path]").forEach(function (a) {
      var dp = a.getAttribute("data-path");
      if (path === dp || (dp !== "/" && path.startsWith(dp))) {
        a.classList.add("active");
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
    if (nav) setActiveLink(nav);
    await inject("footer-root", "footer.html", "footer");
  });
})();
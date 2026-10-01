// Копирование контактов в буфер обмена.
// navigator.clipboard может быть недоступен при открытии через file:// —
// тогда используется запасной вариант через textarea + execCommand("copy").
(function () {
  var toast = document.getElementById("toast");
  var toastTimer;

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(
        function () { return true; },
        function () { return fallbackCopy(text); }
      );
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-visible"); }, 1800);
  }

  document.querySelectorAll("[data-copy]").forEach(function (el) {
    el.addEventListener("click", function (event) {
      event.preventDefault();
      var value = el.getAttribute("data-copy");
      copy(value).then(function (ok) {
        if (ok) {
          el.classList.add("is-copied");
          clearTimeout(el._copiedTimer);
          el._copiedTimer = setTimeout(function () { el.classList.remove("is-copied"); }, 1800);
          showToast("Скопировано: " + value);
        } else {
          showToast("Не удалось скопировать: " + value);
        }
      });
    });
  });
})();

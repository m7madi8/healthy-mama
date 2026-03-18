/**
 * نموذج الدفع عبر الباي بال (يدعم فيزا/ماستركارد عبر الباي بال)
 */
(function () {
  "use strict";

  var wrap = document.querySelector(".book-payment-wrap");
  if (!wrap) return;

  var business = window.PAYPAL_BUSINESS || "";
  var env = (window.PAYPAL_ENV || "live").toLowerCase();
  var isSandbox = env === "sandbox";
  var bookId = wrap.getAttribute("data-book-id") || "";
  var bookTitle = wrap.getAttribute("data-book-title") || "كتاب";
  var amount = wrap.getAttribute("data-amount") || "49";

  var formContainer = document.getElementById("paypal-form-container");
  if (!formContainer || !business || business === "your-email@example.com") {
    if (formContainer) {
      formContainer.innerHTML = "<p class=\"book-payment-notice\">لتشغيل الدفع، عدّلي إيميل الباي بال في ملف <code>payment-config.js</code>.</p>";
    }
    return;
  }

  var action = isSandbox
    ? "https://www.sandbox.paypal.com/cgi-bin/webscr"
    : "https://www.paypal.com/cgi-bin/webscr";

  var base = location.href.replace(/[^/]+$/, "");
  var returnUrl = base + "thank-you.html?book=" + encodeURIComponent(bookId);
  var cancelUrl = location.href;

  var form = document.createElement("form");
  form.setAttribute("method", "post");
  form.setAttribute("action", action);
  form.setAttribute("id", "paypal-checkout-form");
  form.setAttribute("class", "book-payment-form");

  var fields = [
    { name: "cmd", value: "_xclick" },
    { name: "business", value: business },
    { name: "item_name", value: bookTitle },
    { name: "amount", value: amount },
    { name: "currency_code", value: "ILS" },
    { name: "return", value: returnUrl },
    { name: "cancel_return", value: cancelUrl },
    { name: "no_shipping", value: "1" },
    { name: "charset", value: "utf-8" },
    { name: "lc", value: "ar" }
  ];

  fields.forEach(function (f) {
    var input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", f.name);
    input.setAttribute("value", f.value);
    form.appendChild(input);
  });

  var btn = document.createElement("button");
  btn.setAttribute("type", "submit");
  btn.setAttribute("class", "book-page-cta book-payment-btn");
  btn.textContent = "الدفع بالباي بال أو فيزا/ماستركارد — " + amount + " ₪";

  form.appendChild(btn);
  formContainer.appendChild(form);
})();

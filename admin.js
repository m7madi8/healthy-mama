/**
 * لوحة التحكم — إدارة الكتب والمبيعات
 * البيانات محفوظة في localStorage (للاستخدام دون خادم).
 * المبيعات تُسجّل من الموقع فقط عند إتمام الشراء؛ اللوحة للعرض فقط.
 */

(function () {
  "use strict";

  var SALES_KEY = "adminSales";

  var books = [
    { id: "book-postnatal", title: "الاكتئاب بعد الولادة: دليل الأم لفهم مشاعرها واستعادة توازنها", shortTitle: "الاكتئاب بعد الولادة", slug: "book-postnatal", price: 49, image: "1.png" },
    { id: "book-prep", title: "كيف تهيئين جسدك للحمل: دليل علمي قبل بداية الرحلة", shortTitle: "تهيئة الجسد للحمل", slug: "book-prep", price: 49, image: "2.png" },
    { id: "book-pregnancy", title: "رحلة الحمل: ماذا يحدث في جسمك شهرًا بشهر", shortTitle: "رحلة الحمل شهرًا بشهر", slug: "book-pregnancy", price: 49, image: "3.png" },
    { id: "book-recovery", title: "الأربعون يومًا الأولى بعد الولادة: دليل التعافي الجسدي والنفسي للأم", shortTitle: "الأربعون يومًا بعد الولادة", slug: "book-recovery", price: 49, image: "4.png" },
  ];

  var dashboard = document.getElementById("admin-dashboard");
  var logoutBtn = document.getElementById("admin-logout");
  var navBtns = document.querySelectorAll(".admin-nav-btn");
  var booksTbody = document.getElementById("admin-books-tbody");
  var booksCountEl = document.getElementById("admin-books-count");
  var totalPurchasesEl = document.getElementById("admin-total-purchases");
  var totalRevenueEl = document.getElementById("admin-total-revenue");
  var salesTbody = document.getElementById("admin-sales-tbody");
  var totalSalesEl = document.getElementById("admin-total-sales");
  var totalCountEl = document.getElementById("admin-total-count");

  function getSales() {
    try {
      var raw = localStorage.getItem(SALES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function setSales(list) {
    localStorage.setItem(SALES_KEY, JSON.stringify(list));
  }

  /** لتسجيل بيع من الموقع فقط (مثلاً من صفحة تأكيد الشراء) */
  function addSale(bookId, amount, date, note) {
    var list = getSales();
    var id = "sale-" + Date.now();
    list.unshift({ id: id, bookId: bookId, amount: amount, date: date, note: note || "" });
    setSales(list);
  }

  function renderBooks() {
    var list = getSales();
    var byBook = {};
    var totalPurchases = 0;
    var totalRevenue = 0;
    books.forEach(function (b) {
      byBook[b.id] = { count: 0, revenue: 0 };
    });
    list.forEach(function (s) {
      if (byBook[s.bookId]) {
        byBook[s.bookId].count += 1;
        byBook[s.bookId].revenue += Number(s.amount) || 0;
        totalPurchases += 1;
        totalRevenue += Number(s.amount) || 0;
      }
    });

    if (booksCountEl) booksCountEl.textContent = books.length;
    if (totalPurchasesEl) totalPurchasesEl.textContent = totalPurchases;
    if (totalRevenueEl) totalRevenueEl.textContent = totalRevenue + " ₪";

    if (!booksTbody) return;
    booksTbody.innerHTML = "";
    books.forEach(function (b) {
      var stat = byBook[b.id] || { count: 0, revenue: 0 };
      var tr = document.createElement("tr");
      var imgSrc = b.image || "1.png";
      var imgHtml = "<img src=\"" + escapeHtml(imgSrc) + "\" alt=\"\" class=\"admin-book-thumb\" width=\"48\" height=\"64\" />";
      var displayTitle = b.shortTitle || b.title;
      tr.innerHTML =
        "<td class=\"admin-book-cell\"><span class=\"admin-book-thumb-wrap\">" + imgHtml + "</span><span class=\"admin-book-title-text\">" + escapeHtml(displayTitle) + "</span></td>" +
        "<td>" + (b.price != null ? b.price + " ₪" : "—") + "</td>" +
        "<td><strong>" + stat.count + "</strong></td>" +
        "<td>" + stat.revenue + " ₪</td>" +
        "<td><a href=\"" + escapeHtml(b.slug) + ".html\" class=\"admin-link\" target=\"_blank\" rel=\"noopener\">عرض الصفحة</a></td>";
      booksTbody.appendChild(tr);
    });
  }

  function renderSales() {
    if (!salesTbody || !totalSalesEl || !totalCountEl) return;
    var list = getSales();
    var totalRevenue = 0;
    list.forEach(function (s) {
      totalRevenue += Number(s.amount) || 0;
    });
    totalCountEl.textContent = list.length;
    totalSalesEl.textContent = totalRevenue + " ₪";

    salesTbody.innerHTML = "";
    if (list.length === 0) {
      var tr = document.createElement("tr");
      tr.innerHTML = "<td colspan=\"4\" style=\"text-align:center;color:var(--admin-muted)\">لا توجد مبيعات مسجّلة</td>";
      salesTbody.appendChild(tr);
      return;
    }
    list.forEach(function (s) {
      var book = books.find(function (b) { return b.id === s.bookId; });
      var title = book ? (book.shortTitle || book.title) : s.bookId;
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" + escapeHtml(s.date) + "</td>" +
        "<td>" + escapeHtml(title) + "</td>" +
        "<td>" + (s.amount || 0) + " ₪</td>" +
        "<td>" + escapeHtml(s.note || "—") + "</td>";
      salesTbody.appendChild(tr);
    });
  }

  function escapeHtml(str) {
    if (str == null) return "";
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  var panelTitles = { books: "الكتب وعمليات الشراء", sales: "المبيعات" };

  function switchPanel(panelId) {
    document.querySelectorAll(".admin-panel").forEach(function (p) {
      p.hidden = p.id !== "panel-" + panelId;
      p.classList.toggle("active", p.id === "panel-" + panelId);
    });
    document.querySelectorAll(".admin-nav-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-panel") === panelId);
    });
    var titleEl = document.getElementById("admin-page-title");
    if (titleEl && panelTitles[panelId]) titleEl.textContent = panelTitles[panelId];
  }

  function init() {
    if (!dashboard) return;
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        window.location.href = "index.html";
      });
    }
    navBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var panel = btn.getAttribute("data-panel");
        if (panel) switchPanel(panel);
      });
    });
    renderBooks();
    renderSales();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

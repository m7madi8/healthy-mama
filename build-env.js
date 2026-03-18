/**
 * يقرأ ملف .env ويولّد env.js للاستخدام في الموقع.
 * شغّل: node build-env.js
 * تأكد من وجود ملف .env (انسخه من .env.example واملأ القيم).
 */
var fs = require("fs");
var path = require("path");

var envPath = path.join(__dirname, ".env");
var outPath = path.join(__dirname, "env.js");

if (!fs.existsSync(envPath)) {
  console.error("ملف .env غير موجود. انسخ .env.example إلى .env واملأ القيم ثم شغّل السكربت مرة أخرى.");
  process.exit(1);
}

var raw = fs.readFileSync(envPath, "utf8");
var env = {};
raw.split("\n").forEach(function (line) {
  line = line.trim();
  if (!line || line.charAt(0) === "#") return;
  var i = line.indexOf("=");
  if (i === -1) return;
  var key = line.slice(0, i).trim();
  var val = line.slice(i + 1).trim();
  if (val.charAt(0) === '"' && val.charAt(val.length - 1) === '"') val = val.slice(1, -1).replace(/\\"/g, '"');
  else if (val.charAt(0) === "'" && val.charAt(val.length - 1) === "'") val = val.slice(1, -1).replace(/\\'/g, "'");
  env[key] = val;
});

var vars = [
  "PAYPAL_BUSINESS",
  "PAYPAL_ENV",
  "WHATSAPP_URL",
  "INSTAGRAM_URL",
  "ADMIN_PASSWORD",
  "CONTACT_FORM_ACTION"
];

var lines = ["/** تم توليده من .env — لا تعدّل يدوياً */", "(function(){ \"use strict\";"];
vars.forEach(function (key) {
  var val = env[key];
  if (val === undefined || val === "") return;
  var safe = JSON.stringify(val);
  lines.push("window." + key + "=" + safe + ";");
});
lines.push("})();");

fs.writeFileSync(outPath, lines.join("\n"), "utf8");
console.log("تم إنشاء env.js بنجاح.");

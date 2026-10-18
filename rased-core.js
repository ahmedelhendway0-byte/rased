/* =====================================================================
   راصد — الكود المشترك (اتصال بالشيت + شغل من غير نت + بيانات تجريبية)
   مفيش داعي تعدّل هنا — الإعدادات كلها في config.js
   ===================================================================== */
(function () {
  "use strict";
  var RS = (window.RS = {});
  var C = window.CONFIG || {};

  /* ---------------- أدوات عامة ---------------- */
  RS.$ = function (id) { return document.getElementById(id); };
  RS.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  RS.ymd = function (d) { d = d || new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); };
  RS.parse = function (s) { var p = String(s).split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); };
  RS.today = function () { return RS.ymd(new Date()); };
  RS.isSchoolDay = function (s) {
    var d = RS.parse(s);
    return (C.WEEKEND || [5, 6]).indexOf(d.getDay()) === -1 && (C.HOLIDAYS || []).indexOf(s) === -1;
  };
  RS.schoolDays = function (from, to) {
    var out = [], d = RS.parse(from), end = RS.parse(to);
    while (d <= end) { var s = RS.ymd(d); if (RS.isSchoolDay(s)) out.push(s); d.setDate(d.getDate() + 1); }
    return out;
  };
  RS.arDate = function (s, opt) {
    try { return RS.parse(s).toLocaleDateString("ar-EG", opt || { weekday: "long", day: "numeric", month: "long", year: "numeric" }); }
    catch (e) { return s; }
  };
  RS.arTime = function (iso) {
    if (!iso) return "";
    try { return new Date(iso).toLocaleString("ar-EG", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }); }
    catch (e) { return iso; }
  };
  RS.DAY_AR = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  RS.MONTH_AR = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

  /* تخزين على الجهاز (بيتحمّل لو التخزين مقفول) */
  RS.get = function (k, def) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; } };
  RS.set = function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  RS.del = function (k) { try { localStorage.removeItem(k); } catch (e) {} };

  /* هاش بسيط (للتحقق من كلمة السر من غير نت على نفس الجهاز) */
  RS.hash = function (s) {
    var h1 = 0x811c9dc5, h2 = 0x01000193 ^ 0x5bd1e995;
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 16777619) >>> 0;
      h2 = Math.imul(h2 ^ c, 2246822519) >>> 0;
    }
    return h1.toString(16) + h2.toString(16);
  };

  /* اللوجو */
  var logoN = 0;
  RS.logo = function () {
    var id = "rsg" + (++logoN);
    return '<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#14b8a6"/><stop offset=".55" stop-color="#0f766e"/><stop offset="1" stop-color="#0b3b5c"/></linearGradient></defs>' +
      '<rect width="64" height="64" rx="18" fill="url(#' + id + ')"/>' +
      '<rect x="16" y="14" width="32" height="38" rx="7" fill="#fff"/>' +
      '<rect x="25" y="9.5" width="14" height="9" rx="3.5" fill="#f5b544"/>' +
      '<path d="M23.5 33.5l6 6 11-12.5" fill="none" stroke="#0f766e" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="47" cy="47" r="7" fill="#f5b544" stroke="#fff" stroke-width="2.5"/></svg>';
  };

  RS.toast = function (msg, kind) {
    var t = document.createElement("div");
    t.className = "toast " + (kind || "");
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add("show"); }, 10);
    setTimeout(function () { t.classList.remove("show"); setTimeout(function () { t.remove(); }, 300); }, 3200);
  };

  /* ---------------- وضع الديمو: "سيرفر" وهمي على الجهاز ---------------- */
  var FIRST = ["أحمد", "محمد", "محمود", "مصطفى", "عمر", "يوسف", "كريم", "إسلام", "خالد", "عبدالله", "علي", "حسن", "إبراهيم", "مازن", "زياد",
    "ياسين", "هشام", "طارق", "سيف", "بلال", "آدم", "حمزة", "أنس", "معاذ", "عمرو", "شريف", "وليد", "رامي", "إياد", "نور"];
  var MID = ["محمد", "أحمد", "محمود", "السيد", "علي", "حسن", "إبراهيم", "عبدالرحمن", "مصطفى", "خالد", "سامي", "جمال", "عادل", "فتحي", "صلاح"];
  var LAST = ["عبدالعزيز", "الشافعي", "رمضان", "سليمان", "عوض", "منصور", "عثمان", "النجار", "الشرقاوي", "حسين", "زكي", "البنا",
    "عبدالحميد", "الدسوقي", "المصري", "شعبان", "فرج", "عيسى", "قنديل", "الجمال"];
  function rng(seed) { return function () { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; var t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  RS.makeDemo = function () {
    var today = RS.today(), classes = C.DEMO_CLASSES || [], N = C.DEMO_STUDENTS_PER_CLASS || 40;
    var students = [], attendance = [], rnd = rng(20261018);
    var days = RS.schoolDays(C.TERM_START || today, today);
    classes.forEach(function (cl) {
      var prof = [];
      for (var n = 1; n <= N; n++) {
        students.push({ id: cl.id * 100 + n, classId: cl.id,
          name: FIRST[(n - 1 + cl.id * 5) % FIRST.length] + " " + MID[(n * 7 + cl.id * 2) % MID.length] + " " + LAST[(n * 3 + cl.id * 7) % LAST.length] });
        var r = rnd(), p = r < 0.55 ? 0.03 : r < 0.85 ? 0.07 : 0.16;
        if (n === 4 || n === 17) p = 0.6;                                   // غياب كتير (حوالي 15+ يوم)
        if ((n === 9 && cl.id % 2 === 1) || (n === 26 && cl.id === 2)) p = 0.97; // منقطع (30+ يوم)
        prof.push(p);
      }
      var by = "raed" + cl.id;
      days.forEach(function (d) {
        if (d === today && (C.DEMO_RECORDED_TODAY || []).indexOf(cl.id) === -1) return;
        var ab = [];
        for (var i = 0; i < N; i++) if (rnd() < prof[i]) ab.push(cl.id * 100 + i + 1);
        attendance.push({ date: d, classId: cl.id, absent: ab, by: by, at: d + "T08:" + pad(10 + cl.id * 4) + ":00" });
      });
    });
    return { classes: classes, students: students, attendance: attendance };
  };

  var DEMO_SAVED = "rased_demo_saved_v1";
  var Demo = {
    db: null,
    load: function () {
      if (!this.db || this.db.day !== RS.today()) { this.db = RS.makeDemo(); this.db.day = RS.today(); }
      var saved = RS.get(DEMO_SAVED, {}), db = this.db;
      var att = db.attendance.filter(function (r) { return !saved[r.date + "|" + r.classId]; });
      Object.keys(saved).forEach(function (k) { att.push(saved[k]); });
      return { classes: db.classes, students: db.students, attendance: att };
    },
    user: function (u) {
      return (C.DEMO_USERS || []).filter(function (x) { return String(x.username).toLowerCase() === String(u).toLowerCase(); })[0];
    },
    token: function (x) { return RS.hash(x.username + "|" + x.password + "|demo"); },
    handle: function (action, b) {
      if (action === "login") {
        var x = this.user(b.u);
        if (!x || String(x.password) !== String(b.p)) return { ok: false, error: "اسم المستخدم أو كلمة السر غير صحيحة" };
        return { ok: true, token: this.token(x), user: pub(x) };
      }
      var me = this.user(b.u);
      if (!me || this.token(me) !== b.token) return { ok: false, auth: true, error: "انتهت الجلسة — ادخل تاني" };
      var all = this.load();
      if (action === "data") return filterFor(me, all);
      if (action === "save") {
        var chk = canSave(me, b); if (chk) return { ok: false, error: chk };
        var row = { date: b.date, classId: +b.classId, absent: (b.absent || []).map(Number), by: me.username, at: new Date().toISOString() };
        var saved = RS.get(DEMO_SAVED, {}); saved[row.date + "|" + row.classId] = row; RS.set(DEMO_SAVED, saved);
        return { ok: true, row: row };
      }
      return { ok: false, error: "طلب غير معروف" };
    }
  };
  function pub(x) { return { username: x.username, role: x.role, classId: x.classId === "" ? "" : +x.classId, name: x.name }; }
  function filterFor(me, all) {
    var res = { ok: true, user: pub(me), serverTime: new Date().toISOString() };
    if (me.role === "admin") { res.classes = all.classes; res.students = all.students; res.attendance = all.attendance; return res; }
    var cid = +me.classId;
    res.classes = all.classes.filter(function (c) { return +c.id === cid; });
    res.students = all.students.filter(function (s) { return +s.classId === cid; });
    res.attendance = all.attendance.filter(function (a) { return +a.classId === cid; });
    return res;
  }
  function canSave(me, b) {
    if (me.role !== "admin" && +me.classId !== +b.classId) return "مسموح لك تسجّل لفصلك بس";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(b.date || "")) return "تاريخ غير صحيح";
    if (b.date > RS.today()) return "مينفعش تسجّل ليوم لسه مجاش";
    return "";
  }
  RS.resetDemo = function () { RS.del(DEMO_SAVED); Demo.db = null; };

  /* ---------------- الاتصال (شيت جوجل أو الديمو) ---------------- */
  RS.isDemo = function () { return !C.API_URL; };
  RS.call = function (action, body) {
    body = body || {};
    if (RS.isDemo()) return new Promise(function (res) { setTimeout(function () { res(Demo.handle(action, body)); }, 150); });
    var ctl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 20000);
    body.action = action;
    return fetch(C.API_URL, {
      method: "POST", redirect: "follow", signal: ctl ? ctl.signal : undefined,
      headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(body)
    }).then(function (r) { return r.json(); })
      .then(function (j) { clearTimeout(timer); return j; },
            function (e) { clearTimeout(timer); var err = new Error("offline"); err.offline = true; throw err; });
  };

  /* ---------------- الجلسة والكاش وطابور الإرسال ---------------- */
  var APP = "";           // "raed" أو "admin" — كل تطبيق ليه جلسة منفصلة
  RS.init = function (app) { APP = app; };
  function sKey() { return "rased_session_" + APP + (RS.isDemo() ? "_demo" : ""); }
  function cKey(u) { return "rased_cache_" + (RS.isDemo() ? "demo_" : "") + u; }
  var OKEY = function () { return "rased_outbox" + (RS.isDemo() ? "_demo" : ""); };

  RS.session = function () { return RS.get(sKey(), null); };
  RS.logout = function () { RS.del(sKey()); };

  /* دخول: أونلاين من الشيت، ولو مفيش نت يقبل الدخول لو نفس الجهاز دخل قبل كده */
  RS.login = function (u, p, allowedRoles) {
    u = String(u || "").trim(); p = String(p || "").trim();
    var credK = "rased_cred_" + (RS.isDemo() ? "demo_" : "") + u.toLowerCase();
    function accept(res, offline) {
      if (allowedRoles.indexOf(res.user.role) === -1)
        return { ok: false, error: allowedRoles[0] === "admin" ? "الحساب ده مش حساب إدارة — ادخل من تطبيق الرائد" : "الحساب ده حساب إدارة — ادخل من لوحة الإدارة" };
      var s = { u: res.user.username, token: res.token, user: res.user, offline: !!offline };
      RS.set(sKey(), s);
      return { ok: true, session: s };
    }
    return RS.call("login", { u: u, p: p }).then(function (res) {
      if (!res.ok) return res;
      RS.set(credK, { h: RS.hash(u.toLowerCase() + "|" + p), token: res.token, user: res.user });
      // تحديث الغياب المحفوظ على الجهاز بالجلسة الجديدة (لو كلمة السر اتغيرت)
      RS.set(OKEY(), RS.outbox().map(function (x) {
        if (String(x.u).toLowerCase() === res.user.username.toLowerCase()) { x.u = res.user.username; x.token = res.token; }
        return x;
      }));
      return accept(res);
    }, function () {
      var c = RS.get(credK, null);
      if (c && c.h === RS.hash(u.toLowerCase() + "|" + p)) return accept({ token: c.token, user: c.user }, true);
      return { ok: false, error: "مفيش اتصال بالنت — أول دخول لازم يكون والنت شغال" };
    });
  };

  RS.cached = function (s) { return RS.get(cKey(s.u), null); };

  /* تحميل البيانات: يرجّع الكاش فورًا لو موجود، ويحدّث من الشيت لو في نت */
  RS.fetchData = function (s) {
    return RS.call("data", { u: s.u, token: s.token }).then(function (res) {
      if (!res.ok) { if (res.auth) { RS.logout(); } throw new Error(res.error || "خطأ"); }
      res.fetchedAt = new Date().toISOString();
      RS.set(cKey(s.u), res);
      return res;
    });
  };

  RS.outbox = function () { return RS.get(OKEY(), []); };
  RS.queueSave = function (s, rec) {
    var q = RS.outbox().filter(function (x) { return !(x.date === rec.date && +x.classId === +rec.classId); });
    q.push({ u: s.u, token: s.token, date: rec.date, classId: +rec.classId, absent: rec.absent, by: s.u, at: new Date().toISOString() });
    RS.set(OKEY(), q);
    return RS.flush();
  };
  var flushing = null;
  RS.flush = function () {
    if (flushing) return flushing;
    var q = RS.outbox();
    if (!q.length) return Promise.resolve({ sent: 0, left: 0 });
    var sent = 0, failed = [];
    function drop(item) {   // اللي اتبعت أو اترفض من السيرفر يتشال من الطابور
      RS.set(OKEY(), RS.outbox().filter(function (x) { return !(x.at === item.at && x.date === item.date && +x.classId === +item.classId); }));
    }
    flushing = q.reduce(function (p, item) {
      return p.then(function () {
        return RS.call("save", item).then(function (res) {
          if (res.auth) { failed.push("لازم تدخل تاني عشان يتبعت الغياب المحفوظ"); throw "auth"; } // يفضل محفوظ
          if (res.ok) sent++; else failed.push(item.date + ": " + (res.error || "مرفوض"));
          drop(item);
        }); // لو النت فصل: الـ Promise بيقف هنا واللي فاضل يفضل في الطابور
      });
    }, Promise.resolve()).catch(function () {}).then(function () {
      flushing = null;
      return { sent: sent, left: RS.outbox().length, failed: failed };
    });
    return flushing;
  };

  /* دمج الحاجات اللي لسه متبعتتش مع البيانات عشان تبان على طول */
  RS.merged = function (data) {
    var att = (data.attendance || []).slice(), q = RS.outbox();
    q.forEach(function (x) {
      att = att.filter(function (r) { return !(r.date === x.date && +r.classId === +x.classId); });
      att.push({ date: x.date, classId: +x.classId, absent: x.absent, by: x.by, at: x.at, pending: true });
    });
    return att;
  };

  /* مؤشر الاتصال */
  RS.netBadge = function (el) {
    function draw() {
      var q = RS.outbox().length, on = navigator.onLine;
      el.className = "net " + (on ? (q ? "wait" : "on") : "off");
      el.innerHTML = '<i></i>' + (RS.isDemo() ? "وضع تجريبي" : on ? (q ? "في انتظار الإرسال (" + q + ")" : "متصل بالشيت") : "بدون نت" + (q ? " — " + q + " في الانتظار" : ""));
      el.title = el.textContent;
    }
    draw();
    window.addEventListener("online", draw); window.addEventListener("offline", draw);
    return draw;
  };

  /* تشغيل بدون نت لما الموقع يكون مرفوع على الإنترنت (https) */
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }
})();

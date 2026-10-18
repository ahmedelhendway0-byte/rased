/* =====================================================================
   راصد — ملف الإعدادات (ده الملف الوحيد اللي محتاج تعدّل فيه)
   ===================================================================== */
var CONFIG = {

  /* 1) رابط Google Apps Script بعد ما تعمله Deploy كـ Web app.
        سيبه فاضي "" = وضع تجريبي (Demo) بيشتغل من غير شيت ومن غير نت. */
  API_URL: "https://script.google.com/macros/s/AKfycby4A2buoUzjCddnmKHoNKb8Dnmj4X6qBhofb5k6ZsM0dMNijf_H1zbl3DcLUFKAuSyM/exec",

  /* 2) اسم المدرسة اللي بيظهر تحت اللوجو */
  SCHOOL_NAME: "مدرسة الشهيد الرائد محمد سيد أبو شقرة",

  /* 3) بداية الترم (بيتحسب منها إجمالي أيام الغياب) */
  TERM_START: "2026-09-01",

  /* 4) أيام الإجازة الأسبوعية (0=الأحد ... 5=الجمعة، 6=السبت) */
  WEEKEND: [5, 6],

  /* 5) الإجازات الرسمية (مش بتتحسب أيام دراسة) */
  HOLIDAYS: ["2026-10-06"],

  /* 6) حدود التنبيه */
  WARN_DAYS: 15,   // يظهر في قائمة "غاب 15 يوم فأكثر" داخل كل فصل
  DROP_DAYS: 30,   // يظهر في قائمة "غاب أكثر من 30 يوم" في لوحة الإدارة

  /* 7) كل كام دقيقة الإدارة تحدّث البيانات من الشيت تلقائيًا */
  REFRESH_MINUTES: 2,

  /* ---------------- بيانات الوضع التجريبي فقط ----------------
     (لما تحط API_URL، المستخدمين والأسماء بيتقروا من الشيت مش من هنا) */
  DEMO_CLASSES: [
    { id: 1, name: "أولى أول" },
    { id: 2, name: "أولى ثاني" },
    { id: 3, name: "أولى ثالث" },
    { id: 4, name: "أولى رابع" },
    { id: 5, name: "أولى خامس" },
    { id: 6, name: "أولى سادس" },
    { id: 7, name: "أولى سابع" }
  ],
  DEMO_STUDENTS_PER_CLASS: 40,
  DEMO_USERS: [
    { username: "admin", password: "9999", role: "admin", classId: "",  name: "مدير المدرسة" },
    { username: "raed1", password: "1111", role: "raed",  classId: 1,   name: "رائد أولى أول" },
    { username: "raed2", password: "2222", role: "raed",  classId: 2,   name: "رائد أولى ثاني" },
    { username: "raed3", password: "3333", role: "raed",  classId: 3,   name: "رائد أولى ثالث" },
    { username: "raed4", password: "4444", role: "raed",  classId: 4,   name: "رائد أولى رابع" },
    { username: "raed5", password: "5555", role: "raed",  classId: 5,   name: "رائد أولى خامس" },
    { username: "raed6", password: "6666", role: "raed",  classId: 6,   name: "رائد أولى سادس" },
    { username: "raed7", password: "7777", role: "raed",  classId: 7,   name: "رائد أولى سابع" }
  ],
  /* في الديمو: الفصول دي تبان إنها سجّلت النهارده، والباقي لأ */
  DEMO_RECORDED_TODAY: [1, 2, 3, 4]
};

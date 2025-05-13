document.addEventListener("DOMContentLoaded", () => {
  async function fetchCSV(url) {
    const response = await fetch(url);
    const text = await response.text();
    return text.trim().split("\n").map(row => row.split(","));
  }

  // الفرضيات - المبالغ
  fetchCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vRmMnmmhI7jVWYbapuyF3Xo3e26H6WevpavU3DIxpZw4zvd-F0gxOsE7QZYuknZ2Uf3IYI6Nx0noo4a/pub?gid=0&single=true&output=csv")
    .then(data => {
      const headers = data[0];
      const items = [...new Set(data.slice(1).map(row => row[0]))];
      const itemSelect = document.getElementById("itemFilter1");

      items.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item;
        opt.textContent = item;
        itemSelect.appendChild(opt);
      });

      itemSelect.addEventListener("change", () => renderAmountChart(data, itemSelect.value));
      renderAmountChart(data, items[0]);
    });

  function renderAmountChart(data, selectedItem) {
    const filtered = data.slice(1).filter(row => row[0] === selectedItem);
    const labels = filtered.map(row => row[2]); // السنوات
    const values = filtered.map(row => parseFloat(row[1]));
    const notes = filtered.map(row => row[3]).filter(note => note).join("<br>");

    const ctx = document.getElementById("amountChart").getContext("2d");
    if (window.amountChart) window.amountChart.destroy();

    window.amountChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "المبلغ بالريال",
          data: values,
          backgroundColor: "#d4af37"
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });

    document.getElementById("notesBox").innerHTML = `<strong>ملاحظات:</strong><br>${notes}`;
  }

  // الفرضيات - النسب
  fetchCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vTP7u1WMbj-WX00aIsOUEI8Pjr_eWhWNyj_L3tWgr3urhjCHXkmJU_-YGEjNnB32IxqK0lUA3rzlXkh/pub?gid=0&single=true&output=csv")
    .then(data => {
      const hypoSelect = document.getElementById("hypoFilter");
      const options = [...new Set(data.slice(1).map(row => row[0]))];
      options.forEach(opt => {
        const o = document.createElement("option");
        o.value = opt;
        o.textContent = opt;
        hypoSelect.appendChild(o);
      });

      hypoSelect.addEventListener("change", () => renderPercentageChart(data, hypoSelect.value));
      renderPercentageChart(data, options[0]);
    });

  function renderPercentageChart(data, selectedHypo) {
    const filtered = data.slice(1).filter(row => row[0] === selectedHypo);
    const labels = filtered.map(row => row[1]);
    const values = filtered.map(row => parseFloat(row[2]));
    const indicator = filtered[0][3];

    const ctx = document.getElementById("percentageChart").getContext("2d");
    if (window.percentageChart) window.percentageChart.destroy();

    window.percentageChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels,
        datasets: [{
          label: "النسب",
          data: values,
          backgroundColor: ["#d4af37", "#8b4513", "#fffacd", "#000000"]
        }]
      },
      options: {
        responsive: true
      }
    });

    document.getElementById("indicatorBox").innerHTML = `<strong>المؤشر:</strong> ${indicator}`;
  }

  // الأجزاء الأخرى بنفس النمط...

  // ملاحظة: يمكنك نسخ نفس الأسلوب أعلاه لتكملة بقية الأجزاء:
  // - تحليل الحساسية (رسمتين مع فلتر المتغير)
  // - الإيرادات (فلتر الخدمة/البند مع بطاقات حسب السنوات)
  // - الخدمات (جدول مباشر)
  // - الملخص (فلتر البند مع 5 بطاقات)
});

document.addEventListener('DOMContentLoaded', () => {
  // جلب البيانات من Google Sheets
  function fetchData(url) {
    return fetch(url)
      .then(response => response.text())
      .then(data => {
        return data.split('\n').map(row => row.split(','));
      });
  }

  // تحميل البيانات الخاصة بالفرضيات - المبالغ
  fetchData('https://docs.google.com/spreadsheets/d/e/2PACX-1vRmMnmmhI7jVWYbapuyF3Xo3e26H6WevpavU3DIxpZw4zvd-F0gxOsE7QZYuknZ2Uf3IYI6Nx0noo4a/pub?gid=0&single=true&output=csv')
    .then(data => {
      const amounts = data.slice(1).map(row => parseFloat(row[1])); // استخراج المبالغ
      const labels = data.slice(1).map(row => row[0]); // استخراج الأعمدة

      // رسم الرسم البياني للمبالغ
      const ctx = document.getElementById('amountChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'المبالغ بالريال',
            data: amounts,
            backgroundColor: '#d4af37' // ذهبي
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    });

  // تحميل البيانات الخاصة بالفرضيات - النسب
  fetchData('https://docs.google.com/spreadsheets/d/e/2PACX-1vTP7u1WMbj-WX00aIsOUEI8Pjr_eWhWNyj_L3tWgr3urhjCHXkmJU_-YGEjNnB32IxqK0lUA3rzlXkh/pub?gid=0&single=true&output=csv')
    .then(data => {
      const percentages = data.slice(1).map(row => parseFloat(row[1])); // استخراج النسب
      const labels = data.slice(1).map(row => row[0]); // استخراج الأعمدة

      // رسم الرسم البياني للنسب
      const ctx = document.getElementById('percentageChart').getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            label: 'النسب',
            data: percentages,
            backgroundColor: ['#d4af37', '#8b4513', '#fffacd', '#000000'] // ألوان متنوعة
          }]
        },
        options: {
          responsive: true
        }
      });
    });

  // تحميل البيانات الخاصة بتحليل الحساسية
  fetchData('https://docs.google.com/spreadsheets/d/e/2PACX-1vQGJROV2LEBaLk9rY9oiKlHK9TFTKAGXcsue_FHbYXbtTXfjzb2K6KdcnKA6v5Umi4yYNzTwaZDZava/pub?gid=0&single=true&output=csv')
    .then(data => {
      const variables = data.slice(1).map(row => row[0]); // استخراج المتغيرات
      const changes = data.slice(1).map(row => parseFloat(row[1])); // استخراج التغييرات
      const netIncome = data.slice(1).map(row => parseFloat(row[2])); // استخراج الدخل الصافي

      // رسم الرسم البياني لتغيير النسب
      const ctx = document.getElementById('changeChart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: variables,
          datasets: [{
            label: 'نسبة التغيير',
            data: changes,
            borderColor: '#8b4513',
            fill: false
          }]
        },
        options: {
          responsive: true
        }
      });

      // رسم الرسم البياني للدخل الصافي
      const ctx2 = document.getElementById('netIncomeChart').getContext('2d');
      new Chart(ctx2, {
        type: 'line',
        data: {
          labels: variables,
          datasets: [{
            label: 'صافي الدخل',
            data: netIncome,
            borderColor: '#d4af37',
            fill: false
          }]
        },
        options: {
          responsive: true
        }
      });
    });

  // يمكنك إضافة أكواد مشابهة لبقية الأجزاء التي تحتاج إلى بيانات وجداول رسومية هنا.
});

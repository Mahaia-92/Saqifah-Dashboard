document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('nav button');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      contents.forEach(content => content.classList.remove('active'));
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });

  // مثال لجلب البيانات من Google Sheets
  fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSbsVGBOpP_maGsFfmRt0AgM-9lfTbgG8cqcSescke0Il8PQ6A8JRAYX9xNFCWNHo7Q28a8gGsG4sES/pub?output=csv')
    .then(response => response.text())
    .then(data => {
      // تحويل CSV إلى مصفوفة
      const rows = data.split('\n').map(row => row.split(','));
      // معالجة البيانات حسب الحاجة
      console.log(rows);
    });
});
const ctx = document.getElementById('revenueChart').getContext('2d');
const revenueChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{
      label: 'الإيرادات',
      data: [5000, 7000, 8000, 6000],
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
const priceSlider = document.getElementById('subscriptionPrice');
const priceValue = document.getElementById('priceValue');

priceSlider.addEventListener('input', () => {
  priceValue.textContent = priceSlider.value;
  // تحديث البيانات والرسوم البيانية بناءً على القيمة الجديدة
});


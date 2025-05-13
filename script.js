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

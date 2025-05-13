document.addEventListener('DOMContentLoaded', () => {
  loadAssumptionsAmount();
  loadAssumptionsPercentage();
  loadSensitivityAnalysis();
  loadRevenuesByService();
  loadRevenuesByItem();
  loadServicesTable();
  loadSummary();
});

function loadAssumptionsAmount() {
  const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRmMnmmhI7jVWYbapuyF3Xo3e26H6WevpavU3DIxpZw4zvd-F0gxOsE7QZYuknZ2Uf3IYI6Nx0noo4a/pub?gid=0&single=true&output=csv';
  fetch(csvUrl)
    .then(response => response.text())
    .then(csvText => {
      const rows = csvText.split('\n').map(row => row.split(','));
      const headers = rows[0];
      const بندIndex = headers.indexOf("البند");
      const مبلغIndex = headers.indexOf("المبلغ بالريال");
      const ملاحظاتIndex = headers.indexOf("ملاحظات");
      const سنةIndex = headers.indexOf("السنة");

      const yearSet = new Set();
      const itemSet = new Set();
      const dataByItem = {};

      rows.slice(1).forEach(row => {
        const بند = row[بندIndex];
        const مبلغ = parseFloat(row[مبلغIndex]);
        const ملاحظة = row[ملاحظاتIndex];
        const سنة = row[سنةIndex];

        if (!بند || isNaN(مبلغ)) return;

        yearSet.add(سنة);
        itemSet.add(بند);

        if (!dataByItem[بند]) {
          dataByItem[بند] = { مبالغ: [], ملاحظات: [] };
        }

        dataByItem[بند].مبالغ.push({ مبلغ, سنة });
        if (ملاحظة && !dataByItem[بند].ملاحظات.includes(ملاحظة)) {
          dataByItem[بند].ملاحظات.push(ملاحظة);
        }
      });

      const yearFilter = document.getElementById('yearFilter');
      yearSet.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
      });

      const itemFilter1 = document.getElementById('itemFilter1');
      itemSet.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        itemFilter1.appendChild(option);
      });

      let chartInstance = null;

      function renderChart(item, year) {
        const ctx = document.getElementById('amountChart').getContext('2d');
        const filtered = dataByItem[item].مبالغ.filter(d => d.سنة === year);

        const labels = filtered.map((_, idx) => `بند ${idx + 1}`);
        const values = filtered.map(d => d.مبلغ);

        if (chartInstance) chartInstance.destroy();

        chartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'المبلغ بالريال',
              data: values,
              backgroundColor: '#d4af37'
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: { beginAtZero: true }
            }
          }
        });

        document.getElementById('notesBox').innerText = dataByItem[item].ملاحظات.join('\n');
      }

      itemFilter1.addEventListener('change', () => {
        const selectedItem = itemFilter1.value;
        const selectedYear = yearFilter.value;
        renderChart(selectedItem, selectedYear);
      });

      yearFilter.addEventListener('change', () => {
        const selectedItem = itemFilter1.value;
        const selectedYear = yearFilter.value;
        renderChart(selectedItem, selectedYear);
      });

      // عرض أول رسم افتراضياً
      const firstItem = itemFilter1.value;
      const firstYear = yearFilter.value;
      if (firstItem && firstYear) {
        renderChart(firstItem, firstYear);
      }
    });
}

function loadAssumptionsPercentage() {
  const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTP7u1WMbj-WX00aIsOUEI8Pjr_eWhWNyj_L3tWgr3urhjCHXkmJU_-YGEjNnB32IxqK0lUA3rzlXkh/pub?gid=0&single=true&output=csv';
  fetch(csvUrl)
    .then(response => response.text())
    .then(csvText => {
      const rows = csvText.split('\n').map(row => row.split(','));
      const headers = rows[0];
      const فرضيةIndex = headers.indexOf("الفرضية");
      const نسبةIndex = headers.indexOf("النسبة");
      const سنةIndex = headers.indexOf("السنة");

      const yearSet = new Set();
      const assumptionSet = new Set();
      const dataByAssumption = {};

      rows.slice(1).forEach(row => {
        const فرضية = row[فرضيةIndex];
        const نسبة = parseFloat(row[نسبةIndex]);
        const سنة = row[سنةIndex];

        if (!فرضية || isNaN(نسبة)) return;

        yearSet.add(سنة);
        assumptionSet.add(فرضية);

        if (!dataByAssumption[فرضية]) {
          dataByAssumption[فرضية] = { نسب: [] };
        }

        dataByAssumption[فرضية].نسب.push({ نسبة, سنة });
      });

      const yearFilter = document.getElementById('yearFilter');
      yearSet.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
      });

      const hypoFilter = document.getElementById('hypoFilter');
      assumptionSet.forEach(assumption => {
        const option = document.createElement('option');
        option.value = assumption;
        option.textContent = assumption;
        hypoFilter.appendChild(option);
      });

      let chartInstance = null;

      function renderChart(assumption, year) {
        const ctx = document.getElementById('percentageChart').getContext('2d');
        const filtered = dataByAssumption[assumption].نسب.filter(d => d.سنة === year);

        const labels = filtered.map((_, idx) => `فرضية ${idx + 1}`);
        const values = filtered.map(d => d.نسبة);

        if (chartInstance) chartInstance.destroy();

        chartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'النسبة',
              data: values,
              backgroundColor: '#d4af37',
              borderColor: '#d4af37',
              fill: false
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: { beginAtZero: true }
            }
          }
        });

        document.getElementById('indicatorBox').innerText = `النسبة الحالية: ${values[values.length - 1]}`;
      }

      hypoFilter.addEventListener('change', () => {
        const selectedAssumption = hypoFilter.value;
        const selectedYear = yearFilter.value;
        renderChart(selectedAssumption, selectedYear);
      });

      yearFilter.addEventListener('change', () => {
        const selectedAssumption = hypoFilter.value;
        const selectedYear = yearFilter.value;
        renderChart(selectedAssumption, selectedYear);
      });

     

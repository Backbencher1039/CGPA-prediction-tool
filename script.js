function lagrangeInterpolation(x, y, xp) {
  let n = x.length;
  let yp = 0;

  for (let i = 0; i < n; i++) {
    let term = y[i];

    for (let j = 0; j < n; j++) {
      if (j != i) {
        term = (term * (xp - x[j])) / (x[i] - x[j]);
      }
    }

    yp = yp + term;
  }

  return yp;
}
function predictCGPA() {
  let table = document.getElementById("cgpaTable");

  let x = [];
  let y = [];

  for (let i = 1; i < table.rows.length; i++) {
    let semester = parseFloat(table.rows[i].cells[0].children[0].value);
    let cgpa = parseFloat(table.rows[i].cells[1].children[0].value);

    if (!isNaN(semester) && !isNaN(cgpa)) {
      x.push(semester);
      y.push(cgpa);
    }
  }

  let xp = parseFloat(document.getElementById("predictX").value);

  let predicted = lagrangeInterpolation(x, y, xp);

  document.getElementById("result").innerHTML =
    "Predicted CGPA = " + predicted.toFixed(3);
  let mae = calculateConfidence(x, y);

  let conf = getConfidenceLevel(mae);

  document.getElementById("confidence").innerHTML =
    "Prediction Confidence: " +
    conf.confidence +
    " (" +
    conf.percentage.toFixed(1) +
    "%)";

  drawGraph(x, y, xp, predicted);
}
let chart;

function drawGraph(x, y, xp, yp) {
  let labels = [...x, xp];
  let values = [...y, yp];

  if (chart) {
    chart.destroy();
  }

  let ctx = document.getElementById("cgpaChart").getContext("2d");

  chart = new Chart(ctx, {
    type: "line",

    data: {
      labels: labels,

      datasets: [
        {
          label: "CGPA Trend",
          data: values,
          fill: false,
          borderColor: "blue",
          tension: 0.1,
        },
      ],
    },

    options: {
      scales: {
        y: {
          min: 0,
          max: 4,
        },
      },
    },
  });
}

/*this is add semester button section */
function addRow() {
  let table = document.getElementById("cgpaTable");

  let rowCount = table.rows.length;

  let row = table.insertRow();

  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);

  cell1.innerHTML = `<input type="number" value="${rowCount}">`;
  cell2.innerHTML = `<input type="number" step="0.01">`;
}

/*Confidence Calculation Function */
function calculateConfidence(x, y) {
  let n = x.length;
  let totalError = 0;

  for (let i = 0; i < n; i++) {
    let x_temp = [];
    let y_temp = [];

    // remove current point
    for (let j = 0; j < n; j++) {
      if (j !== i) {
        x_temp.push(x[j]);
        y_temp.push(y[j]);
      }
    }

    // predict the removed point
    let predicted = lagrangeInterpolation(x_temp, y_temp, x[i]);

    let error = Math.abs(predicted - y[i]);

    totalError += error;
  }

  let mae = totalError / n;

  return mae;
}
/*Convert Error into Confidence Level */
function getConfidenceLevel(mae) {
  let confidence;
  let percentage;

  percentage = Math.max(0, 100 - mae * 100);

  if (percentage > 85) {
    confidence = "High";
  } else if (percentage > 60) {
    confidence = "Medium";
  } else {
    confidence = "Low";
  }

  return { confidence, percentage };
}

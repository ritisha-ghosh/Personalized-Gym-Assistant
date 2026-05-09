import { jsPDF } from "jspdf";
import 'jspdf-autotable';

/**
 * PDF and Data Export Utilities
 */

// New PDF generation function using jsPDF and jsPDF-AutoTable
export const generateProgressionReportPDF = (userProfile, stats, weightData, workoutLogs) => {
  const doc = new jsPDF();

  // 1. Header
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Progression Report", 105, 20, { align: "center" });
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`User: ${userProfile?.name || 'N/A'}`, 14, 30);
  doc.text(`Goal: ${userProfile?.goal ? userProfile.goal.charAt(0).toUpperCase() + userProfile.goal.slice(1) : 'N/A'}`, 14, 36);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 196, 30, { align: "right" });

  // 2. Workout Consistency Stats
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Workout Summary", 14, 50);
  
  const summaryData = [
    ["Total Workouts (Last Year)", stats.totalWorkouts],
    ["Current Streak", stats.currentStreak],
    ["Longest Streak", stats.longestStreak],
    ["Consistency", stats.consistency],
  ];

  doc.autoTable({
    startY: 55,
    head: [['Metric', 'Value']],
    body: summaryData,
    theme: 'striped',
    headStyles: { fillColor: [0, 196, 180] }, // Teal color to match theme
  });

  // 3. Weight Progression Table
  let finalY = doc.lastAutoTable.finalY || 55;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Weight Progression", 14, finalY + 15);

  const weightTableBody = weightData.map(d => [d.month, `${d.weight.toFixed(1)} kg`]);
  
  doc.autoTable({
    startY: finalY + 20,
    head: [['Month', 'Weight']],
    body: weightTableBody,
    theme: 'grid',
  });

  // 4. Recent Workout Logs Table
  finalY = doc.lastAutoTable.finalY;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Recent Workout Logs", 14, finalY + 15);

  // Take the most recent 15 logs for the PDF
  const logTableBody = workoutLogs.slice(0, 15).map(log => {
    const date = new Date(log.date || log.createdAt).toLocaleDateString();
    return [
        date,
        log.status || 'Completed',
        log.difficultyRating || 'N/A',
        log.notes || 'No notes.'
    ];
  });

  doc.autoTable({
    startY: finalY + 20,
    head: [['Date', 'Status', 'Difficulty (1-10)', 'Notes']],
    body: logTableBody,
    theme: 'striped',
    headStyles: { fillColor: [0, 196, 180] },
  });

  // 5. Save the PDF
  doc.save(`Progression_Report_${userProfile?.name?.replace(' ', '_') || 'user'}_${Date.now()}.pdf`);
};

// Helper function to download blobs
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

// Generate CSV from array of objects
export const downloadAsCSV = (data, filename) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(field => JSON.stringify(row[field])).join(','))
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  downloadFile(blob, filename);
};

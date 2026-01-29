/**
 * PDF Export Utilities
 * Generates and exports data as PDF files
 */

export const generateProgressionPDF = (data, userName = "User") => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 800;
  canvas.height = 600;
  
  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Header
  ctx.fillStyle = '#df20af';
  ctx.fillRect(0, 0, canvas.width, 80);
  
  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px Arial';
  ctx.fillText('Progression Report', 40, 50);
  
  // User Info
  ctx.fillStyle = '#000000';
  ctx.font = '14px Arial';
  ctx.fillText(`User: ${userName}`, 40, 120);
  ctx.fillText(`Generated: ${new Date().toLocaleDateString()}`, 40, 145);
  
  // Data summary
  ctx.font = 'bold 16px Arial';
  ctx.fillText('Weight Progress:', 40, 190);
  
  ctx.font = '14px Arial';
  if (data && data.length > 0) {
    data.forEach((item, index) => {
      ctx.fillText(`${item.month}: ${item.weight}kg`, 60, 220 + index * 25);
    });
  }
  
  // Convert canvas to image and download
  canvas.toBlob((blob) => {
    downloadFile(blob, `progression_report_${Date.now()}.png`);
  });
};

export const generateWorkoutPDF = (workouts, userName = "User") => {
  let content = `WORKOUT REPORT\n`;
  content += `User: ${userName}\n`;
  content += `Generated: ${new Date().toLocaleDateString()}\n`;
  content += `===================================\n\n`;
  
  workouts.forEach((workout, index) => {
    content += `Workout ${index + 1}:\n`;
    content += `Date: ${new Date(workout.createdAt).toLocaleDateString()}\n`;
    content += `Exercise: ${workout.exercise || 'N/A'}\n`;
    content += `Duration: ${workout.duration || 'N/A'}\n`;
    content += `Sets/Reps: ${workout.sets || 'N/A'}\n`;
    content += `-----------------------------------\n\n`;
  });
  
  const blob = new Blob([content], { type: 'text/plain' });
  downloadFile(blob, `workouts_report_${Date.now()}.txt`);
};

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

// Generate JSON export
export const downloadAsJSON = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadFile(blob, filename);
};

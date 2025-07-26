// Notification functionality
function sendNotification() {
    // Make an AJAX request to the Lambda function URL with proper error handling
    $.ajax({
        url: CONFIG.NOTIFICATION_URL,
        type: 'POST',
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json'
        },
        success: function () {
            // Don't log sensitive information
            console.log('Notification sent');
        },
        error: function () {
            // Don't log detailed error information
            console.log('Notification failed');
        }
    });
}

// Add event listener for download CV button
document.addEventListener('DOMContentLoaded', function () {
    const downloadButton = document.getElementById('download-cv');
    if (downloadButton) {
        downloadButton.addEventListener('click', function () {
            sendNotification();
            return true;
        });
    }
});
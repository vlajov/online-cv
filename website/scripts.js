// Used on the CV to make the employment history interactive (each job is clickable)
document.addEventListener('DOMContentLoaded', function () {
    // Select all timeline entries
    const entries = document.querySelectorAll('#timeline .entry');

    entries.forEach(entry => {
        const header = entry.querySelector('.entry-header');
        const content = entry.querySelector('.job-details');

        // Ensure content is initially hidden with proper styling
        content.style.display = 'none';
        content.style.opacity = '0';
        content.style.maxHeight = '0';

        // Event listener to toggle content visibility
        header.addEventListener('click', function () {
            // Check if the clicked header's content is currently shown
            const isContentShown = entry.classList.contains('active');

            // Hide all open contents and remove active class
            document.querySelectorAll('.job-details').forEach(el => {
                el.style.display = 'none';
            });
            document.querySelectorAll('.entry').forEach(el => {
                el.classList.remove('active');
            });

            if (!isContentShown) {
                // If it was not shown before, display it with animation
                content.style.display = 'block';
                
                // Use requestAnimationFrame to schedule the animation
                requestAnimationFrame(() => {
                    entry.classList.add('active');
                    content.style.opacity = '1';
                    content.style.maxHeight = '1000px';
                });
            }

        });
    });
    
    // If URL has a hash for a specific job, open it
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetEntry = document.getElementById(targetId);
        if (targetEntry && targetEntry.classList.contains('entry')) {
            targetEntry.querySelector('.entry-header').click();
        }
    }
});
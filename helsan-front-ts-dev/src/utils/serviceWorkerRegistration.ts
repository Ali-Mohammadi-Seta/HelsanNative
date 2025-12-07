// Check if the browser supports service workers
if ('serviceWorker' in navigator) {
    // Add an event listener for the 'load' event of the window
    window.addEventListener('load', () => {
        // Register the service worker with the given path and type
        navigator.serviceWorker
            .register('/service-worker.js', { type: 'module' }) // Register service worker as a module
            .then((registration) => {
                // Log a success message if the registration is successful
                console.log(
                    'ServiceWorker registration successful with scope: ',
                    registration.scope,
                );
            })
            .catch((error) => {
                // Log an error message if the registration fails
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}

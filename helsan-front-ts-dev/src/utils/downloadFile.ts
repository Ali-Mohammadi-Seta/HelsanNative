// import endpoints from '@/services/endpoints';

// export const downloadFile = (data) => {
//     fetch(`${import.meta.env.VITE_API_URL}${endpoints.downloadFile(data)}`)
//         .then((response) => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.blob(); // Convert the response to a Blob
//         })
//         .then((blob) => {
//             // Create a temporary URL for the Blob
//             const url = window.URL.createObjectURL(blob);
//             // Create an anchor element to trigger the download
//             const a = document.createElement('a');
//             a.href = url;
//             a.download = data; // Set the desired file name
//             a.style.display = 'none';
//             document.body.appendChild(a);
//             a.click();

//             // Clean up
//             window.URL.revokeObjectURL(url);
//             document.body.removeChild(a);
//         });
// };

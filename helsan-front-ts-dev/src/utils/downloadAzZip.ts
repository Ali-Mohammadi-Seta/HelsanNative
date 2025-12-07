// import config from '@/config/config';
// import endpoints from '@/services/endpoints';
// import { saveAs } from 'file-saver';
// import JSZip from 'jszip';
// import JSZipUtils from 'jszip-utils';

// const apiUrl = config.apiUrl;

// export const downloadAzZip = (URLs) => {
//     var zip = new JSZip();
//     var count = 0;
//     var zipFilename = 'attachments.zip';
//     URLs.forEach(function (url, index) {
//         var filename = `${url || `fileName${index}`}`;
//         // loading a file and add it in a zip file
//         JSZipUtils.getBinaryContent(
//             `${apiUrl}${endpoints.downloadFile(url)}`,
//             function (err, data) {
//                 if (err) {
//                     throw err; // or handle the error
//                 }
//                 zip.file(filename, data, { binary: true });

//                 count++;
//                 if (count === URLs.length) {
//                     zip.generateAsync({ type: 'blob' }).then(function (
//                         content,
//                     ) {
//                         saveAs(content, zipFilename);
//                     });
//                 }
//             },
//         );
//     });
// };

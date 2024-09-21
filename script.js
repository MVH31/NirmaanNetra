let imageDataURL = ''; // To store the uploaded image as a data URL

        // Function to preview images, handling TIFF files separately
        function previewImage() {
            const file = document.getElementById('fileUpload').files[0];
            const preview = document.getElementById('imagePreview');
            const previewContainer = document.getElementById('imagePreviewContainer');
            const reader = new FileReader();

            if (file) {
                const fileType = file.type;

                // Check if file is a TIFF
                if (fileType === 'image/tiff' || fileType === 'image/tif') {
                    reader.onload = function(e) {
                        const tiff = new Tiff({ buffer : e.target.result });
                        const nop = tiff.countDirectory();
                        previewContainer.innerHTML = '';
                        for(let i = 0; i < nop; i++) {
                            tiff.setDirectory(i);
                            const canvas = document.createElement('canvas');
                            canvas.width = tiff.width();
                            canvas.height = tiff.height();
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(tiff.toCanvas(), 0, 0);
                            previewContainer.appendChild(canvas);
                            imageDataURL = reader.result;
                        }
                    };

                    reader.readAsArrayBuffer(file);
                } else {
                    // For other image types, display the preview
                    reader.onloadend = function() {
                        preview.src = reader.result;
                        preview.style.display = 'block';
                        previewContainer.innerHTML = '';  // Clear any message
                        imageDataURL = reader.result; // Store image data for use in the new tab
                    }
                    reader.readAsDataURL(file);
                }
            } else {
                preview.src = '';
                preview.style.display = 'none';
            }
        }

        // Function to open a new tab with the uploaded image for Authorization or Regulation
        function openInNewTab(pageType) {
            if (imageDataURL) {
                const newTab = window.open('', '_blank');
                newTab.document.write(`
                    <html>
                    <head><title>${pageType.charAt(0).toUpperCase() + pageType.slice(1)} Page</title></head>
                    <body>
                    <h1>${pageType.charAt(0).toUpperCase() + pageType.slice(1)} Results</h1>
                    <img src="${imageDataURL}" alt="Uploaded Image" style="max-width:100%; max-height:100%; background-color : yellowgreen;">
                    <p>Processing the uploaded image...</p>
                    <!-- Add any other content or result of the ML algorithm -->
                    </body>
                    </html>
                `);
                newTab.document.close();
            } else {
                alert("Please upload an image first.");
            }
        }
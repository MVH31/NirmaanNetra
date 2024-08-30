function previewImage() {
    const file = document.getElementById('fileUpload').files[0];
    const preview = document.getElementById('imagePreview');

    const reader = new FileReader();
    reader.onloadend = function () {
        preview.src = reader.result;
        preview.style.display = 'block';
    }

    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.src = "";
        preview.style.display = 'none';
    }
}
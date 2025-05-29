// we will use cloudinary to upload images, and we will use the upload preset and cloud name from the environment variables, we wont use sigened upload for now.
export async function uploadFileToCloudinary(file) {
  const cloudName = import.meta.env.VITE_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET;
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

  const formData = new FormData();
  formData.append("upload_preset", uploadPreset);
  formData.append("file", file);

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.error) {
      throw new Error(data.error.message);
    }
    return data.secure_url;
  } catch (err) {
    throw new Error(`Uploading failed: ${err.message}`);
  }
}

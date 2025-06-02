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

    let data;
    try {
      data = await res.json();
    } catch {
      data = {};
    }
    console.log("Cloudinary response:", data);

    if (!res.ok) {
      // check Cloudinary's error message if available
      const message =
        data.error?.message || `HTTP error! status: ${res.status}`;
      throw new Error(message);
    }
    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.secure_url;
  } catch (err) {
    throw new Error(`Uploading failed: ${err.message}`);
  }
}

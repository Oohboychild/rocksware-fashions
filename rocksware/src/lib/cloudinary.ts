export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "rocksware_unsigned");
  formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) throw new Error("Image upload failed");
  const data = await res.json();
  return data.secure_url;
};

export const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
  const uploads = files.map((file) => uploadImage(file));
  return Promise.all(uploads);
};
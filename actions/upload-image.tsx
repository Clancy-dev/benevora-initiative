"use server";

export async function uploadToCloudinary(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "practice");

  const response = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_URL!, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return data.secure_url;
}
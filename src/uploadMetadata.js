import { ThirdwebStorage } from "@thirdweb-dev/storage";

// 👇 Điền đúng Client ID bạn tạo bên thirdweb.com
const storage = new ThirdwebStorage({ clientId: "f6c462687f5a1e4d7034667799793c69" });

export async function uploadMetadata(name, description, imageUrl) {
  const metadata = {
    name,
    description,
    image: imageUrl,
  };

  const uri = await storage.upload(metadata);
  console.log("Uploaded metadata URI:", uri);
  return uri; // Trả về dạng ipfs://...
}

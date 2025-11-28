export function formatMethodColor(method: string) {
  if (method === "GET") return "text-blue-600";
  if (method === "POST") return "text-green-600";
  if (method === "PUT") return "text-yellow-600";
  if (method === "DELETE") return "text-red-600";
  if (method === "PATCH") return "text-purple-600";
  if (method === "OPTIONS") return "text-gray-600";
  if (method === "HEAD") return "text-pink-600";
  return "text-gray-600";
}

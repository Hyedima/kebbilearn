import { Loader } from "lucide-react";

export default function LoadingSpinner({ color = "purple", size = 24 }) {
  return (
    <div className="flex items-center justify-center">
      <Loader className="animate-spin" color={color} size={size} />
    </div>
  );
}

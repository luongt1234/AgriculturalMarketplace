import { toast } from "sonner";
import { CheckCircle, XCircle, Info } from "lucide-react";

export const notify = {
    success: (msg: string) =>
        toast.success(msg, { icon: <CheckCircle className="w-5 h-5" /> }),

    error: (msg: string) =>
        toast.error(msg, { icon: <XCircle className="w-5 h-5" /> }),

    info: (msg: string) =>
        toast(msg, { icon: <Info className="w-5 h-5" /> }),
};

import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useOrderHub } from '../../../hooks/useOrderHub';
// import { useOrderHub } from '../../../hooks/useOrderHub';

interface MomoQrModalProps {
    donHangId: string;
    qrCodeUrl: string;
    payUrl: string;
    tongThanhToan: number;
    onSuccess: () => void;
    onClose: () => void;
}

export function MomoQrModal({ donHangId, qrCodeUrl, payUrl, tongThanhToan, onSuccess, onClose }: MomoQrModalProps) {
    const [countdown, setCountdown] = useState(300); // 5 phút
    const [expired, setExpired] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const { connection } = useOrderHub();

    // Countdown timer
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current!);
                    setExpired(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(intervalRef.current!);
    }, []);

    // Lắng nghe SignalR event MomoPaymentSuccess
    useEffect(() => {
        if (!connection) return;

        const handler = (data: { donHangId: string }) => {
            if (data.donHangId === donHangId) {
                clearInterval(intervalRef.current!);
                onSuccess();
            }
        };

        connection.on('MomoPaymentSuccess', handler);
        return () => { connection.off('MomoPaymentSuccess', handler); };
    }, [connection, donHangId, onSuccess]);

    const minutes = Math.floor(countdown / 60).toString().padStart(2, '0');
    const seconds = (countdown % 60).toString().padStart(2, '0');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-modal-in">
                {/* Header gradient MoMo */}
                <div className="bg-gradient-to-r from-[#ae2070] to-[#d63384] p-6 text-white text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
                        <span className="text-2xl font-black tracking-wide">MoMo</span>
                    </div>
                    <p className="text-pink-100 text-sm">Quét mã QR để thanh toán</p>
                </div>

                {/* Body */}
                <div className="p-6 text-center">
                    {expired ? (
                        <div className="py-8">
                            <span className="material-symbols-outlined text-5xl text-red-500 mb-3 block">timer_off</span>
                            <p className="text-red-600 font-bold text-lg">Mã QR đã hết hạn</p>
                            <p className="text-gray-500 text-sm mt-1">Vui lòng đặt lại đơn hàng</p>
                            <button
                                onClick={onClose}
                                className="mt-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Số tiền */}
                            <div className="mb-4">
                                <span className="text-3xl font-black text-[#ae2070]">
                                    {tongThanhToan.toLocaleString('vi-VN')}
                                </span>
                                <span className="text-lg font-bold text-[#ae2070]">đ</span>
                            </div>

                            {/* QR Code */}
                            <div className="inline-block p-4 bg-white rounded-2xl shadow-lg border-4 border-[#ae2070]/20 mb-4">
                                <QRCodeSVG
                                    value={qrCodeUrl}
                                    size={220}
                                    level="M"
                                    includeMargin={false}
                                    imageSettings={{
                                        src: '/momo-logo.png',
                                        height: 36,
                                        width: 36,
                                        excavate: true,
                                    }}
                                />
                            </div>

                            {/* Countdown */}
                            <div className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold mb-4 ${countdown < 60
                                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                : 'bg-pink-100 text-[#ae2070] dark:bg-pink-900/30 dark:text-pink-400'
                                }`}>
                                <span className="material-symbols-outlined text-base">timer</span>
                                Hết hạn sau: {minutes}:{seconds}
                            </div>

                            {/* Hướng dẫn */}
                            <div className="bg-pink-50 dark:bg-pink-900/10 rounded-xl p-4 text-left mb-4">
                                <p className="text-xs font-bold text-[#ae2070] mb-2 uppercase tracking-wide">Hướng dẫn thanh toán</p>
                                <ol className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                                    <li className="flex gap-2">
                                        <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[#ae2070] text-white text-xs flex items-center justify-center font-bold">1</span>
                                        Mở ứng dụng MoMo trên điện thoại
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[#ae2070] text-white text-xs flex items-center justify-center font-bold">2</span>
                                        Vào trang chủ → bấm <strong>Quét mã</strong>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[#ae2070] text-white text-xs flex items-center justify-center font-bold">3</span>
                                        Quét mã QR bên trên và xác nhận thanh toán
                                    </li>
                                </ol>
                            </div>

                            {/* Mở trang MoMo (web) */}
                            <a
                                href={payUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full bg-[#ae2070] hover:bg-[#9a1c63] text-white py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg text-sm mb-2"
                            >
                                <span className="material-symbols-outlined text-sm align-middle mr-1">open_in_new</span>
                                Thanh toán qua trang MoMo
                            </a>

                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 text-sm underline"
                            >
                                Hủy thanh toán
                            </button>
                        </>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes modal-in {
                    from { opacity: 0; transform: scale(0.92) translateY(12px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-modal-in { animation: modal-in 0.25s cubic-bezier(0.34,1.56,0.64,1) both; }
            `}</style>
        </div>
    );
}

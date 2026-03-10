import { useNavigate } from 'react-router-dom';

export const UnauthorizedPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 text-center">
                {/* Icon cảnh báo (có thể dùng Heroicons) */}
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-red-100 rounded-full">
                        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">403 - Từ chối truy cập</h1>
                <p className="text-gray-600 mb-8">
                    Xin lỗi, tài khoản của bạn không có quyền (Role) để xem trang này. Vui lòng kiểm tra lại hoặc quay về trang chủ.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => navigate(-1)} // Quay lại trang trước đó
                        className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                        Quay lại
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2.5 bg-green-600 rounded-lg text-white font-medium hover:bg-green-700 transition-colors"
                    >
                        Về trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
};
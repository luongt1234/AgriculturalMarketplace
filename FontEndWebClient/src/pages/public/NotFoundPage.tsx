import { useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#f8fafc] px-4">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-6">
                        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-red-100">
                            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-5xl font-bold text-gray-900 mb-2">404</h1>
                    <p className="text-xl font-semibold text-gray-700 mb-4">Không tìm thấy trang</p>
                    <p className="text-gray-500 mb-8">
                        Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
                        >
                            Quay lại
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                        >
                            Về trang chủ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
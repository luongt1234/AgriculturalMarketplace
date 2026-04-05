import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        Chính Sách Bảo Mật
                    </h1>

                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            <strong>Cập nhật lần cuối:</strong> Ngày 5 tháng 4 năm 2026
                        </p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                1. Giới Thiệu
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                PeachyMarket ("chúng tôi", "của chúng tôi") cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn.
                                Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, chia sẻ và bảo vệ thông tin của bạn
                                khi bạn sử dụng nền tảng PeachyMarket.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                2. Thông Tin Chúng Tôi Thu Thập
                            </h2>
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">2.1 Thông Tin Bạn Cung Cấp</h3>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 ml-4">
                                <li>Thông tin đăng ký tài khoản (tên, email, số điện thoại)</li>
                                <li>Thông tin hồ sơ (địa chỉ, thông tin ngân hàng)</li>
                                <li>Nội dung bạn đăng tải (mô tả sản phẩm, hình ảnh)</li>
                                <li>Thông tin liên hệ và giao tiếp với chúng tôi</li>
                            </ul>

                            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">2.2 Thông Tin Tự Động Thu Thập</h3>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 ml-4">
                                <li>Địa chỉ IP và thông tin thiết bị</li>
                                <li>Dữ liệu sử dụng ứng dụng và trang web</li>
                                <li>Cookies và công nghệ theo dõi tương tự</li>
                                <li>Vị trí địa lý (nếu được phép)</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                3. Cách Chúng Tôi Sử Dụng Thông Tin
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">Chúng tôi sử dụng thông tin của bạn để:</p>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 ml-4">
                                <li>Cung cấp và duy trì dịch vụ PeachyMarket</li>
                                <li>Xử lý giao dịch và thanh toán</li>
                                <li>Gửi thông báo về đơn hàng và tài khoản</li>
                                <li>Cải thiện trải nghiệm người dùng</li>
                                <li>Ngăn chặn gian lận và lạm dụng</li>
                                <li>Tuân thủ các yêu cầu pháp lý</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                4. Chia Sẻ Thông Tin
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Chúng tôi có thể chia sẻ thông tin của bạn trong các trường hợp sau:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 ml-4">
                                <li>Với sự đồng ý của bạn</li>
                                <li>Với các nhà cung cấp dịch vụ đáng tin cậy</li>
                                <li>Để tuân thủ pháp luật hoặc bảo vệ quyền lợi</li>
                                <li>Trong trường hợp sáp nhập hoặc bán doanh nghiệp</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                5. Bảo Mật Dữ Liệu
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức phù hợp để bảo vệ thông tin cá nhân của bạn,
                                bao gồm mã hóa dữ liệu, kiểm soát truy cập và giám sát bảo mật thường xuyên.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                6. Cookies và Công Nghệ Theo Dõi
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Chúng tôi sử dụng cookies và công nghệ tương tự để cải thiện trải nghiệm của bạn.
                                Bạn có thể quản lý cài đặt cookies thông qua trình duyệt của mình.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                7. Quyền Của Bạn
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">Bạn có quyền:</p>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 ml-4">
                                <li>Truy cập và cập nhật thông tin cá nhân</li>
                                <li>Yêu cầu xóa thông tin</li>
                                <li>Phản đối việc xử lý dữ liệu</li>
                                <li>Rút lại sự đồng ý</li>
                                <li>Khiếu nại với cơ quan có thẩm quyền</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                8. Thời Gian Lưu Trữ
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Chúng tôi lưu trữ thông tin cá nhân của bạn trong thời gian cần thiết để cung cấp dịch vụ
                                và tuân thủ các yêu cầu pháp lý, thường là trong thời gian tài khoản hoạt động
                                và 3 năm sau khi tài khoản ngừng hoạt động.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                9. Thay Đổi Chính Sách
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian.
                                Chúng tôi sẽ thông báo về các thay đổi quan trọng qua email hoặc thông báo trên nền tảng.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                10. Liên Hệ Chúng Tôi
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Nếu bạn có câu hỏi về chính sách bảo mật này, vui lòng liên hệ với chúng tôi:
                            </p>
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                <p className="text-gray-700 dark:text-gray-300">
                                    <strong>Email:</strong> privacy@peachymarket.vn<br />
                                    <strong>Điện thoại:</strong> 1900 XXX XXX<br />
                                    <strong>Địa chỉ:</strong> 123 Tân Mai, Quận Hoàng Mai, TP.Hà Nội
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
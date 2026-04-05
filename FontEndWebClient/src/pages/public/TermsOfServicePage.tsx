import React from 'react';

const TermsOfServicePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        Điều Khoản Dịch Vụ
                    </h1>

                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            <strong>Cập nhật lần cuối:</strong> Ngày 5 tháng 4 năm 2026
                        </p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                1. Chấp Nhận Điều Khoản
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Bằng việc truy cập và sử dụng nền tảng PeachyMarket ("Dịch vụ"), bạn đồng ý tuân thủ
                                và bị ràng buộc bởi các điều khoản dịch vụ này ("Điều khoản"). Nếu bạn không đồng ý
                                với bất kỳ điều khoản nào, vui lòng không sử dụng Dịch vụ.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                2. Mô Tả Dịch Vụ
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                PeachyMarket là nền tảng thương mại điện tử kết nối nông dân và người tiêu dùng,
                                cho phép người dùng mua bán các sản phẩm nông nghiệp. Dịch vụ bao gồm:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 ml-4">
                                <li>Nền tảng đăng bán sản phẩm nông nghiệp</li>
                                <li>Hệ thống tìm kiếm và duyệt sản phẩm</li>
                                <li>Quản lý đơn hàng và thanh toán</li>
                                <li>Hỗ trợ giao tiếp giữa người mua và người bán</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                3. Điều Kiện Sử Dụng
                            </h2>
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">3.1 Tư Cách Sử Dụng</h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Để sử dụng Dịch vụ, bạn phải:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 ml-4">
                                <li>Từ đủ 18 tuổi hoặc có sự đồng ý của phụ huynh</li>
                                <li>Cung cấp thông tin chính xác và cập nhật</li>
                                <li>Chịu trách nhiệm về hoạt động trên tài khoản của mình</li>
                                <li>Tuân thủ tất cả luật pháp và quy định hiện hành</li>
                            </ul>

                            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">3.2 Tài Khoản</h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Bạn chịu trách nhiệm duy trì bảo mật tài khoản và mật khẩu. Bạn phải thông báo ngay
                                cho chúng tôi về bất kỳ việc sử dụng trái phép tài khoản nào.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                4. Quyền và Nghĩa Vụ Người Dùng
                            </h2>
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">4.1 Quyền</h3>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 ml-4">
                                <li>Sử dụng Dịch vụ theo đúng mục đích</li>
                                <li>Truy cập thông tin và đặt hàng hợp pháp</li>
                                <li>Nhận hỗ trợ từ đội ngũ PeachyMarket</li>
                            </ul>

                            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">4.2 Nghĩa Vụ</h3>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 ml-4">
                                <li>Cung cấp thông tin chính xác</li>
                                <li>Tuân thủ quy định pháp luật</li>
                                <li>Không vi phạm quyền sở hữu trí tuệ</li>
                                <li>Không thực hiện hành vi gian lận hoặc lừa đảo</li>
                                <li>Thanh toán đúng hạn cho đơn hàng</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                5. Quyền Sở Hữu Trí Tuệ
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Dịch vụ và nội dung của chúng tôi được bảo vệ bởi quyền sở hữu trí tuệ.
                                Bạn không được sao chép, phân phối hoặc sử dụng nội dung mà không có sự cho phép bằng văn bản.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                6. Chính Sách Đăng Sản Phẩm
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Người bán phải đảm bảo:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 ml-4">
                                <li>Sản phẩm đúng mô tả và chất lượng</li>
                                <li>Giá cả hợp lý và minh bạch</li>
                                <li>Giao hàng đúng hẹn</li>
                                <li>Tuân thủ quy định về an toàn thực phẩm</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                7. Chính Sách Hoàn Trả và Khiếu Nại
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Chúng tôi hỗ trợ giải quyết khiếu nại trong vòng 48 giờ kể từ khi nhận được thông báo.
                                Chính sách hoàn trả áp dụng theo từng trường hợp cụ thể và tuân thủ pháp luật Việt Nam.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                8. Từ Chối Bảo Đảm
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Dịch vụ được cung cấp "như hiện tại" mà không có bất kỳ bảo đảm nào.
                                Chúng tôi không chịu trách nhiệm về thiệt hại gián tiếp, đặc biệt hoặc do hậu quả.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                9. Giới Hạn Trách Nhiệm
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Trách nhiệm của chúng tôi bị giới hạn ở mức phí dịch vụ mà bạn đã thanh toán
                                trong 3 tháng gần nhất. Chúng tôi không chịu trách nhiệm về mất mát dữ liệu
                                hoặc gián đoạn dịch vụ do sự kiện bất khả kháng.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                10. Chấm Dứt Dịch Vụ
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Chúng tôi có quyền tạm ngừng hoặc chấm dứt tài khoản của bạn nếu vi phạm
                                điều khoản này. Bạn có thể chấm dứt tài khoản bất cứ lúc nào.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                11. Luật Áp Dụng và Giải Quyết Tranh Chấp
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Điều khoản này được điều chỉnh bởi pháp luật Việt Nam.
                                Mọi tranh chấp sẽ được giải quyết tại tòa án có thẩm quyền tại Việt Nam.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                12. Thay Đổi Điều Khoản
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Chúng tôi có quyền sửa đổi điều khoản này bất cứ lúc nào.
                                Thay đổi sẽ có hiệu lực sau 7 ngày kể từ khi thông báo.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                13. Thông Tin Liên Hệ
                            </h2>
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                <p className="text-gray-700 dark:text-gray-300">
                                    <strong>Email:</strong> support@peachymarket.vn<br />
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

export default TermsOfServicePage;
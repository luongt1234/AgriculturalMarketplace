import React from 'react';

const AboutPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Về Chúng Tôi
                    </h1>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                        Nền tảng kết nối nông dân và người tiêu dùng, mang nông sản tươi ngon đến mọi nhà
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Sứ Mệnh Của Chúng Tôi
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Chúng tôi cam kết xây dựng một hệ sinh thái nông nghiệp bền vững,
                            kết nối trực tiếp nông dân với người tiêu dùng, loại bỏ khâu trung gian
                            và đảm bảo giá trị công bằng cho tất cả các bên.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-3xl text-green-600">agriculture</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Hỗ Trợ Nông Dân
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Cung cấp công cụ và nền tảng để nông dân tiếp cận thị trường rộng lớn,
                                tăng thu nhập và phát triển bền vững.
                            </p>
                        </div>

                        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-3xl text-blue-600">shopping_cart</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Trải Nghiệm Mua Sắm
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Mang đến cho người tiêu dùng những sản phẩm nông nghiệp chất lượng cao,
                                tươi ngon với giá cả hợp lý.
                            </p>
                        </div>

                        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-3xl text-green-600">eco</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Phát Triển Bền Vững
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Khuyến khích nông nghiệp hữu cơ, thân thiện với môi trường,
                                góp phần bảo vệ hành tinh xanh.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                Câu Chuyện Của Chúng Tôi
                            </h2>
                            <div className="space-y-4 text-gray-600 dark:text-gray-300">
                                <p>
                                    PeachyMarket được thành lập với sứ mệnh thay đổi cách thức phân phối
                                    nông sản tại Việt Nam. Chúng tôi nhận thấy rằng nông dân Việt Nam
                                    luôn phải đối mặt với nhiều khó khăn trong việc tiếp cận thị trường
                                    và người tiêu dùng phải trả giá cao cho các sản phẩm trung gian.
                                </p>
                                <p>
                                    Với nền tảng công nghệ hiện đại, chúng tôi tạo ra một hệ sinh thái
                                    nơi nông dân có thể trực tiếp bán sản phẩm của mình cho người tiêu dùng,
                                    loại bỏ các khâu trung gian không cần thiết và đảm bảo giá trị công bằng.
                                </p>
                                <p>
                                    Từ những vườn cây nhỏ lẻ đến các trang trại lớn, chúng tôi kết nối
                                    tất cả để tạo nên một thị trường nông sản minh bạch và bền vững.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Nông dân Việt Nam"
                                className="rounded-lg shadow-xl w-full"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-green-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Con Số Ấn Tượng
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-green-600 mb-2">10,000+</div>
                            <div className="text-gray-600 dark:text-gray-300">Nông Dân Tham Gia</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-green-600 mb-2">50,000+</div>
                            <div className="text-gray-600 dark:text-gray-300">Sản Phẩm Được Bán</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-green-600 mb-2">100,000+</div>
                            <div className="text-gray-600 dark:text-gray-300">Khách Hàng Tin Dùng</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
                            <div className="text-gray-600 dark:text-gray-300">Độ Hài Lòng</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Đội Ngũ Của Chúng Tôi
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Một đội ngũ đam mê công nghệ và nông nghiệp, cam kết mang lại giá trị
                            cho cộng đồng và xã hội.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-gray-500">person</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                                Trần Thị Anh Đào
                            </h3>
                            <p className="text-green-600 mb-2">CEO & Founder</p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                Chuyên gia nông nghiệp với hơn 15 năm kinh nghiệm
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-gray-500">person</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                                Peachy
                            </h3>
                            <p className="text-green-600 mb-2">Head of Operations</p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                Chuyên gia logistics và quản lý chuỗi cung ứng
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-gray-500">person</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                                Lươnnn
                            </h3>
                            <p className="text-green-600 mb-2">DEV</p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                Kỹ sư phần mềm với niềm đam mê công nghệ xanh
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-16 bg-green-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Tham Gia Cùng Chúng Tôi
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Bạn là nông dân? Bạn muốn mua nông sản tươi ngon?
                        Hãy tham gia cộng đồng PeachyMarket ngay hôm nay!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                            Đăng Ký Bán Hàng
                        </button>
                        <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
                            Khám Phá Sản Phẩm
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
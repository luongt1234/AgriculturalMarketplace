import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { settingsApi } from '../../features/settings/api/settingsApi';
import type { UpdateCaiDatGiaoDienDto } from '../../types/settings.types';
import { AdminHeader } from '../../layouts/components/AdminHeader';

const SettingsPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<UpdateCaiDatGiaoDienDto>({
        heroBannerTitle: '',
        heroBannerSubtitle: '',
        heroBannerDescription: '',
        heroBannerImageUrl: '',
        heroBannerCtaText: '',
        heroBannerCtaSecondaryText: '',
        footerCompanyName: '',
        footerAddress: '',
        footerPhone: '',
        footerEmail: '',
        footerFacebookUrl: '',
        footerYoutubeUrl: ''
    });

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const data = await settingsApi.getSettings();
                setFormData({
                    heroBannerTitle: data.heroBannerTitle,
                    heroBannerSubtitle: data.heroBannerSubtitle,
                    heroBannerDescription: data.heroBannerDescription,
                    heroBannerImageUrl: data.heroBannerImageUrl,
                    heroBannerCtaText: data.heroBannerCtaText,
                    heroBannerCtaSecondaryText: data.heroBannerCtaSecondaryText,
                    footerCompanyName: data.footerCompanyName,
                    footerAddress: data.footerAddress,
                    footerPhone: data.footerPhone,
                    footerEmail: data.footerEmail,
                    footerFacebookUrl: data.footerFacebookUrl,
                    footerYoutubeUrl: data.footerYoutubeUrl
                });
            } catch (error) {
                toast.error('Lỗi khi tải cài đặt giao diện');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await settingsApi.updateSettings(formData);
            toast.success('Lưu cài đặt giao diện thành công');
        } catch (error) {
            toast.error('Lỗi khi lưu cài đặt giao diện');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-6">Đang tải cấu hình...</div>;
    }

    return (
        <div className="flex-1 flex flex-col min-w-0 p-6 bg-white dark:bg-[#131613] font-display overflow-y-auto">
            <AdminHeader
                title="Cài đặt giao diện"
                description="Quản lý giao diện hiển thị trên trang chủ của người mua (Hero Banner, Footer)."
                breadcrumbs={[
                    { label: 'Trang chủ', path: '/' },
                    { label: 'Admin', path: '/admin' },
                    { label: 'Cài đặt giao diện', isActive: true }
                ]}
            />
            
            <div className="max-w-4xl w-full mt-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Hero Banner Section */}
                    <section className="bg-white dark:bg-[#1a261c] p-6 rounded-lg border border-[#dee3de] dark:border-gray-700 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 text-[#131613] dark:text-white border-b border-[#dee3de] dark:border-gray-700 pb-2">Hero Banner</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-[#131613] dark:text-gray-300 mb-1">Tiêu đề chính (Title)</label>
                            <input
                                type="text"
                                name="heroBannerTitle"
                                value={formData.heroBannerTitle}
                                onChange={handleChange}
                                className="w-full border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-[#131613] dark:text-white placeholder:text-[#6b806c] focus:ring-2 focus:ring-primary/50 focus:border-transparent text-sm transition-all outline-none p-2.5"
                                placeholder="Dùng \n để xuống dòng"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#131613] dark:text-gray-300 mb-1">Phụ đề (Subtitle)</label>
                            <input
                                type="text"
                                name="heroBannerSubtitle"
                                value={formData.heroBannerSubtitle}
                                onChange={handleChange}
                                className="w-full border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-[#131613] dark:text-white placeholder:text-[#6b806c] focus:ring-2 focus:ring-primary/50 focus:border-transparent text-sm transition-all outline-none p-2.5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#131613] dark:text-gray-300 mb-1">Hình nền (Image URL)</label>
                            <input
                                type="text"
                                name="heroBannerImageUrl"
                                value={formData.heroBannerImageUrl}
                                onChange={handleChange}
                                className="w-full border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-[#131613] dark:text-white placeholder:text-[#6b806c] focus:ring-2 focus:ring-primary/50 focus:border-transparent text-sm transition-all outline-none p-2.5"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-[#131613] dark:text-gray-300 mb-1">Mô tả (Description)</label>
                            <textarea
                                name="heroBannerDescription"
                                value={formData.heroBannerDescription}
                                onChange={handleChange}
                                rows={3}
                                className="w-full border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-[#131613] dark:text-white placeholder:text-[#6b806c] focus:ring-2 focus:ring-primary/50 focus:border-transparent text-sm transition-all outline-none p-2.5"
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#131613] dark:text-gray-300 mb-1">Nút bấm 1 (CTA Text)</label>
                            <input
                                type="text"
                                name="heroBannerCtaText"
                                value={formData.heroBannerCtaText}
                                onChange={handleChange}
                                className="w-full border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-[#131613] dark:text-white placeholder:text-[#6b806c] focus:ring-2 focus:ring-primary/50 focus:border-transparent text-sm transition-all outline-none p-2.5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#131613] dark:text-gray-300 mb-1">Nút bấm 2 (Secondary CTA Text)</label>
                            <input
                                type="text"
                                name="heroBannerCtaSecondaryText"
                                value={formData.heroBannerCtaSecondaryText}
                                onChange={handleChange}
                                className="w-full border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-[#131613] dark:text-white placeholder:text-[#6b806c] focus:ring-2 focus:ring-primary/50 focus:border-transparent text-sm transition-all outline-none p-2.5"
                            />
                        </div>
                    </div>
                </section>

                {/* Footer Section */}
                <section className="bg-white dark:bg-[#1a261c] p-6 rounded-lg border border-[#dee3de] dark:border-gray-700 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 text-[#131613] dark:text-white border-b border-[#dee3de] dark:border-gray-700 pb-2">Footer (Chân trang)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-[#131613] dark:text-gray-300 mb-1">Tên công ty / Nền tảng</label>
                            <input
                                type="text"
                                name="footerCompanyName"
                                value={formData.footerCompanyName}
                                onChange={handleChange}
                                className="w-full border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-[#131613] dark:text-white placeholder:text-[#6b806c] focus:ring-2 focus:ring-primary/50 focus:border-transparent text-sm transition-all outline-none p-2.5"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-[#131613] dark:text-gray-300 mb-1">Địa chỉ</label>
                            <input
                                type="text"
                                name="footerAddress"
                                value={formData.footerAddress}
                                onChange={handleChange}
                                className="w-full border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-[#131613] dark:text-white placeholder:text-[#6b806c] focus:ring-2 focus:ring-primary/50 focus:border-transparent text-sm transition-all outline-none p-2.5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#131613] dark:text-gray-300 mb-1">Số điện thoại</label>
                            <input
                                type="text"
                                name="footerPhone"
                                value={formData.footerPhone}
                                onChange={handleChange}
                                className="w-full border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-[#131613] dark:text-white placeholder:text-[#6b806c] focus:ring-2 focus:ring-primary/50 focus:border-transparent text-sm transition-all outline-none p-2.5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#131613] dark:text-gray-300 mb-1">Email liên hệ</label>
                            <input
                                type="email"
                                name="footerEmail"
                                value={formData.footerEmail}
                                onChange={handleChange}
                                className="w-full border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-[#131613] dark:text-white placeholder:text-[#6b806c] focus:ring-2 focus:ring-primary/50 focus:border-transparent text-sm transition-all outline-none p-2.5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#131613] dark:text-gray-300 mb-1">Facebook URL</label>
                            <input
                                type="text"
                                name="footerFacebookUrl"
                                value={formData.footerFacebookUrl}
                                onChange={handleChange}
                                className="w-full border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-[#131613] dark:text-white placeholder:text-[#6b806c] focus:ring-2 focus:ring-primary/50 focus:border-transparent text-sm transition-all outline-none p-2.5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#131613] dark:text-gray-300 mb-1">Youtube URL</label>
                            <input
                                type="text"
                                name="footerYoutubeUrl"
                                value={formData.footerYoutubeUrl}
                                onChange={handleChange}
                                className="w-full border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-[#131613] dark:text-white placeholder:text-[#6b806c] focus:ring-2 focus:ring-primary/50 focus:border-transparent text-sm transition-all outline-none p-2.5"
                            />
                        </div>
                    </div>
                </section>

                <div className="flex justify-end pb-10">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary hover:bg-[#246328] text-white transition-all font-bold text-sm uppercase tracking-widest shadow-sm disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined icon-filled text-[18px]">save</span>
                        {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </form>
            </div>
        </div>
    );
};

export default SettingsPage;

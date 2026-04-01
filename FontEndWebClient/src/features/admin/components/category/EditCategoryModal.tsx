import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axiosInstance from '../../../../lip/axiosInstance';
import type { DanhMuc, LoaiDanhMuc } from '../../../../types/danhMuc.type';

interface EditCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    type: 'LOAI_DANH_MUC' | 'DANH_MUC';
    item: any | null;
}

export const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    type,
    item
}) => {
    const [loading, setLoading] = useState(false);
    const [loaiDanhMucList, setLoaiDanhMucList] = useState<LoaiDanhMuc[]>([]);
    const [danhMucList, setDanhMucList] = useState<DanhMuc[]>([]);

    // Form data cho LOAI_DANH_MUC
    const [formDataLoai, setFormDataLoai] = useState({
        maLoaiDanhMuc: '',
        tenLoaiDanhMuc: ''
    });

    // Form data cho DANH_MUC
    const [formDataDanhMuc, setFormDataDanhMuc] = useState({
        loaiDanhMucId: '',
        maGiaTri: '',
        tenHienThi: '',
        thuTu: 1,
        danhMucCapTrenId: ''
    });

    // Fetch dữ liệu cần thiết khi mở modal
    useEffect(() => {
        if (isOpen && type === 'DANH_MUC') {
            fetchLoaiDanhMucAndDanhMuc();
        }
    }, [isOpen, type]);

    // Load dữ liệu của item vào form khi mở Modal
    useEffect(() => {
        if (item && isOpen) {
            if (type === 'LOAI_DANH_MUC') {
                setFormDataLoai({
                    maLoaiDanhMuc: item.maLoaiDanhMuc || '',
                    tenLoaiDanhMuc: item.tenLoaiDanhMuc || ''
                });
            } else {
                setFormDataDanhMuc({
                    loaiDanhMucId: item.loaiDanhMucId || '',
                    maGiaTri: item.maGiaTri || '',
                    tenHienThi: item.tenHienThi || '',
                    thuTu: item.thuTu || 1,
                    danhMucCapTrenId: item.danhMucCapTrenId || ''
                });
            }
        }
    }, [item, isOpen, type]);

    const fetchLoaiDanhMucAndDanhMuc = async () => {
        try {
            // Fetch Loại danh mục
            const resLoai = await axiosInstance.get('/api/LoaiDanhMuc');
            if (resLoai) {
                setLoaiDanhMucList(resLoai.data || []);
            }

            // Fetch Danh mục (để show cấp trên)
            const resDanhMuc = await axiosInstance.get('/api/DanhMuc');
            if (resDanhMuc) {
                setDanhMucList(resDanhMuc.data || []);
            }
        } catch (err: any) {
            console.error('Lỗi khi fetch dữ liệu:', err);
        }
    };

    const handleChangeLoai = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormDataLoai(prev => ({ ...prev, [name]: value }));
    };

    const handleChangeDanhMuc = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'thuTu') {
            setFormDataDanhMuc(prev => ({ ...prev, [name]: parseInt(value) || 1 }));
        } else {
            setFormDataDanhMuc(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmitLoai = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!item) return;

        setLoading(true);
        try {
            await axiosInstance.put(`/api/LoaiDanhMuc/${item.id}`, {
                ...item,
                maLoaiDanhMuc: formDataLoai.maLoaiDanhMuc,
                tenLoaiDanhMuc: formDataLoai.tenLoaiDanhMuc
            });
            toast.success('Cập nhật loại danh mục thành công!');
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Lỗi khi cập nhật loại danh mục:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật loại danh mục.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitDanhMuc = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!item) return;

        setLoading(true);
        try {
            await axiosInstance.put(`/api/DanhMuc/${item.id}`, {
                ...item,
                loaiDanhMucId: formDataDanhMuc.loaiDanhMucId,
                maGiaTri: formDataDanhMuc.maGiaTri,
                tenHienThi: formDataDanhMuc.tenHienThi,
                thuTu: formDataDanhMuc.thuTu,
                danhMucCapTrenId: formDataDanhMuc.danhMucCapTrenId || null
            });
            toast.success('Cập nhật danh mục thành công!');
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Lỗi khi cập nhật danh mục:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật danh mục.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !item) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1a261c] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col font-display border border-[#dee3de] dark:border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#dee3de] dark:border-gray-700 bg-[#f9faf9] dark:bg-[#1f2d21]">
                    <h2 className="text-lg font-bold text-[#131613] dark:text-white uppercase tracking-wide">
                        {type === 'LOAI_DANH_MUC' ? 'Chỉnh sửa loại danh mục' : 'Chỉnh sửa danh mục'}
                    </h2>
                    <button onClick={onClose} className="text-[#6b806c] hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body Form */}
                <form onSubmit={type === 'LOAI_DANH_MUC' ? handleSubmitLoai : handleSubmitDanhMuc} className="flex-1 overflow-y-auto p-6 space-y-4">
                    {type === 'LOAI_DANH_MUC' ? (
                        // Form cho Loại Danh Mục
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase mb-1">Mã loại danh mục *</label>
                                <input
                                    required
                                    name="maLoaiDanhMuc"
                                    value={formDataLoai.maLoaiDanhMuc}
                                    onChange={handleChangeLoai}
                                    className="w-full px-3 py-2 border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-sm text-[#131613] dark:text-white outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase mb-1">Tên loại danh mục *</label>
                                <input
                                    required
                                    name="tenLoaiDanhMuc"
                                    value={formDataLoai.tenLoaiDanhMuc}
                                    onChange={handleChangeLoai}
                                    className="w-full px-3 py-2 border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-sm text-[#131613] dark:text-white outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                        </div>
                    ) : (
                        // Form cho Danh Mục
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase mb-1">Loại danh mục *</label>
                                <select
                                    required
                                    name="loaiDanhMucId"
                                    value={formDataDanhMuc.loaiDanhMucId}
                                    onChange={handleChangeDanhMuc}
                                    className="w-full px-3 py-2 border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-sm text-[#131613] dark:text-white outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                                >
                                    <option value="">-- Chọn loại danh mục --</option>
                                    {loaiDanhMucList.map(item => (
                                        <option key={item.id} value={item.id}>{item.tenLoaiDanhMuc}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase mb-1">Mã giá trị *</label>
                                <input
                                    required
                                    name="maGiaTri"
                                    value={formDataDanhMuc.maGiaTri}
                                    onChange={handleChangeDanhMuc}
                                    className="w-full px-3 py-2 border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-sm text-[#131613] dark:text-white outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase mb-1">Thứ tự *</label>
                                <input
                                    required
                                    type="number"
                                    name="thuTu"
                                    value={formDataDanhMuc.thuTu}
                                    onChange={handleChangeDanhMuc}
                                    className="w-full px-3 py-2 border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-sm text-[#131613] dark:text-white outline-none focus:ring-2 focus:ring-primary/50"
                                    min="1"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase mb-1">Tên hiển thị *</label>
                                <input
                                    required
                                    name="tenHienThi"
                                    value={formDataDanhMuc.tenHienThi}
                                    onChange={handleChangeDanhMuc}
                                    className="w-full px-3 py-2 border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-sm text-[#131613] dark:text-white outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-[#6b806c] dark:text-gray-400 uppercase mb-1">Danh mục cấp trên (Tùy chọn)</label>
                                <select
                                    name="danhMucCapTrenId"
                                    value={formDataDanhMuc.danhMucCapTrenId}
                                    onChange={handleChangeDanhMuc}
                                    className="w-full px-3 py-2 border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-sm text-[#131613] dark:text-white outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                                >
                                    <option value="">-- Không có (Root) --</option>
                                    {danhMucList.map(dm => (
                                        <option key={dm.id} value={dm.id}>{dm.tenHienThi}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#dee3de] dark:border-gray-700">
                        <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-bold text-[#6b806c] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                            Hủy bỏ
                        </button>
                        <button type="submit" disabled={loading} className="px-5 py-2 rounded-lg bg-primary hover:bg-[#246328] text-white text-sm font-bold shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2">
                            {loading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                            CẬP NHẬT
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

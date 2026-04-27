import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AdminHeader } from '../../layouts/components/AdminHeader';
import type { VoucherDto, CreateVoucherDto, UpdateVoucherDto } from '../../types/voucher.types';
import { voucherApi } from '../../features/voucher/api/voucherApi';

const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('vi-VN');
const isoDate = (d: Date) => d.toISOString().split('T')[0];

const EMPTY_FORM: CreateVoucherDto = {
    maCode: '',
    tenVoucher: '',
    moTa: '',
    loaiGiamGia: 'PHAN_TRAM',
    giaTriGiam: 10,
    giaTriGiamToiDa: undefined,
    giaTriDonHangToiThieu: 0,
    ngayBatDau: isoDate(new Date()),
    ngayHetHan: isoDate(new Date(Date.now() + 7 * 864e5)),
    soLuong: 100,
};

// ─────────────────────────── Modal ───────────────────────────────────────────
const VoucherModal: React.FC<{
    isOpen: boolean;
    editing: VoucherDto | null;
    onClose: () => void;
    onSuccess: () => void;
}> = ({ isOpen, editing, onClose, onSuccess }) => {
    const [form, setForm] = useState<CreateVoucherDto>(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (editing) {
            setForm({
                maCode: editing.maCode,
                tenVoucher: editing.tenVoucher,
                moTa: editing.moTa ?? '',
                loaiGiamGia: editing.loaiGiamGia,
                giaTriGiam: editing.giaTriGiam,
                giaTriGiamToiDa: editing.giaTriGiamToiDa,
                giaTriDonHangToiThieu: editing.giaTriDonHangToiThieu,
                ngayBatDau: editing.ngayBatDau.split('T')[0],
                ngayHetHan: editing.ngayHetHan.split('T')[0],
                soLuong: editing.soLuong,
                apDungChoIds: editing.apDungChoIds,
            });
        } else {
            setForm(EMPTY_FORM);
        }
    }, [editing, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editing) {
                const dto: UpdateVoucherDto = { ...form, tenVoucher: form.tenVoucher };
                await voucherApi.updateVoucher(editing.id, dto);
                toast.success('Cập nhật voucher thành công!');
            } else {
                await voucherApi.createAdminVoucher(form);
                toast.success('Tạo voucher thành công!');
            }
            onSuccess();
            onClose();
        } catch { toast.error('Có lỗi xảy ra.'); }
        finally { setSaving(false); }
    };

    const inputCls = 'w-full border border-[#dee3de] dark:border-gray-700 rounded-lg bg-[#f1f3f1] dark:bg-[#253326] text-[#131613] dark:text-white placeholder:text-[#6b806c] focus:ring-2 focus:ring-primary/50 focus:border-transparent text-sm outline-none p-2.5';
    const labelCls = 'block text-sm font-medium text-[#131613] dark:text-gray-300 mb-1';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1a261c] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-[#dee3de] dark:border-gray-700">
                    <h2 className="text-xl font-bold text-[#131613] dark:text-white">
                        {editing ? 'Chỉnh sửa Voucher' : 'Thêm Voucher hệ thống'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Mã Code *</label>
                            <input name="maCode" value={form.maCode} onChange={handleChange} required className={inputCls} placeholder="VD: SALE20" style={{ textTransform: 'uppercase' }} />
                        </div>
                        <div>
                            <label className={labelCls}>Tên Voucher *</label>
                            <input name="tenVoucher" value={form.tenVoucher} onChange={handleChange} required className={inputCls} />
                        </div>
                    </div>
                    <div>
                        <label className={labelCls}>Mô tả</label>
                        <textarea name="moTa" value={form.moTa} onChange={handleChange} rows={2} className={inputCls} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Loại giảm giá</label>
                            <select name="loaiGiamGia" value={form.loaiGiamGia} onChange={handleChange} className={inputCls}>
                                <option value="PHAN_TRAM">Phần trăm (%)</option>
                                <option value="SO_TIEN_CO_DINH">Số tiền cố định (₫)</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>Giá trị giảm {form.loaiGiamGia === 'PHAN_TRAM' ? '(%)' : '(₫)'} *</label>
                            <input type="number" name="giaTriGiam" value={form.giaTriGiam} onChange={handleChange} required min={0} className={inputCls} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Giảm tối đa (₫, tùy chọn)</label>
                            <input type="number" name="giaTriGiamToiDa" value={form.giaTriGiamToiDa ?? ''} onChange={handleChange} min={0} className={inputCls} placeholder="Không giới hạn" />
                        </div>
                        <div>
                            <label className={labelCls}>Đơn tối thiểu (₫)</label>
                            <input type="number" name="giaTriDonHangToiThieu" value={form.giaTriDonHangToiThieu} onChange={handleChange} min={0} className={inputCls} />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className={labelCls}>Ngày bắt đầu *</label>
                            <input type="date" name="ngayBatDau" value={form.ngayBatDau} onChange={handleChange} required className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Ngày hết hạn *</label>
                            <input type="date" name="ngayHetHan" value={form.ngayHetHan} onChange={handleChange} required className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Số lượng (-1 = KGH)</label>
                            <input type="number" name="soLuong" value={form.soLuong} onChange={handleChange} required className={inputCls} />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition">Hủy</button>
                        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary hover:bg-[#246328] text-white font-bold text-sm uppercase tracking-widest shadow-sm disabled:opacity-50">
                            <span className="material-symbols-outlined icon-filled text-[18px]">save</span>
                            {saving ? 'Đang lưu...' : (editing ? 'Cập nhật' : 'Tạo voucher')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─────────────────────────── Main Page ───────────────────────────────────────
const VoucherManagement: React.FC = () => {
    const [vouchers, setVouchers] = useState<VoucherDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<VoucherDto | null>(null);

    const fetchVouchers = async () => {
        setLoading(true);
        try {
            const data = await voucherApi.getAdminVouchers();
            setVouchers(data);
        } catch { toast.error('Không thể tải danh sách voucher.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchVouchers(); }, []);

    const handleDelete = async (v: VoucherDto) => {
        if (!confirm(`Xóa voucher "${v.tenVoucher}"?`)) return;
        try {
            await voucherApi.deleteVoucher(v.id);
            toast.success('Đã xóa voucher.');
            fetchVouchers();
        } catch { toast.error('Xóa thất bại.'); }
    };

    const statusBadge = (v: VoucherDto) => {
        if (!v.conHieuLuc) return <span className="px-2 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-500">Hết hạn</span>;
        if (!v.conSoLuong) return <span className="px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-600">Hết lượt</span>;
        return <span className="px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700">Đang hoạt động</span>;
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 p-6 bg-white dark:bg-[#131613] font-display overflow-y-auto">
            <AdminHeader
                title="Quản lý Voucher hệ thống"
                description="Tạo và quản lý mã giảm giá áp dụng toàn hệ thống."
                breadcrumbs={[
                    { label: 'Trang chủ', path: '/' },
                    { label: 'Admin', path: '/admin' },
                    { label: 'Voucher', isActive: true }
                ]}
                rightContent={
                    <button
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary hover:bg-[#246328] text-white transition-all font-bold text-sm uppercase tracking-widest shadow-sm"
                        onClick={() => { setEditing(null); setModalOpen(true); }}
                    >
                        <span className="material-symbols-outlined icon-filled text-[18px]">add_circle</span>
                        Thêm Voucher
                    </button>
                }
            />

            {loading ? (
                <div className="flex items-center justify-center flex-1 text-primary text-lg mt-10">
                    <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span> Đang tải...
                </div>
            ) : (
                <div className="mt-6 rounded-xl border border-[#dee3de] dark:border-gray-700 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-[#f1f3f1] dark:bg-[#253326] text-[#6b806c] uppercase text-xs">
                            <tr>
                                <th className="text-left px-4 py-3 font-bold">Mã Code</th>
                                <th className="text-left px-4 py-3 font-bold">Tên Voucher</th>
                                <th className="text-center px-4 py-3 font-bold">Loại giảm</th>
                                <th className="text-right px-4 py-3 font-bold">Giá trị</th>
                                <th className="text-center px-4 py-3 font-bold">Hạn dùng</th>
                                <th className="text-center px-4 py-3 font-bold">SL còn</th>
                                <th className="text-center px-4 py-3 font-bold">Trạng thái</th>
                                <th className="text-right px-4 py-3 font-bold">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#dee3de] dark:divide-gray-700">
                            {vouchers.length === 0 ? (
                                <tr><td colSpan={8} className="text-center py-12 text-gray-400">Chưa có voucher nào.</td></tr>
                            ) : vouchers.map(v => (
                                <tr key={v.id} className="hover:bg-[#f9faf9] dark:hover:bg-[#1e2d20] transition-colors">
                                    <td className="px-4 py-3">
                                        <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded">{v.maCode}</span>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-[#131613] dark:text-white">{v.tenVoucher}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${v.loaiGiamGia === 'PHAN_TRAM' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {v.loaiGiamGia === 'PHAN_TRAM' ? 'Phần trăm' : 'Cố định'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right font-bold text-[#131613] dark:text-white">
                                        {v.loaiGiamGia === 'PHAN_TRAM' ? `${v.giaTriGiam}%` : `${v.giaTriGiam.toLocaleString('vi-VN')}₫`}
                                    </td>
                                    <td className="px-4 py-3 text-center text-gray-500 text-xs">
                                        {formatDate(v.ngayBatDau)} – {formatDate(v.ngayHetHan)}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {v.soLuong === -1 ? <span className="text-xs text-gray-400">Không giới hạn</span> : `${v.soLuong - v.soLuongDaDung}/${v.soLuong}`}
                                    </td>
                                    <td className="px-4 py-3 text-center">{statusBadge(v)}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => { setEditing(v); setModalOpen(true); }} className="p-1.5 hover:text-primary transition-colors" title="Sửa">
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                            <button onClick={() => handleDelete(v)} className="p-1.5 hover:text-red-500 transition-colors" title="Xóa">
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <VoucherModal
                isOpen={modalOpen}
                editing={editing}
                onClose={() => setModalOpen(false)}
                onSuccess={fetchVouchers}
            />
        </div>
    );
};

export default VoucherManagement;

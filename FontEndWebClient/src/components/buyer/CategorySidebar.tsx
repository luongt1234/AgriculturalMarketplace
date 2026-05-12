import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCommonProducts } from '../../features/products/api/product.api';
import type { CommonProduct } from '../../types/product.types';

// ─── CategoryNode (recursive) ────────────────────────────────────────────────
interface CategoryNodeProps {
    node: CommonProduct;
    depth: number;
    onLeafClick: (id: string) => void;
}

const CategoryNode: React.FC<CategoryNodeProps> = ({ node, depth, onLeafClick }) => {
    const hasChildren = !!(node.children && node.children.length > 0);
    const [expanded, setExpanded] = useState(false);

    const handleClick = () => {
        if (hasChildren) setExpanded((prev) => !prev);
        else onLeafClick(node.id);
    };

    return (
        <li>
            <button
                onClick={handleClick}
                className={[
                    'w-full flex items-center gap-2.5 rounded-lg transition-all duration-150 text-left group',
                    depth === 0
                        ? 'px-3 py-2.5 hover:bg-primary/8 dark:hover:bg-primary/15'
                        : 'px-3 py-1.5 hover:bg-primary/5 dark:hover:bg-primary/10',
                ].join(' ')}
            >
                {/* Icon lá cây cấp 0 */}
                {depth === 0 && (
                    <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center transition-transform group-hover:scale-105">
                        <span className="material-symbols-outlined text-primary text-[16px]">
                            eco
                        </span>
                    </span>
                )}

                {/* Dot cấp con */}
                {depth > 0 && (
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary/50" />
                )}

                <span
                    className={[
                        'flex-1 leading-snug transition-colors group-hover:text-primary',
                        depth === 0
                            ? 'text-sm font-semibold text-gray-800 dark:text-gray-100'
                            : 'text-xs font-medium text-gray-600 dark:text-gray-300',
                    ].join(' ')}
                >
                    {node.tenSanPham}
                </span>

                {hasChildren && (
                    <span
                        className={[
                            'material-symbols-outlined text-[15px] text-gray-400 group-hover:text-primary flex-shrink-0 transition-transform duration-200',
                            expanded ? 'rotate-90' : '',
                        ].join(' ')}
                    >
                        chevron_right
                    </span>
                )}
            </button>

            {hasChildren && (
                <div
                    style={{
                        maxHeight: expanded ? '800px' : '0px',
                        opacity: expanded ? 1 : 0,
                        overflow: 'hidden',
                        transition: 'max-height 0.3s ease, opacity 0.2s ease',
                    }}
                >
                    <ul className="mt-0.5 border-l-2 border-primary/20 dark:border-primary/30 ml-5 pl-1.5 space-y-0">
                        {node.children!.map((child) => (
                            <CategoryNode
                                key={child.id}
                                node={child}
                                depth={depth + 1}
                                onLeafClick={onLeafClick}
                            />
                        ))}
                    </ul>
                </div>
            )}
        </li>
    );
};

// ─── CategorySidebar ──────────────────────────────────────────────────────────
interface CategorySidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<CommonProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const panelRef = useRef<HTMLElement>(null);

    useEffect(() => {
        getCommonProducts()
            .then((data) => setCategories(data.filter((c) => !c.chaId)))
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    // Đóng khi click ngoài (bỏ qua nút trigger)
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: MouseEvent) => {
            const target = e.target as Node;
            const triggerBtn = document.getElementById('btn-category-float');
            if (triggerBtn && triggerBtn.contains(target)) return;
            if (panelRef.current && !panelRef.current.contains(target)) onClose();
        };
        const t = setTimeout(() => document.addEventListener('mousedown', handler), 150);
        return () => { clearTimeout(t); document.removeEventListener('mousedown', handler); };
    }, [isOpen, onClose]);

    const handleLeafClick = (id: string) => {
        navigate(`/category/${id}`);
        onClose();
    };

    return (
        <aside
            ref={panelRef}
            aria-label="Danh mục sản phẩm"
            style={{
                position: 'fixed',
                top: '64px',
                left: 0,
                bottom: 0,
                width: '272px',
                zIndex: 40,
                transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.27s cubic-bezier(0.4,0,0.2,1), box-shadow 0.27s ease',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: isOpen ? '6px 0 24px rgba(47,127,52,0.13)' : 'none',
            }}
            className="bg-white dark:bg-[#1a261c] border-r border-primary/15 dark:border-primary/25"
        >
            {/* Header */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-primary/10 dark:border-primary/20 bg-gradient-to-r from-primary/8 to-transparent flex-shrink-0">
                <span className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[18px]">category</span>
                </span>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white flex-1">
                    Khám phá danh mục
                </h2>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto py-2 px-2">
                {isLoading ? (
                    <div className="flex flex-col gap-3 px-2 py-4">
                        {[...Array(7)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3 animate-pulse">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex-shrink-0" />
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-3/4" />
                            </div>
                        ))}
                    </div>
                ) : categories.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-8">Không có danh mục.</p>
                ) : (
                    <ul className="space-y-0.5">
                        {categories.map((cat) => (
                            <CategoryNode
                                key={cat.id}
                                node={cat}
                                depth={0}
                                onLeafClick={handleLeafClick}
                            />
                        ))}
                    </ul>
                )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-primary/10 dark:border-primary/20 flex-shrink-0">
                <button
                    onClick={() => { navigate('/category/all'); onClose(); }}
                    className="w-full py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                    <span className="material-symbols-outlined text-[15px]">apps</span>
                    Xem tất cả danh mục
                </button>
            </div>
        </aside>
    );
};

// ─── CategoryFloatingButton ───────────────────────────────────────────────────
// Nút nổi dạng tròn, chỉ hiện ở route "/"
export const CategoryFloatingButton: React.FC = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    // Chỉ render ở trang chủ
    if (location.pathname !== '/') return null;

    return (
        <>
            <CategorySidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />

            {/* Floating circular button — góc trái dưới, dịch sang phải khi sidebar mở */}
            <div
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    left: isOpen ? '284px' : '24px',   /* 272px sidebar + 12px gap */
                    zIndex: 50,
                    transition: 'left 0.27s cubic-bezier(0.4,0,0.2,1)',
                }}
            >
                <button
                    id="btn-category-float"
                    onClick={() => setIsOpen((v) => !v)}
                    aria-label="Khám phá danh mục"
                    title="Khám phá danh mục"
                    className={[
                        'relative w-14 h-14 rounded-full flex items-center justify-center',
                        'text-white shadow-lg',
                        'hover:scale-105 active:scale-95 transition-all duration-200',
                        isOpen
                            ? 'bg-primary-dark'
                            : 'bg-gradient-to-br from-primary to-primary-dark',
                    ].join(' ')}
                    style={{
                        boxShadow: isOpen
                            ? '0 4px 20px rgba(47,127,52,0.55)'
                            : '0 4px 20px rgba(47,127,52,0.40)',
                    }}
                >
                    <span className="material-symbols-outlined text-[26px]">
                        {isOpen ? 'close' : 'category'}
                    </span>

                    {/* Pulse ring khi đóng */}
                    {!isOpen && (
                        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-primary-light" />
                        </span>
                    )}
                </button>
            </div>
        </>
    );
};

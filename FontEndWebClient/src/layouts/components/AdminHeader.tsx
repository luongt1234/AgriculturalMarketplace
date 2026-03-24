import React from 'react';
import { Link } from 'react-router-dom'; // Hỗ trợ click vào breadcrumb chuyển trang

export interface Breadcrumb {
    label: string;
    path?: string; // Đường dẫn nếu muốn click được
    isActive?: boolean;
}

interface AdminHeaderProps {
    title: string;           // Tên trang (VD: Buyer Registry)
    description?: string;    // Subtext mô tả bên dưới
    breadcrumbs: Breadcrumb[];
    rightContent?: React.ReactNode; // Nút bấm hoặc search box
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
    title,
    description,
    breadcrumbs,
    rightContent
}) => {
    return (
        // Đã xóa màu nền cứng để nó tự động "ăn" theo màu nền của trang cha (trắng hoặc #131613)
        <header className="pb-6 shrink-0">

            {/* 1. Breadcrumbs */}
            <div className="flex items-center gap-2 mb-4">
                {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                        {/* Nếu có path và không phải đang active -> cho phép click */}
                        {crumb.path && !crumb.isActive ? (
                            <Link
                                to={crumb.path}
                                className="text-[#6b806c] dark:text-gray-400 text-xs font-medium hover:text-[#131613] dark:hover:text-white transition-colors uppercase tracking-wider"
                            >
                                {crumb.label}
                            </Link>
                        ) : (
                            <span
                                className={crumb.isActive
                                    ? "text-[#131613] dark:text-white text-xs font-bold uppercase tracking-wider"
                                    : "text-[#6b806c] dark:text-gray-400 text-xs font-medium uppercase tracking-wider"
                                }
                            >
                                {crumb.label}
                            </span>
                        )}

                        {/* Dấu phân cách '/' */}
                        {index < breadcrumbs.length - 1 && (
                            <span className="text-[#dee3de] dark:text-gray-600 text-xs">/</span>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* 2. Tiêu đề Trang và Cụm Nút Thao tác */}
            <div className="flex flex-wrap justify-between items-end gap-4">
                <div>
                    <h2 className="text-[#131613] dark:text-white text-3xl font-extrabold leading-tight tracking-tight">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-[#6b806c] dark:text-gray-400 text-sm mt-1">
                            {description}
                        </p>
                    )}
                </div>

                {/* Khu vực gắn Nút bấm (nếu có truyền vào) */}
                {rightContent && (
                    <div className="flex gap-3">
                        {rightContent}
                    </div>
                )}
            </div>
        </header>
    );
};
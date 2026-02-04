import React from 'react';

export const RevenueChart: React.FC = () => {
    return (
        <div className="xl:col-span-2 bg-white dark:bg-[#1a261c] rounded-xl border border-[#dee3de] dark:border-gray-700 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-[#131613] dark:text-white text-lg font-bold leading-tight">Xu hướng doanh thu</h3>
                    <p className="text-sm text-[#6b806c] dark:text-gray-400">Tổng quan doanh thu tháng hiện tại</p>
                </div>
                <div className="flex items-center bg-[#f1f3f1] dark:bg-white/5 rounded-lg p-1">
                    <button className="px-3 py-1.5 bg-white dark:bg-gray-700 rounded shadow-sm text-xs font-semibold text-[#131613] dark:text-white">Tuần</button>
                    <button className="px-3 py-1.5 text-xs font-medium text-[#6b806c] dark:text-gray-400 hover:text-[#131613] dark:hover:text-white">Tháng</button>
                </div>
            </div>

            {/* Chart container */}
            <div className="w-full h-[300px] flex flex-col justify-end">
                <div className="relative w-full h-full">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between text-xs text-[#6b806c] dark:text-gray-500 pointer-events-none">
                        <div className="border-b border-dashed border-gray-200 dark:border-gray-700 w-full h-0"></div>
                        <div className="border-b border-dashed border-gray-200 dark:border-gray-700 w-full h-0"></div>
                        <div className="border-b border-dashed border-gray-200 dark:border-gray-700 w-full h-0"></div>
                        <div className="border-b border-dashed border-gray-200 dark:border-gray-700 w-full h-0"></div>
                        <div className="border-b border-gray-200 dark:border-gray-700 w-full h-0"></div>
                    </div>
                    {/* SVG Chart */}
                    <svg className="w-full h-[85%] absolute bottom-0 z-10 overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 200">
                        <defs>
                            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#2f7f34" stopOpacity="0.2"></stop>
                                <stop offset="100%" stopColor="#2f7f34" stopOpacity="0"></stop>
                            </linearGradient>
                        </defs>
                        <path d="M0,150 C50,150 50,80 100,80 C150,80 150,120 200,120 C250,120 250,40 300,40 C350,40 350,90 400,90 C450,90 450,60 500,60 C550,60 550,100 600,100 C650,100 650,20 700,20 C750,20 750,50 800,50 V200 H0 Z" fill="url(#chartGradient)"></path>
                        <path d="M0,150 C50,150 50,80 100,80 C150,80 150,120 200,120 C250,120 250,40 300,40 C350,40 350,90 400,90 C450,90 450,60 500,60 C550,60 550,100 600,100 C650,100 650,20 700,20 C750,20 750,50 800,50" fill="none" stroke="#2f7f34" strokeLinecap="round" strokeWidth="3" vectorEffect="non-scaling-stroke"></path>
                        <circle className="drop-shadow-md" cx="700" cy="20" fill="#fff" r="6" stroke="#2f7f34" strokeWidth="3"></circle>
                    </svg>
                </div>
                <div className="flex justify-between mt-2 text-xs text-[#6b806c] dark:text-gray-500 font-medium px-2">
                    <span>May 01</span>
                    <span>May 08</span>
                    <span>May 15</span>
                    <span>May 22</span>
                    <span>May 29</span>
                </div>
            </div>
        </div>
    );
};
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner'; // Thư viện thông báo đẹp, nhẹ
import AppRoutes from './routes/AppRoutes.tsx';

// import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Dữ liệu cũ sau 5 phút
      refetchOnWindowFocus: false, // Không tự gọi lại API khi switch tab
      retry: 1, // Thử lại 1 lần nếu lỗi
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" richColors closeButton />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
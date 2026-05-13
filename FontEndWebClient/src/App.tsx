import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppRoutes from './routes/AppRoutes.tsx';
import { useOrderNotifications } from './hooks/useOrderNotifications';

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

// Inner component — must be inside BrowserRouter to use hooks that depend on routing
function AppContent() {
  useOrderNotifications();
  return (
    <>
      <AppRoutes />
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
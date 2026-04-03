import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/use-auth.jsx';
import LoginPage from './pages/login-page.jsx';
import RegisterPage from './pages/register-page.jsx';
import HomePage from './pages/home-page.jsx';
import SearchPage from './pages/search-page.jsx';
import SearchResultsPage from './pages/search-results-page.jsx';
import SpaceDetailPage from './pages/space-detail-page.jsx';
import PhotoGalleryPage from './pages/photo-gallery-page.jsx';
import ReviewsPage from './pages/reviews-page.jsx';
import BookingPage from './pages/booking-page.jsx';
import BookingCompletePage from './pages/booking-complete-page.jsx';
import ReservationsPage from './pages/reservations-page.jsx';
import ReservationDetailPage from './pages/reservation-detail-page.jsx';
import CancelReservationPage from './pages/cancel-reservation-page.jsx';
import WriteReviewPage from './pages/write-review-page.jsx';
import ChatListPage from './pages/chat-list-page.jsx';
import ChatRoomPage from './pages/chat-room-page.jsx';
import MyPage from './pages/my-page.jsx';
import EditProfilePage from './pages/edit-profile-page.jsx';
import NotificationSettingsPage from './pages/notification-settings-page.jsx';
import FaqPage from './pages/faq-page.jsx';
import TermsPage from './pages/terms-page.jsx';
import NotificationsPage from './pages/notifications-page.jsx';
import NotFoundPage from './pages/not-found-page.jsx';

/**
 * PrivateRoute 컴포넌트
 *
 * Props:
 * @param {ReactNode} children - 인증된 사용자에게 보여줄 컴포넌트 [Required]
 *
 * Example usage:
 * <PrivateRoute><HomePage /></PrivateRoute>
 */
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/search" element={<PrivateRoute><SearchPage /></PrivateRoute>} />
        <Route path="/search/results" element={<PrivateRoute><SearchResultsPage /></PrivateRoute>} />
        <Route path="/space/:id" element={<PrivateRoute><SpaceDetailPage /></PrivateRoute>} />
        <Route path="/space/:id/photos" element={<PrivateRoute><PhotoGalleryPage /></PrivateRoute>} />
        <Route path="/space/:id/reviews" element={<PrivateRoute><ReviewsPage /></PrivateRoute>} />
        <Route path="/space/:id/booking" element={<PrivateRoute><BookingPage /></PrivateRoute>} />
        <Route path="/booking-complete/:id" element={<PrivateRoute><BookingCompletePage /></PrivateRoute>} />
        <Route path="/reservations" element={<PrivateRoute><ReservationsPage /></PrivateRoute>} />
        <Route path="/reservation/:id" element={<PrivateRoute><ReservationDetailPage /></PrivateRoute>} />
        <Route path="/reservation/:id/cancel" element={<PrivateRoute><CancelReservationPage /></PrivateRoute>} />
        <Route path="/reservation/:id/review" element={<PrivateRoute><WriteReviewPage /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><ChatListPage /></PrivateRoute>} />
        <Route path="/chat/:id" element={<PrivateRoute><ChatRoomPage /></PrivateRoute>} />
        <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
        <Route path="/mypage/profile" element={<PrivateRoute><EditProfilePage /></PrivateRoute>} />
        <Route path="/mypage/notifications" element={<PrivateRoute><NotificationSettingsPage /></PrivateRoute>} />
        <Route path="/mypage/faq" element={<PrivateRoute><FaqPage /></PrivateRoute>} />
        <Route path="/mypage/terms" element={<PrivateRoute><TermsPage /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;

import Box from '@mui/material/Box';
import BottomNav from './bottom-nav.jsx';

/**
 * MobileLayout 컴포넌트
 *
 * Props:
 * @param {ReactNode} children - 하위 컴포넌트 [Required]
 * @param {boolean} hasBottomNav - 하단 네비게이션 표시 여부 [Optional, 기본값: true]
 *
 * Example usage:
 * <MobileLayout><HomePage /></MobileLayout>
 */
function MobileLayout({ children, hasBottomNav = true }) {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 430,
          minHeight: '100vh',
          bgcolor: '#FDFFFB',
          position: 'relative',
          boxShadow: { xs: 'none', md: '0 0 20px rgba(0,0,0,0.1)' },
          pb: hasBottomNav ? '80px' : 0,
        }}
      >
        {children}
        {hasBottomNav && <BottomNav />}
      </Box>
    </Box>
  );
}

export default MobileLayout;

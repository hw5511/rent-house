import { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import MobileLayout from '../components/common/mobile-layout.jsx';
import PageHeader from '../components/common/page-header.jsx';

const STORAGE_KEY = 'rent_house_notification_settings';

/**
 * getInitialSettings - localStorage에서 알림 설정을 불러옵니다.
 * @returns {object} 알림 설정 객체
 */
function getInitialSettings() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    isReservationEnabled: true,
    isChatEnabled: true,
    isPromoEnabled: false,
  };
}

/**
 * NotificationSettingsPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <NotificationSettingsPage />
 */
function NotificationSettingsPage() {
  const [settings, setSettings] = useState(getInitialSettings);

  const handleToggle = (key) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const notificationItems = [
    {
      key: 'isReservationEnabled',
      label: '예약 알림',
      description: '예약 확정, 변경, 취소 등 예약 관련 알림을 받습니다.',
    },
    {
      key: 'isChatEnabled',
      label: '채팅 알림',
      description: '호스트 또는 게스트로부터 새 메시지가 도착하면 알림을 받습니다.',
    },
    {
      key: 'isPromoEnabled',
      label: '프로모션 알림',
      description: '할인, 이벤트, 추천 숙소 등 프로모션 정보를 받습니다.',
    },
  ];

  return (
    <MobileLayout hasBottomNav={false}>
      <PageHeader title="알림 설정" />

      <Box sx={{ px: 1, py: 2 }}>
        <List>
          {notificationItems.map((item, index) => (
            <Box key={item.key}>
              <ListItem
                sx={{ py: 2, px: 2 }}
                secondaryAction={
                  <Switch
                    checked={settings[item.key]}
                    onChange={() => handleToggle(item.key)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#A25987',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        bgcolor: '#EDAAC6',
                      },
                    }}
                  />
                }
              >
                <ListItemText
                  primary={item.label}
                  secondary={item.description}
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        color: '#013D49',
                      },
                    },
                    secondary: {
                      sx: {
                        fontSize: '0.8rem',
                        color: '#999',
                        mt: 0.5,
                        pr: 4,
                      },
                    },
                  }}
                />
              </ListItem>
              {index < notificationItems.length - 1 && (
                <Divider sx={{ mx: 2 }} />
              )}
            </Box>
          ))}
        </List>
      </Box>
    </MobileLayout>
  );
}

export default NotificationSettingsPage;

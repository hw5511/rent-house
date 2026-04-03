import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import SendIcon from '@mui/icons-material/Send';
import MobileLayout from '../components/common/mobile-layout.jsx';
import PageHeader from '../components/common/page-header.jsx';
import { useAuth } from '../hooks/use-auth.jsx';
import { supabase } from '../utils/supabase.js';

/**
 * ChatRoomPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <ChatRoomPage />
 */
function ChatRoomPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [chatRoom, setChatRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /** 채팅방 정보 및 메시지 불러오기 */
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      /** 채팅방 정보 */
      const { data: roomData } = await supabase
        .from('chat_rooms')
        .select('*, spaces(id, title, space_images(image_url, display_order)), users!chat_rooms_host_id_fkey(nickname, profile_image)')
        .eq('id', roomId)
        .single();

      if (roomData) {
        setChatRoom(roomData);
      }

      /** 메시지 목록 */
      const { data: msgData } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_room_id', roomId)
        .order('created_at', { ascending: true });

      if (msgData) {
        setMessages(msgData);
      }

      /** 읽음 처리 */
      if (user) {
        await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('chat_room_id', roomId)
          .neq('sender_id', user.id);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [roomId, user]);

  /** 새 메시지 시 스크롤 */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const period = hours < 12 ? '오전' : '오후';
    const displayHours = hours % 12 || 12;
    return `${period} ${displayHours}:${minutes}`;
  };

  const getSpaceImage = (space) => {
    if (space?.space_images?.length > 0) {
      const sorted = [...space.space_images].sort((a, b) => a.display_order - b.display_order);
      return sorted[0].image_url;
    }
    return '';
  };

  const handleSend = async () => {
    if (!inputText.trim() || !user) return;

    const newMessage = {
      chat_room_id: Number(roomId),
      sender_id: user.id,
      content: inputText.trim(),
      is_read: false,
    };

    /** Supabase에 메시지 저장 */
    const { data, error } = await supabase
      .from('messages')
      .insert(newMessage)
      .select()
      .single();

    if (!error && data) {
      setMessages((prev) => [...prev, data]);
    } else {
      /** 오프라인 대비: 로컬에 추가 */
      setMessages((prev) => [
        ...prev,
        { ...newMessage, id: Date.now(), created_at: new Date().toISOString() },
      ]);
    }

    setInputText('');

    /** 자동 응답 시뮬레이션 (1초 후 호스트 더미 답변) */
    setTimeout(() => {
      const autoReply = {
        id: Date.now() + 1,
        chat_room_id: Number(roomId),
        sender_id: chatRoom?.spaces?.host_id || 0,
        content: '안녕하세요! 메시지 확인했습니다. 곧 답변 드리겠습니다.',
        is_read: false,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, autoReply]);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return (
      <MobileLayout hasBottomNav={false}>
        <PageHeader title="채팅" />
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#013D49' }} />
        </Box>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout hasBottomNav={false}>
      <PageHeader title={chatRoom?.users?.nickname || '채팅'} />

      {/* 숙소 정보 바 */}
      {chatRoom?.spaces && (
        <Box
          onClick={() => navigate(`/space/${chatRoom.spaces.id}`)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2,
            py: 1.2,
            bgcolor: '#f9f5f7',
            borderBottom: '1px solid #eee',
            cursor: 'pointer',
            '&:hover': { bgcolor: '#f5f0f3' },
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1,
              overflow: 'hidden',
              flexShrink: 0,
              bgcolor: '#eee',
            }}
          >
            {getSpaceImage(chatRoom.spaces) && (
              <Box
                component="img"
                src={getSpaceImage(chatRoom.spaces)}
                alt={chatRoom.spaces.title}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </Box>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#013D49' }}>
            {chatRoom.spaces.title}
          </Typography>
        </Box>
      )}

      {/* 메시지 영역 */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 2,
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          minHeight: 'calc(100vh - 56px - 52px - 64px)',
          maxHeight: 'calc(100vh - 56px - 52px - 64px)',
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography sx={{ fontSize: '0.85rem', color: '#ccc' }}>
              대화를 시작해보세요
            </Typography>
          </Box>
        ) : (
          messages.map((msg) => {
            const isSent = msg.sender_id === user?.id;
            return (
              <Box
                key={msg.id}
                sx={{
                  display: 'flex',
                  justifyContent: isSent ? 'flex-end' : 'flex-start',
                  mb: 0.5,
                }}
              >
                <Box sx={{ maxWidth: '75%' }}>
                  <Box
                    sx={{
                      px: 1.8,
                      py: 1,
                      borderRadius: isSent ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      bgcolor: isSent ? '#013D49' : '#f0f0f0',
                      color: isSent ? '#fff' : '#333',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.9rem', lineHeight: 1.5, wordBreak: 'break-word' }}>
                      {msg.content}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '0.7rem',
                      color: '#bbb',
                      mt: 0.3,
                      textAlign: isSent ? 'right' : 'left',
                    }}
                  >
                    {formatTime(msg.created_at)}
                  </Typography>
                </Box>
              </Box>
            );
          })
        )}
        <Box ref={messagesEndRef} />
      </Box>

      {/* 입력 영역 */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1,
          bgcolor: '#FDFFFB',
          borderTop: '1px solid #eee',
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="메시지를 입력하세요"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 6,
              bgcolor: '#f5f5f5',
            },
          }}
        />
        <IconButton
          onClick={handleSend}
          disabled={!inputText.trim()}
          sx={{
            bgcolor: '#013D49',
            color: '#fff',
            width: 40,
            height: 40,
            '&:hover': { bgcolor: '#025a6b' },
            '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#999' },
          }}
        >
          <SendIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>
    </MobileLayout>
  );
}

export default ChatRoomPage;

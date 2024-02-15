import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AuthProvider from './auth/AuthContext';
import SecureRoute from './auth/SecureRoute';
import Main from './layouts/Main';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import UnauthedOnlyRoute from './auth/UnauthedOnlyRoute';
import Matches from './pages/matches/Matches';
import Highlights from './pages/Highlights';
import Recordings from './pages/recordings/Recordings';
import Settings from './pages/settings/Settings';
import Match from './pages/match/Match';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ScoreBoard from './pages/match/tabs/Scoreboard';
import Timeline from './pages/match/tabs/Timeline';
import HighlightsTab from './pages/match/tabs/Highlights';
import RecordingVideoModal from './pages/recordings/RecordingVideoModal';
import { HighlightVideoModal } from './core/HighlightVideoModal';
import SummonerProvider from './SummonerContext';
import { WebSocketClient } from './webSocketClient';
import { WebSocketProvider } from './WebSocketContext';
import { EditorPage } from './pages/Editor';

export const wsClient = new WebSocketClient();
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <SummonerProvider>
            <WebSocketProvider client={wsClient}>
              <Routes>
                <Route path='login' element={<UnauthedOnlyRoute element={<Login/>}/>}/>
                <Route path='signup' element={<UnauthedOnlyRoute element={<SignUp/>}/>}/>

                <Route path='/' element={<SecureRoute element={<Main/>}/>}>
                  <Route index element={<SecureRoute element={<Home/>}/>}/>
                  <Route path='matches' element={<SecureRoute element={<Matches/>}/>}/>
                  <Route path='matches/:matchId' element={<SecureRoute element={<Match/>}/>}>
                    <Route index element={<SecureRoute element={<ScoreBoard/>}/>}/>
                    <Route path='timeline' element={<SecureRoute element={<Timeline/>}/>}/>
                    <Route path='highlights' element={<SecureRoute element={<HighlightsTab/>}/>}>
                      <Route path=':id' element={<SecureRoute element={<HighlightVideoModal viewGame={false}/>}/>}/>
                    </Route>
                  </Route>
                  <Route path='highlights' element={<SecureRoute element={<Highlights/>}/>}>
                    <Route path=':id' element={<SecureRoute element={<HighlightVideoModal/>}/>}/>
                  </Route>
                  <Route path='recordings' element={<SecureRoute element={<Recordings/>}/>}>
                    <Route path=':id' element={<SecureRoute element={<RecordingVideoModal/>}/>}/>
                  </Route>
                  <Route path='settings' element={<SecureRoute element={<Settings/>}/>}/>
                  <Route path='editor/:matchId/:recordingId' element={<SecureRoute element={<EditorPage/>}/>}/>
                </Route>
                
              </Routes>
            </WebSocketProvider>
          </SummonerProvider>
        </AuthProvider>
      </BrowserRouter>
  </QueryClientProvider>
  )
}

export default App
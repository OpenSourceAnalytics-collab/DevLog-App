import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LogProvider } from '@/context/LogContext.jsx';
import Layout from '@/components/Layout.jsx';
import Home from '@/pages/Home.jsx';
import EntryForm from '@/components/EntryForm.jsx';
import Search from '@/pages/Search.jsx';
import Stats from '@/pages/Stats.jsx';
import SecurityWrapper from '@/components/SecurityWrapper.jsx';

function App() {
  return (
    <SecurityWrapper>
      <LogProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/add" element={<EntryForm />} />
              <Route path="/search" element={<Search />} />
              <Route path="/stats" element={<Stats />} />
            </Routes>
          </Layout>
        </Router>
      </LogProvider>
    </SecurityWrapper>
  );
}

export default App;

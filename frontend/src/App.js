// App.js corrigido
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import Dashboard from './pages/Dashboard';
import EditTransaction from './pages/EditTransaction';
import Header from './components/Header/Header';
import Receitas from './pages/Receitas'
import Despesas from './pages/Despesas';
import Intro from './pages/Intro';
import PrivacyPage from './pages/Privacidade';
import TermsPage from './pages/TermsPage';
import ContactPage from './pages/ContactPage';
import WelcomePage from './pages/WelcomePage';
import TransactionForm from './components/UI/Modal/TransactionForm';
import Manage from './pages/Manage';





function App() {
  return (
    <Router>
      <FinanceProvider>
        <Routes>

          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit/:id" element={<EditTransaction />} />
          <Route path="/header" element={<Header />} />
          <Route path="/receitas" element={<Receitas />} />
          <Route path="/despesas" element={<Despesas />} />
          <Route path="/Intro" element={<Intro />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/" element={<WelcomePage />} />

          <Route path="/manage" element={<Manage />} />


        </Routes>
      </FinanceProvider>
    </Router>
  );
}

export default App;
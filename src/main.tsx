import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import Home from './pages/Home.tsx';
import CategoryView from './pages/CategoryView.tsx';
import ArticleView from './pages/ArticleView.tsx';
import About from './pages/About.tsx';
import Equipe from './pages/Equipe.tsx';
import Partenaires from './pages/Partenaires.tsx';
import MentionsLegales from './pages/MentionsLegales.tsx';
import Confidentialite from './pages/Confidentialite.tsx';
import Contact from './pages/Contact.tsx';
import Podcasts from './pages/Podcasts.tsx';
import Reportages from './pages/Reportages.tsx';
import Rubriques from './pages/Rubriques.tsx';
import Chroniques from './pages/Chroniques.tsx';
import ChroniqueView from './pages/ChroniqueView.tsx';
import NotFound from './pages/NotFound.tsx';

// Admin imports
import AdminLayout from './pages/admin/AdminLayout.tsx';
import AdminDashboard from './pages/admin/AdminDashboard.tsx';
import AdminSettings from './pages/admin/AdminSettings.tsx';
import AdminCategories from './pages/admin/AdminCategories.tsx';
import AdminArticles from './pages/admin/AdminArticles.tsx';
import AdminAds from './pages/admin/AdminAds.tsx';
import AdminLogin from './pages/admin/AdminLogin.tsx';
import AdminChroniques from './pages/admin/AdminChroniques.tsx';
import AdminPages from './pages/admin/AdminPages.tsx';
import AdminTeam from './pages/admin/AdminTeam.tsx';
import AdminPartners from './pages/admin/AdminPartners.tsx';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="chroniques" element={<AdminChroniques />} />
          <Route path="ads" element={<AdminAds />} />
          <Route path="pages" element={<AdminPages />} />
          <Route path="equipe" element={<AdminTeam />} />
          <Route path="partenaires" element={<AdminPartners />} />
        </Route>

        {/* Public App Routes */}
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="rubriques" element={<Rubriques />} />
          <Route path="rubriques/:id" element={<CategoryView />} />
          <Route path="article/:id" element={<ArticleView />} />
          <Route path="about" element={<About />} />
          <Route path="equipe" element={<Equipe />} />
          <Route path="partenaires" element={<Partenaires />} />
          <Route path="mentions-legales" element={<MentionsLegales />} />
          <Route path="confidentialite" element={<Confidentialite />} />
          <Route path="contact" element={<Contact />} />
          <Route path="podcasts" element={<Podcasts />} />
          <Route path="reportages" element={<Reportages />} />
          <Route path="chroniques" element={<Chroniques />} />
          <Route path="chronique/:id" element={<ChroniqueView />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

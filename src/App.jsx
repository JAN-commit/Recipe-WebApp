import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TitleNav from './Components/TitleNav';
import Footer from './Components/Footer';
import ScrollToTop from './Components/ScrollToTop';
import LandingPage from './Components/Pages/LandingPage';
import DashBoard from './Components/Pages/DashBoard';
import RecipeSingleView from './Components/Pages/RecipeSingleView';
import SearchRecipe from './Components/Pages/SearchRecipe';
import Login from './Components/Pages/Login';
import Signup from './Components/Pages/Signup';
import SearchLetter from './Components/Pages/SearchLetter';
import SearchIngredient from './Components/Pages/SearchIngredient';
import ViewCategory from './Components/Pages/ViewCategory';
import RecipeFavorite from './Components/Pages/RecipeFavorite';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-base-100 text-base-content">
        <ScrollToTop />
        <TitleNav />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/recipe/:id" element={<RecipeSingleView />} />
            <Route path="/search" element={<SearchRecipe />} />
            <Route path="/a-z" element={<SearchLetter />} />
            <Route path="/categories" element={<SearchIngredient />} />
            <Route path="/category" element={<ViewCategory />} />
            <Route path="/favorites" element={<RecipeFavorite />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
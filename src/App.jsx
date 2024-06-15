import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TitleNav from './Components/TitleNav';
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
import SideBar from './Components/SideBar';

function App() {
  return (
    <div className="flex">
      <Router>
        {/* <SideBar /> */}
        <div className="flex-1 md:ml-60">
          <TitleNav />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/Dashboard" element={<DashBoard />} />
            <Route path="/RecipeSingleView/:id" element={<RecipeSingleView />} />
            <Route path="/SearchRecipe" element={<SearchRecipe />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/SearchLetter" element={<SearchLetter />} />
            <Route path="/SearchIngredient" element={<SearchIngredient />} />
            <Route path="/ViewCategory" element={<ViewCategory />} />
            <Route path="/RecipeFavorite" element={<RecipeFavorite />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { Star, User, ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';

const RouterContext = React.createContext({ path: '/', navigate: () => { } });

const BrowserRouter = ({ children }) => {
  const [path, setPath] = useState('/');
  // Handle browser back button
  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (newPath) => {
    window.history.pushState({}, '', newPath);
    setPath(newPath);
  };

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

const Link = ({ to, children, className, ...props }) => {
  const { navigate } = React.useContext(RouterContext);
  const handleClick = (e) => {
    e.preventDefault();
    navigate(to);
  };
  return (
    <a href={to} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
};

const Routes = ({ children }) => {
  const { path } = React.useContext(RouterContext);
  // Very simple route matching
  let found = null;
  React.Children.forEach(children, (child) => {
    if (!found && child.props.path === path) {
      found = child;
    }
  });
  return found;
};

const Route = ({ element }) => element;


/* --- COMPONENT DEFINITIONS --- */

// 1. Nav Component
const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Navigation Links */}
      <ul className={`
        ${isOpen ? 'flex' : 'hidden'} 
        md:flex flex-col md:flex-row absolute md:static top-full left-0 right-0 
        bg-white md:bg-transparent shadow-md md:shadow-none p-4 md:p-0 z-20 
        gap-4 md:gap-8 text-lg font-bold text-[#495E57]
      `}>
        <li><Link to="/" className="hover:text-[#F4CE14] transition-colors">Home</Link></li>
        <li><Link to="/about" className="hover:text-[#F4CE14] transition-colors">About</Link></li>
        <li><Link to="/menu" className="hover:text-[#F4CE14] transition-colors">Menu</Link></li>
        <li><Link to="/booking" className="hover:text-[#F4CE14] transition-colors">Reservations</Link></li>
        <li><Link to="/order" className="hover:text-[#F4CE14] transition-colors">Order Online</Link></li>
        <li><Link to="/login" className="hover:text-[#F4CE14] transition-colors">Login</Link></li>
      </ul>
    </nav>
  );
};

// 2. CallToAction (Hero) Component
const CallToAction = () => {
  return (
    <header className="bg-[#495E57] px-4 py-8 md:py-16">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="md:w-1/2 text-white">
          <h1 className="text-5xl md:text-6xl font-serif text-[#F4CE14] mb-2">Little Lemon</h1>
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Chicago</h2>
          <p className="text-lg md:text-xl font-medium mb-8 max-w-sm leading-relaxed">
            We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
          </p>
          <Link to="/booking">
            <button className="bg-[#F4CE14] text-[#495E57] text-lg font-bold py-3 px-8 rounded-2xl hover:bg-[#ffe15d] transition-transform hover:scale-105 active:scale-95 shadow-lg">
              Reserve a Table
            </button>
          </Link>
        </div>
        <div className="md:w-1/2 relative h-64 md:h-80 w-full max-w-sm">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
            alt="Delicious Bruschetta"
            className="rounded-2xl shadow-2xl object-cover w-full h-full absolute md:-bottom-24 md:right-0 border-4 border-[#F4CE14]"
          />
        </div>
      </div>
    </header>
  );
};

// 3. Specials Component
const Specials = () => {
  const specialsData = [
    {
      id: 1,
      title: "Greek Salad",
      price: "$12.99",
      description: "The famous greek salad of crispy lettuce, peppers, olives and our Chicago style feta cheese, garnished with crunchy garlic and rosemary croutons.",
      image: "https://images.unsplash.com/photo-1606502973872-688743206d87?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      title: "Bruschetta",
      price: "$5.99",
      description: "Our Bruschetta is made from grilled bread that has been smeared with garlic and seasoned with salt and olive oil.",
      image: "https://images.unsplash.com/photo-1540914124281-342587941389?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      title: "Lemon Dessert",
      price: "$5.00",
      description: "This comes straight from grandma's recipe book, every last ingredient has been sourced and is as authentic as can be.",
      image: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <section className="py-24 px-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <h2 className="text-4xl font-extrabold text-[#333333]">This weeks specials!</h2>
        <button className="bg-[#F4CE14] text-[#495E57] font-bold py-3 px-8 rounded-xl hover:bg-[#ffe15d] transition-colors shadow-md">
          Online Menu
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {specialsData.map((item) => (
          <article key={item.id} className="bg-[#EDEFEE] rounded-t-2xl overflow-hidden shadow-lg flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
            <div className="h-48 overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold font-serif">{item.title}</h3>
                <span className="text-[#EE9972] font-bold text-lg">{item.price}</span>
              </div>
              <p className="text-[#495E57] mb-6 flex-grow text-sm leading-relaxed">{item.description}</p>
              <div className="mt-auto">
                <button className="font-bold text-sm flex items-center gap-2 hover:translate-x-1 transition-transform">
                  Order a delivery <ShoppingBag size={16} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

// 4. CustomersSay (Testimonials) Component
const CustomersSay = () => {
  const testimonials = [
    { id: 1, name: "Maria S.", rating: 5, review: "The Greek Salad was excellent!", img: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "John D.", rating: 4, review: "Loved the atmosphere and music.", img: "https://i.pravatar.cc/150?img=11" },
    { id: 3, name: "Anna K.", rating: 5, review: "Best Bruschetta in Chicago!", img: "https://i.pravatar.cc/150?img=5" },
    { id: 4, name: "Mike R.", rating: 5, review: "Service was incredibly fast.", img: "https://i.pravatar.cc/150?img=3" },
  ];

  return (
    <section className="bg-[#FBDABB] py-20 px-4 text-center md:text-left">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-[#333333] mb-12 text-center">Testimonials</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white p-6 rounded-xl shadow-md hover:-translate-y-2 transition-transform duration-300">
              <div className="flex justify-center md:justify-start mb-2 text-[#F4CE14]">
                {[...Array(t.rating)].map((_, i) => <Star key={i} fill="currentColor" size={16} />)}
              </div>
              <div className="flex items-center gap-4 mb-4">
                <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <h3 className="font-bold text-sm">{t.name}</h3>
              </div>
              <p className="text-gray-600 text-sm italic">"{t.review}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 5. Chicago (About) Component
const Chicago = () => {
  return (
    <section className="py-20 px-4 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2">
          <h1 className="text-5xl font-serif text-[#495E57] mb-2">Little Lemon</h1>
          <h2 className="text-3xl font-serif text-[#333] mb-6">Chicago</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Little Lemon is a charming neighborhood bistro that serves simple food and classic cocktails in a lively but casual environment. The restaurant features a locally-sourced menu with daily specials.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Founded by Mario and Adrian, two brothers who moved to Chicago to pursue their shared dream of owning a Mediterranean restaurant. Mario draws from his family's recipes in Italy, while Adrian handles the marketing.
          </p>
        </div>
        <div className="md:w-1/2 relative h-96 w-full">
          {/* Overlapping images effect */}
          <img
            src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=600&q=80"
            alt="Chefs Mario and Adrian"
            className="w-64 h-80 object-cover rounded-lg shadow-xl absolute top-0 right-0 z-10"
          />
          <img
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80"
            alt="Restaurant Interior"
            className="w-64 h-80 object-cover rounded-lg shadow-lg absolute top-12 right-24 border-8 border-white"
          />
        </div>
      </div>
    </section>
  );
};

// 6. Homepage Component
const Homepage = () => {
  return (
    <>
      <CallToAction />
      <Specials />
      <CustomersSay />
      <Chicago />
    </>
  );
};

// 7. BookingPage Placeholder
const BookingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border-t-8 border-[#495E57]">
        <h1 className="text-4xl font-serif text-[#495E57] mb-8 text-center">Reserve a Table</h1>
        <form className="space-y-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Date</label>
            <input type="date" className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4CE14]" />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Time</label>
            <select className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4CE14]">
              <option>17:00</option>
              <option>18:00</option>
              <option>19:00</option>
              <option>20:00</option>
              <option>21:00</option>
              <option>22:00</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Number of Guests</label>
            <input type="number" min="1" max="10" placeholder="1" className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4CE14]" />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Occasion</label>
            <select className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4CE14]">
              <option>Birthday</option>
              <option>Anniversary</option>
              <option>Other</option>
            </select>
          </div>
          <button className="w-full bg-[#F4CE14] text-[#495E57] font-bold text-xl py-4 rounded-xl hover:bg-[#ffe15d] transition-colors">
            Make Your Reservation
          </button>
        </form>
      </div>
    </div>
  );
};

// 8. Main Component
const Main = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<Chicago />} />
        <Route path="/menu" element={<Specials />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/order" element={<div className="h-96 flex items-center justify-center text-2xl font-serif">Order Online (Coming Soon)</div>} />
        <Route path="/login" element={<div className="h-96 flex items-center justify-center text-2xl font-serif">Login (Coming Soon)</div>} />
      </Routes>
    </main>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-[#495E57] text-white py-12 px-4 mt-auto">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
        <div className="flex flex-col justify-between h-full">
          <img
            src="https://placehold.co/100x150/495E57/F4CE14?text=Little+Lemon&font=playfair"
            alt="Little Lemon Footer Logo"
            className="h-24 w-auto object-contain self-start bg-white p-2 rounded-lg"
          />
          <p className="text-sm mt-4 text-gray-300">© 2023 Little Lemon</p>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4 text-[#F4CE14]">Doormat Navigation</h3>
          <ul className="space-y-2 text-sm text-gray-200">
            <li><Link to="/" className="hover:text-[#F4CE14]">Home</Link></li>
            <li><Link to="/about" className="hover:text-[#F4CE14]">About</Link></li>
            <li><Link to="/menu" className="hover:text-[#F4CE14]">Menu</Link></li>
            <li><Link to="/booking" className="hover:text-[#F4CE14]">Reservations</Link></li>
            <li><Link to="/order" className="hover:text-[#F4CE14]">Order Online</Link></li>
            <li><Link to="/login" className="hover:text-[#F4CE14]">Login</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4 text-[#F4CE14]">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-200">
            <li>123 Main Street<br />Chicago, IL 60601</li>
            <li>(312) 555-1234</li>
            <li>info@littlelemon.com</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4 text-[#F4CE14]">Social Media</h3>
          <ul className="space-y-2 text-sm text-gray-200">
            <li><a href="#" className="hover:text-[#F4CE14]">Facebook</a></li>
            <li><a href="#" className="hover:text-[#F4CE14]">Instagram</a></li>
            <li><a href="#" className="hover:text-[#F4CE14]">Twitter</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

// --- APP COMPONENT ---
export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 bg-white shadow-md py-4 px-6 md:px-12 flex justify-between items-center">
          <Link to="/">
            <img
              src="https://placehold.co/200x50/white/495E57?text=Little+Lemon&font=playfair"
              alt="Little Lemon Logo"
              className="h-10 w-auto"
            />
          </Link>
          <Nav />
        </header>

        <Main />

        <Footer />
      </div>
    </BrowserRouter>
  );
}
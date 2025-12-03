import React, { useState, useReducer, useEffect } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';

/* --- MOCK ROUTER SETUP (Keep this to make navigation work) --- */
const RouterContext = React.createContext({ path: '/', navigate: () => { } });

const BrowserRouter = ({ children }) => {
  const [path, setPath] = useState('/');
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
  return <a href={to} onClick={handleClick} className={className} {...props}>{children}</a>;
};

const Routes = ({ children }) => {
  const { path } = React.useContext(RouterContext);
  let found = null;
  React.Children.forEach(children, (child) => {
    if (!found && child.props.path === path) found = child;
  });
  return found;
};

const Route = ({ element }) => element;

/* --- API FALLBACK --- 
   This ensures the app doesn't crash if the index.html script fails to load.
   We try to use window.fetchAPI, otherwise we use this fallback.
*/
const seededRandom = function (seed) {
  var m = 2 ** 35 - 31;
  var a = 185852;
  var s = seed % m;
  return function () {
    return (s = s * a % m) / m;
  };
}

const fetchAPI = function (date) {
  // If the script in index.html worked, use it.
  if (window.fetchAPI) {
    return window.fetchAPI(date);
  }
  // Otherwise, use this fallback logic
  let result = [];
  let random = seededRandom(date.getDate());
  for (let i = 17; i <= 23; i++) {
    if (random() < 0.5) {
      result.push(i + ':00');
    }
    if (random() < 0.5) {
      result.push(i + ':30');
    }
  }
  return result;
};

const submitAPI = function (formData) {
  if (window.submitAPI) return window.submitAPI(formData);
  return true;
};


/* --- COMPONENTS --- */

// 1. Nav
const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="relative">
      <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
        {isOpen ? <X /> : <Menu />}
      </button>
      <ul className={`${isOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:static top-full left-0 right-0 bg-white md:bg-transparent shadow-md md:shadow-none p-4 md:p-0 z-20 gap-4 md:gap-8 text-lg font-bold text-[#495E57]`}>
        <li><Link to="/" className="hover:text-[#F4CE14]">Home</Link></li>
        <li><Link to="/about" className="hover:text-[#F4CE14]">About</Link></li>
        <li><Link to="/menu" className="hover:text-[#F4CE14]">Menu</Link></li>
        <li><Link to="/booking" className="hover:text-[#F4CE14]">Reservations</Link></li>
        <li><Link to="/order" className="hover:text-[#F4CE14]">Order Online</Link></li>
        <li><Link to="/login" className="hover:text-[#F4CE14]">Login</Link></li>
      </ul>
    </nav>
  );
};

// 2. BookingForm (Moved inside BookingPage normally, but kept separate for clarity)
// 2. BookingForm (Updated with Validation)
const BookingForm = ({ availableTimes, dispatch, submitForm }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(1);
  const [occasion, setOccasion] = useState("Birthday");

  // REACT VALIDATION LOGIC
  // We check if the form is valid on every render
  const isDateValid = date !== "";
  const isTimeValid = time !== "";
  const isGuestsValid = guests >= 1 && guests <= 10;
  const isOccasionValid = occasion !== "";

  // The button is enabled only if ALL checks pass
  const isFormValid = isDateValid && isTimeValid && isGuestsValid && isOccasionValid;

  const handleDateChange = (e) => {
    setDate(e.target.value);
    dispatch({ type: 'UPDATE_TIMES', payload: new Date(e.target.value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Double check before submitting
    if (isFormValid) {
      submitForm({ date, time, guests, occasion });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      {/* Date Field */}
      <div>
        <label htmlFor="res-date" className="block text-gray-700 font-bold mb-2">Choose date</label>
        <input
          type="date"
          id="res-date"
          value={date}
          onChange={handleDateChange}
          required // HTML5 Validation
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#F4CE14] outline-none invalid:border-red-500"
        />
      </div>

      {/* Time Field */}
      <div>
        <label htmlFor="res-time" className="block text-gray-700 font-bold mb-2">Choose time</label>
        <select
          id="res-time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required // HTML5 Validation
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#F4CE14] outline-none invalid:border-red-500"
        >
          <option value="">Select a time</option>
          {availableTimes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Guests Field */}
      <div>
        <label htmlFor="guests" className="block text-gray-700 font-bold mb-2">Number of guests</label>
        <input
          type="number"
          placeholder="1"
          min="1"  // HTML5 Validation
          max="10" // HTML5 Validation
          id="guests"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          required // HTML5 Validation
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#F4CE14] outline-none invalid:border-red-500"
        />
      </div>

      {/* Occasion Field */}
      <div>
        <label htmlFor="occasion" className="block text-gray-700 font-bold mb-2">Occasion</label>
        <select
          id="occasion"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
          required // HTML5 Validation
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#F4CE14] outline-none"
        >
          <option>Birthday</option>
          <option>Anniversary</option>
        </select>
      </div>

      {/* Submit Button with Dynamic Styling */}
      <button
        type="submit"
        disabled={!isFormValid} // React Validation: Disables button if invalid
        className={`w-full font-bold text-xl py-4 rounded-xl shadow-md transition-colors ${isFormValid
          ? "bg-[#F4CE14] text-[#495E57] hover:bg-[#ffe15d] cursor-pointer" // Valid Style
          : "bg-gray-300 text-gray-500 cursor-not-allowed" // Invalid Style
          }`}
        aria-label="On Click"
      >
        Make Your reservation
      </button>
    </form>
  );
};

// 3. BookingPage
const BookingPage = ({ availableTimes, dispatch, submitForm }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border-t-8 border-[#495E57]">
        <h1 className="text-4xl font-serif text-[#495E57] mb-8 text-center">Reserve a Table</h1>
        <BookingForm availableTimes={availableTimes} dispatch={dispatch} submitForm={submitForm} />
      </div>
    </div>
  );
};

// 4. ConfirmedBooking (Simple success page)
const ConfirmedBooking = () => {
  return (
    <div className="min-h-screen bg-[#495E57] flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-2xl text-center shadow-2xl max-w-md">
        <h1 className="text-4xl font-serif text-[#F4CE14] mb-4">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-8">We are looking forward to serving you.</p>
        <Link to="/">
          <button className="bg-[#F4CE14] text-[#495E57] font-bold py-3 px-8 rounded-xl hover:bg-[#ffe15d]">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

// 5. Main (Where the logic lives)
const Main = () => {
  const { navigate } = React.useContext(RouterContext);

  // REDUCER LOGIC
  const updateTimes = (state, action) => {
    switch (action.type) {
      case 'UPDATE_TIMES':
        // Step 2: Use fetchAPI to get times for the selected date
        return fetchAPI(action.payload);
      default:
        return state;
    }
  };

  const initializeTimes = () => {
    // Step 2: Use fetchAPI for today's date
    const today = new Date();
    return fetchAPI(today);
  };

  const [availableTimes, dispatch] = useReducer(updateTimes, [], initializeTimes);

  const submitForm = (formData) => {
    const success = submitAPI(formData);
    if (success) {
      navigate('/confirmed');
    }
  };

  return (
    <main>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<Chicago />} />
        <Route path="/menu" element={<Specials />} />
        <Route
          path="/booking"
          element={
            <BookingPage
              availableTimes={availableTimes}
              dispatch={dispatch}
              submitForm={submitForm}
            />
          }
        />
        <Route path="/confirmed" element={<ConfirmedBooking />} />
        <Route path="/order" element={<div className="h-96 flex items-center justify-center text-2xl font-serif">Order Online (Coming Soon)</div>} />
        <Route path="/login" element={<div className="h-96 flex items-center justify-center text-2xl font-serif">Login (Coming Soon)</div>} />
      </Routes>
    </main>
  );
};

// ... (Other components remain the same: CallToAction, Specials, CustomersSay, Chicago, Footer) ...
// For brevity, I am re-including the structure but condensed where unchanged.

const CallToAction = () => (
  <header className="bg-[#495E57] px-4 py-8 md:py-16">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="md:w-1/2 text-white">
        <h1 className="text-5xl md:text-6xl font-serif text-[#F4CE14] mb-2">Little Lemon</h1>
        <h2 className="text-3xl md:text-4xl font-serif mb-4">Chicago</h2>
        <p className="text-lg mb-8">We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</p>
        <Link to="/booking"><button className="bg-[#F4CE14] text-[#495E57] font-bold py-3 px-8 rounded-2xl hover:bg-[#ffe15d]">Reserve a Table</button></Link>
      </div>
      <div className="md:w-1/2"><img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80" alt="Food" className="rounded-2xl shadow-2xl h-64 w-full object-cover" /></div>
    </div>
  </header>
);

// 3. Specials Component (Updated with Real Images)
// 3. Specials Component (Fixed Images)
// 3. Specials Component (Final Image Fix)
const Specials = () => {
  const specialsData = [
    {
      name: 'Greek Salad',
      price: '$12.99',
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      name: 'Bruschetta',
      price: '$5.99',
      // New Image: High quality Bruschetta from Pexels
      image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      name: 'Lemon Dessert',
      price: '$5.00',
      image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    }
  ];

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-extrabold text-[#333333]">Specials</h2>
        <button className="bg-[#F4CE14] text-[#495E57] font-bold py-3 px-8 rounded-xl hover:bg-[#ffe15d] transition-colors shadow-md">
          Online Menu
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {specialsData.map((item, i) => (
          <article key={i} className="bg-[#EDEFEE] rounded-t-2xl shadow-lg overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
            <div className="h-48 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl">{item.name}</h3>
                <span className="text-[#EE9972] font-bold">{item.price}</span>
              </div>
              <p className="text-[#495E57] mb-6 flex-grow text-sm">
                Delicious traditional recipe served with a modern twist.
              </p>
              <button className="font-bold text-sm flex items-center gap-2 mt-auto hover:translate-x-1 transition-transform">
                Order <ShoppingBag size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};


const CustomersSay = () => <section className="bg-[#FBDABB] py-20 text-center"><h2 className="text-4xl font-extrabold mb-8">Testimonials</h2><p>Customer reviews coming soon...</p></section>;

const Chicago = () => <section className="py-20 px-4 max-w-5xl mx-auto"><h1 className="text-5xl font-serif text-[#495E57]">Little Lemon</h1><h2 className="text-3xl">Chicago</h2><p className="mt-4">A charming neighborhood bistro.</p></section>;

const Homepage = () => <><CallToAction /><Specials /><CustomersSay /><Chicago /></>;

const Footer = () => (
  <footer className="bg-[#495E57] text-white py-12 px-4 mt-auto">
    <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
      <div><img src="https://placehold.co/100x150/495E57/F4CE14?text=LL" alt="Logo" className="bg-white p-2 rounded" /></div>
      <div><h3 className="font-bold text-[#F4CE14] mb-4">Navigation</h3><ul><li><Link to="/">Home</Link></li><li><Link to="/booking">Reservations</Link></li></ul></div>
      <div><h3 className="font-bold text-[#F4CE14] mb-4">Contact</h3><p>123 Main St, Chicago</p></div>
      <div><h3 className="font-bold text-[#F4CE14] mb-4">Social</h3><p>Facebook / Instagram</p></div>
    </div>
  </footer>
);

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 bg-white shadow-md py-4 px-6 md:px-12 flex justify-between items-center">
          <Link to="/"><img src="https://placehold.co/200x50/white/495E57?text=Little+Lemon" alt="Logo" className="h-10" /></Link>
          <Nav />
        </header>
        <Main />
        <Footer />
      </div>
    </BrowserRouter>
  );
}
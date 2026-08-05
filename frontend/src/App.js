import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import { 
  ChefHat, 
  Utensils, 
  Wine, 
  Sparkles, 
  Users, 
  DollarSign, 
  Compass, 
  MessageSquare, 
  Check, 
  Loader2, 
  ArrowRight,
  TrendingUp,
  HeartHandshake
} from 'lucide-react';

export default function App() {
  // Backend API URL configuration
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  // Menu items list from backend
  const [menus, setMenus] = useState([]);
  const [menusLoading, setMenusLoading] = useState(true);

  // AI custom menu state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMenu, setAiMenu] = useState(null);
  const [aiError, setAiError] = useState('');
  
  // AI form inputs
  const [planner, setPlanner] = useState({
    guests: 6,
    budget: 900,
    occasion: 'Anniversary Dinner',
    dietary: ''
  });

  // Fetch standard menus on mount
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setMenusLoading(true);
        const response = await fetch(`${apiBaseUrl}/api/menus`);
        if (!response.ok) throw new Error('Failed to fetch menus');
        const data = await response.json();
        setMenus(data);
      } catch (err) {
        console.error('Error fetching menus:', err);
        // Standard static fallback list if API is offline
        setMenus([
          {
            id: '1',
            name: 'Mediterranean Sunset Dinner',
            description: 'A refreshing 3-course trip through coastal Greece and Italy. Features fresh herbs, lemon-infused olive oil, and premium wild seafood.',
            price: 120.00,
            category: 'Main',
            image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
          },
          {
            id: '2',
            name: 'Modern French Gastronomy',
            description: 'Classic French techniques redefined. Duck breast with black cherry reduction, truffle frites, and fine dark chocolate souffles.',
            price: 180.00,
            category: 'Main',
            image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80'
          },
          {
            id: '3',
            name: 'Signature Omakase & Sake Pairing',
            description: 'An intimate sushi selection curated live at your residence by Chef Reneey. Accompanied by rare artisanal small-brewery sakes.',
            price: 250.00,
            category: 'Special',
            image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80'
          }
        ]);
      } finally {
        setMenusLoading(false);
      }
    };
    fetchMenus();
  }, [apiBaseUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlanner(prev => ({ ...prev, [name]: value }));
  };

  const handleAiSubmit = async (e) => {
    e.preventDefault();
    setAiLoading(true);
    setAiError('');
    setAiMenu(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/ai/recommend-menu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guests: parseInt(planner.guests),
          budget: parseFloat(planner.budget),
          occasion: planner.occasion,
          dietary_restrictions: planner.dietary
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate custom menu');
      }

      const data = await response.json();
      setAiMenu(data);
    } catch (err) {
      console.error('AI Service Error:', err);
      setAiError(err.message || 'Connecting to backend custom menu planner failed.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-amber-500 selection:text-zinc-950">
      
      {/* Navbar header */}
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-zinc-950/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-amber-500" />
            <span className="serif-font text-2xl font-bold tracking-wider bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
              RENEEY'S KITCHEN
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#featured" className="text-sm font-medium text-zinc-400 hover:text-amber-400 transition-colors">Featured Menus</a>
            <a href="#planner" className="text-sm font-medium text-zinc-400 hover:text-amber-400 transition-colors">AI Event Planner</a>
            <a href="#philosophy" className="text-sm font-medium text-zinc-400 hover:text-amber-400 transition-colors">Our Philosophy</a>
          </nav>
          <a 
            href="#planner" 
            className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2 text-sm font-bold text-zinc-950 transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20"
          >
            Plan Custom Event
          </a>
        </div>
      </header>

      {/* Hero section */}
      <section className="relative overflow-hidden px-6 pt-24 pb-20 text-center lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_center,rgba(212,175,55,0.08),transparent_50%)]" />
        <div className="mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 text-xs font-semibold text-amber-400 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Exquisite Luxury In-Home Culinary Experiences</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl leading-none mb-8">
            Crafting Unforgettable Moments <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
              One Course at a Time
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-zinc-400 font-light leading-relaxed mb-10">
            Chef Reneey brings Michelin-grade gastronomy directly to your table. We design customized menus aligned with your palette, budget, and occasion.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a 
              href="#planner"
              className="w-full sm:w-auto rounded-full bg-amber-500 px-8 py-4 text-base font-bold text-zinc-950 transition-all hover:bg-amber-400 glow-btn"
            >
              Curate Custom Menu
            </a>
            <a 
              href="#featured"
              className="w-full sm:w-auto rounded-full border border-zinc-800 bg-zinc-900/50 px-8 py-4 text-base font-semibold text-zinc-300 transition-all hover:bg-zinc-900"
            >
              View Signature Menus
            </a>
          </div>
        </div>
      </section>

      {/* Featured Menus Section */}
      <section id="featured" className="mx-auto max-w-7xl px-6 py-24 border-t border-zinc-900">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Signature Curations</h2>
          <p className="text-zinc-400 max-w-xl mx-auto font-light">
            Explore a few of our pre-designed gourmet dining experiences, sourcing the finest seasonal ingredients.
          </p>
        </div>

        {menusLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
            <span className="ml-3 text-zinc-400">Loading chef menus...</span>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {menus.map((menu) => (
              <div 
                key={menu.id} 
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900/20 transition-all hover:border-amber-500/20 hover:bg-zinc-900/40"
              >
                <div>
                  <div className="h-56 overflow-hidden bg-zinc-950">
                    <img 
                      src={menu.image_url} 
                      alt={menu.name}
                      className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-90"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block rounded-full bg-amber-500/10 border border-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 mb-4">
                      {menu.category || 'Fine Dining'}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2">{menu.name}</h3>
                    <p className="text-zinc-400 text-sm font-light leading-relaxed">{menu.description}</p>
                  </div>
                </div>
                <div className="p-6 pt-0 flex justify-between items-center border-t border-zinc-900/40 mt-4">
                  <span className="text-zinc-500 text-xs">Starting at</span>
                  <span className="text-xl font-bold text-amber-400">${menu.price} / person</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* AI Event Planner Section */}
      <section id="planner" className="relative mx-auto max-w-7xl px-6 py-24 border-t border-zinc-900 bg-[radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.03),transparent_40%)]">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 text-xs font-semibold text-amber-400 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Menu Recommendation Engine</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">AI Custom Event Curator</h2>
          <p className="text-zinc-400 max-w-xl mx-auto font-light">
            Provide details about your guest count, total budget, and dietary preferences. Our AI sommelier and chef engine will construct an exquisite, personalized 3-course menu pairing.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Planner Form */}
          <div className="lg:col-span-5 rounded-3xl border border-zinc-900 bg-zinc-900/10 p-8 glass">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Utensils className="h-5 w-5 text-amber-500" />
              Event Specification
            </h3>
            <form onSubmit={handleAiSubmit} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-500 flex justify-between">
                  <span>Guests Count</span>
                  <span className="text-white">{planner.guests} Guests</span>
                </label>
                <input 
                  type="range" 
                  name="guests"
                  min="2" 
                  max="30" 
                  value={planner.guests} 
                  onChange={handleInputChange}
                  className="w-full accent-amber-500 bg-zinc-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-500 flex justify-between">
                  <span>Total Event Budget</span>
                  <span className="text-white">${planner.budget}</span>
                </label>
                <input 
                  type="range" 
                  name="budget"
                  min="300" 
                  max="5000" 
                  step="50"
                  value={planner.budget} 
                  onChange={handleInputChange}
                  className="w-full accent-amber-500 bg-zinc-800"
                />
                <div className="flex justify-between text-zinc-500 text-xs mt-1">
                  <span>Min: $300</span>
                  <span>Est: ${Math.round(planner.budget / planner.guests)}/guest</span>
                  <span>Max: $5000</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-500">Occasion / Theme</label>
                <select 
                  name="occasion"
                  value={planner.occasion}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-zinc-200 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Anniversary Dinner">Anniversary Celebration</option>
                  <option value="Intimate Birthday Feast">Intimate Birthday Feast</option>
                  <option value="Executive Dinner Board">Executive Dinner Board</option>
                  <option value="Romantic Proposal Night">Romantic Proposal Night</option>
                  <option value="Rustic Gastropub Reunion">Rustic Gastropub Reunion</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-500">Dietary Restrictions</label>
                <textarea 
                  name="dietary"
                  placeholder="e.g., Gluten-free, Vegetarian, peanut allergy, dairy avoidance..."
                  value={planner.dietary}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-zinc-200 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder:text-zinc-600 text-sm"
                />
              </div>

              <button 
                type="submit" 
                disabled={aiLoading}
                className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-4 text-center text-sm font-bold text-zinc-950 transition-all hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Consulting Chef AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Custom Pairing Menu
                  </>
                )}
              </button>
            </form>
          </div>

          {/* AI Result Dashboard Panel */}
          <div className="lg:col-span-7 h-full flex flex-col justify-stretch">
            {aiLoading && (
              <div className="flex h-96 flex-col justify-center items-center rounded-3xl border border-dashed border-amber-500/20 bg-zinc-900/5 p-8 text-center">
                <Loader2 className="h-10 w-10 text-amber-500 animate-spin mb-4" />
                <h4 className="text-xl font-bold mb-2">Curating Fine Dining Gastronomy</h4>
                <p className="text-zinc-500 text-sm max-w-sm">
                  Selecting top tier ingredients and selecting vintage wine pairings from our sommelier database matching your budget...
                </p>
              </div>
            )}

            {!aiLoading && !aiMenu && !aiError && (
              <div className="flex h-96 flex-col justify-center items-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/5 p-8 text-center">
                <ChefHat className="h-16 w-16 text-zinc-800 mb-4" />
                <h4 className="text-xl font-bold text-zinc-400 mb-2">Your AI Menu Will Appear Here</h4>
                <p className="text-zinc-600 text-sm max-w-sm">
                  Complete the event specification details on the left and submit to receive a customized chef-curated tasting menu.
                </p>
              </div>
            )}

            {aiError && (
              <div className="flex h-96 flex-col justify-center items-center rounded-3xl border border-amber-500/10 bg-amber-500/5 p-8 text-center text-zinc-400">
                <span className="text-amber-500 font-bold mb-2">Notice: Connection Error</span>
                <p className="text-sm max-w-sm mb-4">{aiError}</p>
                <div className="text-xs text-zinc-600 border border-zinc-800 rounded p-3 bg-zinc-950/60 max-w-md">
                  Ensure the FastAPI backend is running locally on port 8000 via: <br />
                  <code className="text-amber-500 font-mono">uvicorn app.main:app --reload</code>
                </div>
              </div>
            )}

            {aiMenu && (
              <div className="rounded-3xl border border-amber-500/30 p-8 shadow-2xl bg-zinc-950 glass-accent animate-in fade-in zoom-in duration-500">
                <div className="flex justify-between items-center border-b border-amber-500/10 pb-6 mb-6">
                  <div>
                    <span className="text-amber-500 text-xs font-bold tracking-widest uppercase">Custom Pairing Menu</span>
                    <h3 className="text-3xl font-extrabold text-white leading-none mt-1">{aiMenu.occasion || planner.occasion}</h3>
                  </div>
                  <div className="rounded-full bg-amber-500/10 px-4 py-2 border border-amber-500/20 text-center">
                    <span className="block text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">Budget Limit</span>
                    <span className="text-amber-400 font-bold">${planner.budget} Total</span>
                  </div>
                </div>

                {/* Appetizer */}
                <div className="relative pl-8 border-l border-amber-500/20 mb-8">
                  <div className="absolute -left-[9px] top-0 rounded-full bg-zinc-950 border border-amber-500 p-1">
                    <Utensils className="h-2 w-2 text-amber-500" />
                  </div>
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider">I. First Course — Appetizer</h4>
                  <h5 className="text-xl font-bold text-white mb-1">{aiMenu.appetizer?.name}</h5>
                  <p className="text-zinc-400 text-sm font-light mb-3">{aiMenu.appetizer?.description}</p>
                  <div className="inline-flex items-start gap-2 bg-zinc-900/60 rounded-xl p-3 border border-zinc-900 text-xs text-zinc-300">
                    <Wine className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-amber-400">{aiMenu.appetizer?.wine_pairing}</span>
                      <p className="text-zinc-400 text-[11px] mt-0.5">{aiMenu.appetizer?.wine_pairing_notes}</p>
                    </div>
                  </div>
                </div>

                {/* Main */}
                <div className="relative pl-8 border-l border-amber-500/20 mb-8">
                  <div className="absolute -left-[9px] top-0 rounded-full bg-zinc-950 border border-amber-500 p-1">
                    <Utensils className="h-2 w-2 text-amber-500" />
                  </div>
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider">II. Second Course — Main</h4>
                  <h5 className="text-xl font-bold text-white mb-1">{aiMenu.main?.name}</h5>
                  <p className="text-zinc-400 text-sm font-light mb-3">{aiMenu.main?.description}</p>
                  <div className="inline-flex items-start gap-2 bg-zinc-900/60 rounded-xl p-3 border border-zinc-900 text-xs text-zinc-300">
                    <Wine className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-amber-400">{aiMenu.main?.wine_pairing}</span>
                      <p className="text-zinc-400 text-[11px] mt-0.5">{aiMenu.main?.wine_pairing_notes}</p>
                    </div>
                  </div>
                </div>

                {/* Dessert */}
                <div className="relative pl-8 border-l border-amber-500/20 mb-8">
                  <div className="absolute -left-[9px] top-0 rounded-full bg-zinc-950 border border-amber-500 p-1">
                    <Utensils className="h-2 w-2 text-amber-500" />
                  </div>
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider">III. Third Course — Dessert</h4>
                  <h5 className="text-xl font-bold text-white mb-1">{aiMenu.dessert?.name}</h5>
                  <p className="text-zinc-400 text-sm font-light mb-3">{aiMenu.dessert?.description}</p>
                  <div className="inline-flex items-start gap-2 bg-zinc-900/60 rounded-xl p-3 border border-zinc-900 text-xs text-zinc-300">
                    <Wine className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-amber-400">{aiMenu.dessert?.wine_pairing}</span>
                      <p className="text-zinc-400 text-[11px] mt-0.5">{aiMenu.dessert?.wine_pairing_notes}</p>
                    </div>
                  </div>
                </div>

                {/* Budget Analysis */}
                <div className="mt-8 pt-6 border-t border-zinc-900 flex items-start gap-3 bg-amber-500/5 rounded-2xl p-4 border border-amber-500/10">
                  <TrendingUp className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Sommelier & Chef Analysis</h5>
                    <p className="text-zinc-400 text-xs font-light leading-relaxed">
                      {aiMenu.budget_analysis}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Philosophy section */}
      <section id="philosophy" className="mx-auto max-w-7xl px-6 py-24 border-t border-zinc-900 text-center">
        <div className="mx-auto max-w-3xl">
          <ChefHat className="mx-auto h-12 w-12 text-amber-500 mb-6" />
          <h2 className="text-4xl font-bold mb-6">Culinary Craftsmanship & Excellence</h2>
          <p className="text-zinc-400 text-lg font-light leading-relaxed mb-8">
            "Gastronomy is the art of using food to create happiness. Every client, every dietary request, and every kitchen setup deserves nothing less than perfection."
          </p>
          <span className="block serif-font text-amber-500 text-xl font-bold tracking-widest">— Chef Reneey</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 text-zinc-600 text-center text-sm">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Reneey's Kitchen Platform. All rights reserved.</p>
          <div className="flex gap-6 text-zinc-500">
            <span className="flex items-center gap-1"><Check className="h-4 w-4 text-amber-500" /> Fine Dining Guarantee</span>
            <span className="flex items-center gap-1"><Check className="h-4 w-4 text-amber-500" /> Full Liability Insurance</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

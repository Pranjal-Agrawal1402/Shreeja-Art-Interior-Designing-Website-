const LuminaeData = {
  projects: [
    { id: 1, title: "The Kova Penthouse", category: "Residential", location: "Manhattan, NY", year: 2024, tags: ["Minimalist","Warm","Urban"], color: "#C4A882", desc: "A 4,200 sq ft penthouse transformed around a single material story: raw linen, aged brass, and travertine." },
    { id: 2, title: "Salon Mercer", category: "Hospitality", location: "Paris, FR", year: 2024, tags: ["Art Deco","Bistro","Heritage"], color: "#8B7355", desc: "Revival of a 1930s salon interior — restored mosaics, velvet banquettes, and original zinc bar brought to light." },
    { id: 3, title: "Nakagawa Residence", category: "Residential", location: "Kyoto, JP", year: 2023, tags: ["Wabi-sabi","Japandi","Zen"], color: "#6B7B5E", desc: "A machiya townhouse redesigned in dialogue with its 140-year-old cedar bones — modern comfort, ancient calm." },
    { id: 4, title: "Atlas Wellness Club", category: "Wellness", location: "Dubai, UAE", year: 2023, tags: ["Spa","Biophilic","Luxury"], color: "#9E8873", desc: "10,000 sq ft of living walls, hammered copper, and warm stone creating a sanctuary from the city." },
    { id: 5, title: "Holt & Ware Gallery", category: "Cultural", location: "London, UK", year: 2023, tags: ["Gallery","Industrial","Clean"], color: "#7A7A7A", desc: "A Bermondsey warehouse repurposed as a contemporary art gallery with modular hanging systems and zoned light." },
    { id: 6, title: "Casa Ventana", category: "Residential", location: "Barcelona, ES", year: 2022, tags: ["Mediterranean","Coastal","Bold"], color: "#B85C38", desc: "A hillside home designed around its view — arched openings, handmade tile, and terracotta volumes at every turn." }
  ],
  services: [
    { id: 1, name: "Full Interior Design", icon: "◈", desc: "End-to-end design: concept through construction administration and final styling.", price: "From $45,000" },
    { id: 2, name: "Design Consultation", icon: "◇", desc: "Two-hour focused sessions — direction, colour, layout, and procurement guidance.", price: "From $750" },
    { id: 3, name: "Space Planning", icon: "⊞", desc: "Functional analysis and floor plan optimisation before any design begins.", price: "From $3,500" },
    { id: 4, name: "FF&E Procurement", icon: "◻", desc: "Full furniture, fixture, and equipment sourcing with trade access and logistics.", price: "From $8,000" },
    { id: 5, name: "3D Visualization", icon: "◈", desc: "Photorealistic renders and walkthroughs so you can see your space before it's built.", price: "From $2,200" },
    { id: 6, name: "Bespoke Furniture", icon: "◇", desc: "Custom joinery and furniture design, produced with our network of master craftspeople.", price: "From $5,000" }
  ],
  testimonials: [
    { name: "Priya Mehta", role: "Homeowner, Manhattan", quote: "Luminae didn't just design our apartment — they understood how we wanted to feel inside it. Every room has a quality of stillness we couldn't have articulated ourselves." },
    { name: "James Harlow", role: "GM, Salon Mercer Paris", quote: "The result is that rarest thing: a space that feels like it has always existed. Guests ask if the 1930s details are original. They are not. That is the compliment." },
    { name: "Akiko Nakagawa", role: "Homeowner, Kyoto", quote: "Working across cultures could have been difficult. Instead, Luminae took the time to genuinely understand what the house meant to our family. The design honours that completely." },
    { name: "Sofia Ruiz", role: "Director, Atlas Wellness", quote: "Our occupancy went up 34% in the quarter after the redesign. More importantly, guests linger. The space earned its own reputation." }
  ],
  team: [
    { name: "Mara Osei", role: "Founder & Principal Designer", bio: "Trained at Central Saint Martins and the Architectural Association, Mara founded Luminae after a decade leading interiors at Foster + Partners." },
    { name: "Kai Tanaka", role: "Senior Designer", bio: "Kai specialises in Japanese spatial philosophy and its translation into contemporary Western contexts." },
    { name: "Elena Voss", role: "Project Director", bio: "Elena manages the full delivery lifecycle, ensuring every project lands on time, on budget, and on concept." },
    { name: "Adil Rashid", role: "FF&E Specialist", bio: "Adil sources materials and furniture from 40+ countries, with specialist knowledge in sustainable and artisan supply chains." }
  ]
};

// localStorage helpers for contact/newsletter submissions
const Storage = {
  get(key) { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } },
  set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
  push(key, item) { const arr = Storage.get(key); arr.push({ ...item, id: Date.now(), date: new Date().toISOString() }); Storage.set(key, arr); }
};

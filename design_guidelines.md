# Lavadero Moderno - Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern service apps like Uber, Rappi, and booking platforms, emphasizing clean mobile-first design with professional service industry aesthetics.

## Core Design Elements

### Color Palette
**Primary Colors:**
- Brand Blue: 215 85% 35% (professional, trustworthy)
- Success Green: 145 70% 45% (confirmations, completed services)

**Light Mode:**
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Text Primary: 220 15% 15%
- Text Secondary: 220 10% 45%

**Dark Mode:**
- Background: 220 15% 8%
- Surface: 220 15% 12%
- Text Primary: 0 0% 95%
- Text Secondary: 220 10% 70%

**Accent Colors:**
- Warning Orange: 35 90% 55% (alerts, pending status)
- Neutral Gray: 220 10% 50% (borders, disabled states)

### Typography
- **Primary Font**: Inter (Google Fonts) - clean, modern sans-serif
- **Headings**: 600-700 weight, sizes 24px-32px
- **Body Text**: 400-500 weight, 14px-16px
- **Captions**: 400 weight, 12px-14px

### Layout System
**Tailwind Spacing Units**: Consistent use of 2, 4, 6, 8, 12, 16
- **Micro spacing**: p-2, m-2 (8px)
- **Standard spacing**: p-4, m-4 (16px)
- **Section spacing**: p-8, m-8 (32px)
- **Large spacing**: p-12, m-12 (48px)

### Component Library

**Navigation:**
- Bottom tab navigation for mobile (Customer app)
- Sidebar navigation for desktop (Admin panel)
- Clean header with service status indicators

**Forms:**
- Floating label inputs with subtle borders
- Rounded corners (rounded-lg)
- Focus states with brand blue accent
- Form validation with inline messaging

**Cards:**
- Service cards with subtle shadows (shadow-sm)
- Rounded corners (rounded-xl)
- Status indicators with color coding
- Clean typography hierarchy

**Buttons:**
- Primary: Brand blue background, white text
- Secondary: Outline style with brand blue border
- Success: Green background for confirmations
- Rounded-lg corners, adequate padding (px-6 py-3)

**Data Displays:**
- Clean tables for admin analytics
- Status badges with appropriate colors
- Progress indicators for service tracking
- Charts with consistent brand colors

**Overlays:**
- Modal dialogs with backdrop blur
- Toast notifications for status updates
- Confirmation dialogs for critical actions

### Mobile-First Considerations
- Touch-friendly button sizes (minimum 44px height)
- Swipe gestures for service management
- Clear visual hierarchy for small screens
- Optimized spacing for thumb navigation

### Service Industry Aesthetics
- Professional color scheme conveying trust
- Clean, minimalist interface reducing cognitive load
- Status-driven design with clear visual feedback
- Emphasis on efficiency and clarity over decoration

### Images
**Hero Images:** No large hero images required. Focus on functional interface elements.

**Service Images:**
- Small service type icons (washing, detailing, etc.)
- Before/after photo galleries in customer history
- Vehicle type illustrations for service selection
- Profile avatars for customers and staff

**Placement:**
- Service selection: Small icons alongside text
- History sections: Thumbnail galleries
- Admin dashboard: Data visualization graphics
- Onboarding: Simple illustration elements

### Key Design Principles
1. **Clarity First**: Every element serves a functional purpose
2. **Status Transparency**: Clear visual feedback for all service states
3. **Efficiency**: Minimal clicks to complete core tasks
4. **Professional Trust**: Clean, reliable visual language
5. **Mobile Optimization**: Thumb-friendly navigation and interactions
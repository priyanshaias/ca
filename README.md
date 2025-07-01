# Current Affairs Web App

A modern React TypeScript application for browsing and searching current affairs articles with a focus on Indian news and analysis.

## Features

### Comprehensive NewsCard Component

The app features a sophisticated NewsCard component that displays:

1. **Article Title** - With intelligent truncation for long titles (80 characters max)
2. **Date Display** - Formatted in readable format (e.g., "Jun 25, 2024")
3. **Topic & Sub-topic Badges** - Color-coded badges with different colors for each topic:
   - Economy: Green theme
   - Science & Tech: Blue theme
   - National: Red theme
   - International: Purple theme
   - Environment: Emerald theme
4. **Star Rating** - Importance level displayed as 1-5 stars with rating text
5. **Preview Text** - First 100 characters of detailed content with truncation
6. **Read Time Estimate** - Calculated based on 200 words per minute reading speed
7. **Notes Icon** - Yellow checkmark with indicator dot for articles with user notes
8. **Responsive Design** - Adapts to different screen sizes with hover effects

### Advanced Date Filter Component

A comprehensive date filtering system with multiple interaction methods:

1. **Date Range Slider** - HTML5 range input with custom styling for quick date selection
2. **Date Range Display** - Shows selected date range with day count
3. **Quick Preset Buttons** - "Last 7 days", "Last 30 days", "Last 3 months", "All time"
4. **Custom Date Picker** - Collapsible section with precise start/end date inputs
5. **Reset Functionality** - Clear all date filters with one click
6. **Active Filter Indicator** - Visual feedback showing current filter status
7. **Real-time Filtering** - Articles update instantly as date range changes

### Advanced Filter Components

#### SearchBar Component
A sophisticated search component with debounced functionality:

1. **Debounced Search** - 300ms delay to prevent excessive API calls
2. **Search Icon** - Visual indicator that changes to loading spinner during search
3. **Clear Functionality** - X button to clear search query instantly
4. **Search in Multiple Fields** - Searches title, content (detailed, prelims, mains, one-liner), and tags
5. **Loading State** - Visual feedback during search operations
6. **Form Submission** - Enter key triggers immediate search
7. **Customizable Placeholder** - Configurable placeholder text
8. **Search Status Indicator** - Shows current search query and status

#### FilterManager Component
A comprehensive filter management system that combines all filters:

1. **Combined Filter Logic** - AND logic across all filter types
2. **Real-time Statistics** - Shows total articles, filtered articles, active filters, and match rate
3. **Active Filter Display** - Lists all currently active filters with descriptions
4. **Reset All Functionality** - One-click reset of all filters
5. **Export Filter State** - Download current filter configuration as JSON
6. **Filter Logic Explanation** - Clear description of how filters work together
7. **No Results Handling** - Helpful message when no articles match filters

#### TopicFilter Component
A sophisticated topic filtering system with hierarchical selection:

1. **Multi-select Checkboxes** - Select multiple main topics simultaneously
2. **Dynamic Sub-topic Selection** - Expand topics to see and select sub-topics
3. **Article Counts** - Real-time count of articles per topic
4. **Select All/Clear All** - Quick actions to select or clear all topics
5. **Collapsible Interface** - Expand/collapse topics to manage space
6. **Active Filter Summary** - Shows currently selected topics and sub-topics
7. **Visual Feedback** - Clear indication of selected items

**Topics Available:**
- **Economy** (6 articles): Monetary Policy, Taxation, Growth, Trade, Employment, Digital Currency
- **Science & Tech** (8 articles): Space, Innovation, Telecom, Transport, Entrepreneurship
- **National** (6 articles): Judiciary, Defence, Health, Education
- **International** (6 articles): Trade, Defence, Energy, Diplomacy
- **Environment** (4 articles): Weather, Air Quality, Wildlife, Renewable Energy, Energy

#### ImportanceFilter Component
A range-based importance filtering system with visual feedback:

1. **Range Sliders** - Separate sliders for minimum and maximum importance (1-5)
2. **Visual Star Display** - Star rating showing selected importance range
3. **Quick Preset Buttons** - "High Priority" (4-5), "Medium" (2-3), "All" (1-5)
4. **Importance Level Breakdown** - Shows count of articles per importance level
5. **Real-time Updates** - Articles filter instantly as importance range changes
6. **Active Filter Indicator** - Visual feedback showing current filter status
7. **Reset Functionality** - Clear importance filters with one click

**Importance Levels:**
- **Critical (5 stars)**: 8 articles
- **High (4 stars)**: 6 articles
- **Medium (3 stars)**: 8 articles
- **Low (2 stars)**: 5 articles
- **Minimal (1 star)**: 3 articles

### Interactive Features

- **Hover Effects**: Cards lift up and show gradient border on hover
- **Clickable**: Entire card is clickable and navigates to article detail
- **Tag Display**: Shows up to 3 tags with "#" prefix and "+X more" indicator
- **Source Attribution**: Displays article source in footer
- **Dark Mode Support**: Fully compatible with light/dark themes

### Visual Enhancements

- **Gradient Border**: Animated gradient border appears on hover
- **Smooth Transitions**: All interactions have smooth CSS transitions
- **Icon Integration**: Uses SVG icons for date, time, and notes
- **Color-coded Topics**: Each topic has its own color scheme
- **Professional Typography**: Clean, readable font hierarchy
- **Custom Range Slider**: Styled HTML5 range input with hover effects

#### ArticleView Component
A comprehensive article display component with multiple view modes:

1. **4 View Modes** - Detailed, Prelims, Mains, and One-liner formats
2. **Toggle Buttons** - Visual buttons with icons and active state styling
3. **Keyboard Shortcuts** - D, P, M, O keys for quick mode switching
4. **Content Formatting** - Different typography and spacing for each mode
5. **Word Count Display** - Shows word count for current content
6. **Print Functionality** - Print-friendly styling with dedicated print button
7. **Memory Feature** - Remembers user's preferred view mode using localStorage
8. **Smooth Transitions** - Animated transitions between view modes
9. **Mobile Responsive** - Adapts to different screen sizes
10. **Article Metadata** - Displays source, importance, tags, and other details

**View Modes:**
- **Detailed (D)**: Full article content with proper paragraph formatting
- **Prelims (P)**: Concise format optimized for preliminary exam preparation
- **Mains (M)**: Comprehensive format for main examination preparation
- **One-liner (O)**: Highlighted single-line summary for quick reference

**Features:**
- **Smart Keyboard Handling**: Shortcuts only work when not typing in input fields
- **Visual Feedback**: Active mode highlighting and status indicators
- **Content Optimization**: Each mode has specific formatting for its purpose
- **Accessibility**: Proper ARIA labels and keyboard navigation support

#### ArticleDetailModal Component
A comprehensive modal for full article reading with advanced features:

1. **Modal Structure** - Full-screen overlay on mobile, centered modal on desktop
2. **Close Functionality** - Close button and ESC key support with backdrop click
3. **Scrollable Content** - Proper overflow handling for long articles
4. **View Mode Integration** - All 4 view mode toggles at the top
5. **Article Metadata** - Date, source, tags, importance display
6. **Share Functionality** - Copy article link to clipboard
7. **Print Option** - Print article with optimized layout
8. **Navigation** - Previous/next article navigation
9. **Notes Integration** - Notes panel with add/delete functionality
10. **Responsive Design** - Adapts to mobile and desktop layouts

**Modal Features:**
- **Full-Screen Experience**: Immersive reading with backdrop blur
- **Keyboard Navigation**: ESC to close, arrow keys for navigation
- **Notes Panel**: Toggle notes visibility with persistent storage
- **Quick Actions**: Share, print, and navigation buttons
- **Article Navigation**: Seamless browsing between articles
- **Mobile Optimized**: Full-screen on mobile, centered on desktop

**Notes System:**
- **Persistent Storage**: Notes saved per article in localStorage
- **Add Notes**: Textarea with Ctrl+Enter shortcut
- **Delete Notes**: Individual note deletion with confirmation
- **Timestamp Display**: Shows when each note was created
- **Empty State**: Helpful message when no notes exist

## Technology Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **date-fns** for date formatting
- **Responsive Design** with mobile-first approach

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the app

## Project Structure

```
src/
├── components/
│   ├── ArticleCard/          # Comprehensive NewsCard component
│   ├── Layout/              # Header, Sidebar, Layout components
│   └── UI/                  # Loading, Error, DateFilter, TopicFilter, ImportanceFilter, SearchBar, FilterManager, ArticleView, ArticleDetailModal components
├── contexts/                # Theme and News context providers
├── pages/                   # Main page components
├── types/                   # TypeScript interfaces
├── utils/                   # Utility functions and sample data
└── sample-data/             # JSON sample articles
```

## Sample Data

The app includes 30 realistic Indian current affairs articles covering:
- Economy (6 articles)
- Science & Tech (8 articles)
- National (6 articles)
- International (6 articles)
- Environment (4 articles)

Each article includes detailed content, prelims/mains pointers, tags, and importance ratings.

## Features

- **Real-time Search** with filters by topic and importance
- **Advanced Date Filtering** with multiple interaction methods
- **Multi-topic Selection** with hierarchical sub-topic filtering
- **Importance Range Filtering** with visual star ratings
- **Topic-based Navigation** with accurate article counts
- **Responsive Design** that works on all devices
- **Dark/Light Theme** toggle
- **Article Detail Pages** with full content
- **Importance-based Filtering** (1-5 star system)
- **Tag-based Organization** for easy discovery

## Pages

- **Home Page** (`/`) - Featured articles with integrated filtering and notes
- **Search Page** (`/search`) - Basic search functionality
- **Topics Page** (`/topics`) - Browse articles by topic

## Development

The app is built with modern React patterns including:
- Functional components with hooks
- TypeScript for type safety
- Context API for state management
- Custom hooks for reusable logic
- Responsive design principles
- Custom CSS for enhanced UI components

## Features

- **Integrated Sidebar**: All filtering and tools in one comprehensive sidebar
- **Advanced Filtering**: Search, date range, topic, sub-topic, and importance filters
- **Article Browsing**: View articles organized by topics and importance levels
- **Detailed Analysis**: Each article includes prelims, mains, and detailed analysis sections
- **Search & Filter**: Advanced search functionality with topic and importance filters
- **Responsive Design**: Modern UI built with Tailwind CSS
- **TypeScript**: Full type safety throughout the application
- **Notes System**: Add, edit, and manage notes for each article with persistent storage
- **Modal Reading**: Full-screen article reading with notes integration

## Tech Stack

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **date-fns** - Modern date utility library

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ArticleCard/    # Article preview component
│   └── Layout/         # Layout components (Header, Sidebar)
├── pages/              # Page components
│   ├── HomePage.tsx    # Home page with featured articles
│   ├── ArticleDetailPage.tsx  # Full article view
│   ├── SearchPage.tsx  # Search and filter page
│   └── TopicsPage.tsx  # Articles by topic
├── types/              # TypeScript type definitions
│   └── index.ts        # News article interfaces
├── App.tsx             # Main app component with routing
├── index.tsx           # React entry point
├── index.css           # Global styles with Tailwind
└── reportWebVitals.ts  # Performance monitoring
```

## TypeScript Interfaces

### NewsArticle
```typescript
interface NewsArticle {
  id: string;
  title: string;
  date: Date;
  topic: string;
  subTopic: string;
  importance: 1 | 2 | 3 | 4 | 5;
  content: {
    detailed: string;
    prelims: string;
    mains: string;
    oneLiner: string;
  };
  tags: string[];
  source: string;
}
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd current-affairs-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Features in Detail

### Article Importance Levels
- **Level 5 (Critical)** - Red indicator
- **Level 4 (High)** - Orange indicator  
- **Level 3 (Medium)** - Yellow indicator
- **Level 2 (Low)** - Blue indicator
- **Level 1 (Minimal)** - Gray indicator

### Content Sections
Each article includes:
- **One Liner**: Brief summary
- **Prelims**: Key points for preliminary exams
- **Mains**: Detailed analysis for main exams
- **Detailed**: Comprehensive analysis

### Search & Filter
- Search by keywords
- Filter by topic
- Filter by importance level
- Date range filtering (planned)

### Integrated Sidebar
- **Search Bar**: Real-time search with debounced input
- **Advanced Filters**: Toggle to show/hide comprehensive filtering options
- **Quick Topics**: One-click topic filtering with article counts
- **Quick Importance**: One-click importance level filtering
- **Notes Overview**: View articles with notes and toggle notes panel
- **Filter Manager**: Reset all filters and export filter state
- **Real-time Stats**: Live article counts and filtering results

### Notes System
- **Rich Text Editor**: Bold, italic, underline, bullet points, numbered lists
- **Formatting Options**: Text color, highlighting, font size controls
- **Auto-save**: Automatically saves every 30 seconds
- **Manual Save**: Save button for immediate saving
- **Undo/Redo**: Full undo/redo functionality with keyboard shortcuts
- **Multiple Notes**: Create and manage multiple notes per article
- **Export/Import**: Export notes as text files and import existing notes
- **Character Count**: Real-time character and word count
- **Version Tracking**: Track note versions and last edit times
- **Persistent Storage**: Notes saved per article in localStorage
- **Article-specific**: Each article has its own set of notes
- **Toggle Panel**: Click the pencil icon in the modal header to show/hide notes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Future Enhancements

- [ ] User authentication
- [ ] Bookmark articles
- [ ] Share functionality
- [ ] Mobile app
- [ ] API integration
- [ ] Real-time updates
- [ ] Dark mode
- [ ] Offline support 
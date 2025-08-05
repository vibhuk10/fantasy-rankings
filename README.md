# 🏈 Fantasy Football Rankings

A comprehensive fantasy football application featuring advanced analytics, player rankings, and interactive custom rankings with drag-and-drop functionality.

## ✨ Features

### 🎯 **Core Features**
- **Player Rankings**: Comprehensive rankings for QB, RB, WR, and TE positions
- **Custom Rankings**: Interactive drag-and-drop interface for personalized rankings
- **PDF Export**: Export your custom rankings to PDF
- **Real Data**: Based on 2024 NFL season statistics from Pro Football Reference and FantasyPros
- **ADP Integration**: Average Draft Position data from FantasyPros
- **Responsive Design**: Works on desktop and mobile devices

### 📊 **Data Sources**
- **Pro Football Reference**: 2024 season passing, rushing, and receiving statistics
- **FantasyPros**: Current ADP (Average Draft Position) data
- **Composite Scoring**: Advanced algorithms combining multiple metrics

### 🔧 **Technical Stack**
- **Frontend**: React, React Router, @dnd-kit (drag-and-drop)
- **Data**: CSV files for static hosting compatibility
- **Deployment**: Vercel static hosting
- **PDF Generation**: jsPDF and html2canvas

## 🚀 Quick Start

### Prerequisites
- Node.js 12+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/vibhuk10/fantasy-rankings.git
cd fantasy-football-rankings

# Install dependencies
cd frontend
npm install

# Start the development server
npm start
```

### Data Generation
```bash
# Generate ranking data from backend sources
node scripts/generate-csv-data.js

# Generate ADP data from FantasyPros
node scripts/generate-adp-data.js
```

## 📁 Project Structure

```
fantasy-football-rankings/
├── frontend/                 # React application
│   ├── public/
│   │   └── data/            # CSV data files
│   │       ├── qb-rankings.csv
│   │       ├── rb-rankings.csv
│   │       ├── wr-rankings.csv
│   │       ├── te-rankings.csv
│   │       └── adp-data.csv
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utilities (CSV loader, PDF export)
│   │   └── data/           # Position configurations
├── scripts/                 # Data generation scripts
│   ├── generate-csv-data.js
│   ├── generate-adp-data.js
│   └── deploy-to-vercel.js
├── backend/                 # Backend data processing (for CSV generation)
└── vercel.json             # Vercel deployment configuration
```

## 🎮 Usage

### **Custom Rankings (Default Page)**
- **URL**: `/` (home page)
- **Features**: 
  - Drag-and-drop player reordering
  - Position-specific tabs (QB, RB, WR, TE)
  - Reset to ADP functionality
  - PDF export capability
  - Local storage persistence

### **Player Rankings**
- **URL**: `/rankings`
- **Features**:
  - Sortable data tables
  - Position filtering
  - Comprehensive player statistics
  - Search and filter functionality

## 📊 Data Metrics

### **QB Metrics**
- Pass Attempts, Yards, TDs
- Completion Percentage
- Yards per Attempt
- Rushing Yards and TDs
- Fantasy Points Per Game
- Composite Score

### **RB Metrics**
- Rush Attempts, Yards, TDs
- Yards per Rush
- Targets and Receptions
- Receiving Yards and TDs
- Catch Rate
- Fantasy Points Per Game

### **WR Metrics**
- Targets and Receptions
- Receiving Yards and TDs
- Yards per Reception
- Catch Rate
- Fantasy Points Per Game

### **TE Metrics**
- Targets and Receptions
- Receiving Yards and TDs
- Yards per Reception
- Catch Rate
- Fantasy Points Per Game

## 🚀 Deployment

### **Vercel Deployment**
This application is optimized for Vercel static hosting:

1. **Connect Repository**: Link your GitHub repo to Vercel
2. **Build Settings**: 
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/build`
3. **Environment Variables**: None required (static files)

### **Deployment Benefits**
- ✅ **No Backend Complexity**: Uses static CSV files
- ✅ **Fast Loading**: Static file serving
- ✅ **Reliable**: No serverless function issues
- ✅ **Easy Updates**: Regenerate CSV files for fresh data

### **Manual Deployment**
```bash
# Generate fresh data
node scripts/generate-csv-data.js
node scripts/generate-adp-data.js

# Build for production
cd frontend
npm run build

# Deploy to Vercel
vercel --prod
```

## 🔄 Data Updates

### **Updating Player Rankings**
```bash
# Run the ranking data generation script
node scripts/generate-csv-data.js
```

### **Updating ADP Data**
```bash
# Run the ADP data generation script
node scripts/generate-adp-data.js
```

### **Verifying Data**
```bash
# Check deployment readiness
node scripts/deploy-to-vercel.js
```

## 🛠 Development

### **Local Development**
```bash
# Start frontend development server
cd frontend
npm start

# The app will be available at http://localhost:3000
```

### **Data Generation**
```bash
# Generate all CSV data
node scripts/generate-csv-data.js
node scripts/generate-adp-data.js
```

### **Testing**
- Test drag-and-drop functionality
- Verify PDF export
- Check localStorage persistence
- Test responsive design

## 📈 Performance

### **Optimizations**
- **Static Data**: CSV files load faster than API calls
- **Lazy Loading**: Components load on demand
- **Caching**: Browser caching for static assets
- **Compression**: Vercel automatically compresses static files

### **Data Size**
- **QB Rankings**: ~50 players, 3.5KB
- **RB Rankings**: ~50 players, 3.4KB
- **WR Rankings**: ~50 players, 3.4KB
- **TE Rankings**: ~50 players, 3.4KB
- **ADP Data**: ~216 players, 7.7KB

## 🐛 Troubleshooting

### **Common Issues**

**CSV Files Not Loading**
```bash
# Regenerate CSV files
node scripts/generate-csv-data.js
node scripts/generate-adp-data.js
```

**Build Failures**
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Deployment Issues**
```bash
# Check deployment readiness
node scripts/deploy-to-vercel.js
```

### **Data Issues**
- Ensure all CSV files exist in `frontend/public/data/`
- Verify CSV format is correct
- Check for missing dependencies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Pro Football Reference**: For comprehensive NFL statistics
- **FantasyPros**: For ADP data
- **React Community**: For excellent libraries and tools
- **Vercel**: For seamless deployment platform

---

**🏈 Built for Fantasy Football Enthusiasts**  
*Advanced analytics and rankings for the 2024 NFL season* 
# Fantasy Football Player Rankings

A full-stack fantasy football player ranking application that uses real 2024 NFL season data to generate predictive rankings for QBs, RBs, WRs, and TEs.

## 🏈 Features

- **Real 2024 Season Data**: Scrapes and processes actual 2024 NFL season statistics from Pro Football Reference and FantasyPros
- **Predictive Rankings**: Uses composite scoring algorithms to rank players based on multiple metrics
- **Interactive Tables**: Sortable, searchable, and paginated player rankings by position
- **Comprehensive Metrics**: Position-specific statistics including volume, efficiency, and scoring metrics
- **Caching System**: Caches scraped data to avoid repeated API calls during development

## 📊 Data Sources

### 2024 Season Statistics
- **Pro Football Reference**: Passing, rushing, and receiving statistics
- **FantasyPros**: Fantasy points and PPG data
- **NFLfastR**: Advanced metrics (EPA, air yards, route participation)

### Metrics by Position

#### Quarterbacks (QB)
- Pass Attempts, Yards, TDs, INTs
- Completion Percentage, Yards per Attempt
- Rushing Yards and TDs
- Fantasy Points Per Game
- Composite Score

#### Running Backs (RB)
- Rush Attempts, Yards, TDs
- Yards per Rush
- Targets, Receptions, Receiving Yards/TDs
- Catch Rate
- Fantasy Points Per Game
- Composite Score

#### Wide Receivers (WR)
- Targets, Receptions, Yards, TDs
- Yards per Reception
- Catch Rate
- Fantasy Points Per Game
- Composite Score

#### Tight Ends (TE)
- Targets, Receptions, Yards, TDs
- Yards per Reception
- Catch Rate
- Fantasy Points Per Game
- Composite Score

## 🚀 Quick Start

### Prerequisites
- Node.js (version 12 or higher)
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fantasy-football-rankings
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   The backend will run on `http://localhost:5000`

2. **Start the frontend application**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on `http://localhost:3000`

3. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 🏗️ Architecture

### Backend (Node.js + Express)

#### Core Components
- **DataFetcher**: Scrapes and processes 2024 season data from multiple sources
- **RankingEngine**: Implements position-specific ranking algorithms
- **API Routes**: RESTful endpoints for each position

#### Key Files
- `server.js`: Main Express server setup
- `services/dataFetcher.js`: Web scraping and data processing
- `utils/rankingEngine.js`: Ranking algorithms and composite scoring
- `routes/`: Position-specific API endpoints

#### API Endpoints
- `GET /api/health`: Health check
- `GET /api/qb`: QB rankings
- `GET /api/rb`: RB rankings
- `GET /api/wr`: WR rankings
- `GET /api/te`: TE rankings
- `GET /api/{position}/:id`: Specific player by ID
- `GET /api/{position}/team/:team`: Players by team

### Frontend (React)

#### Core Components
- **App**: Main application component with position selection
- **PlayerRankings**: Fetches and displays player data
- **RankingsTable**: Interactive table with sorting and filtering
- **Header**: Application header
- **LoadingSpinner**: Loading state indicator
- **ErrorMessage**: Error handling component

#### Key Features
- Position-based navigation
- Sortable columns
- Search functionality
- Pagination
- Responsive design

## 📈 Ranking Algorithm

### Composite Scoring System

The application uses weighted composite scoring based on position-specific metrics:

#### QB Scoring Weights
- Pass Attempts: 15% (Volume)
- Completion Percentage: 10% (Efficiency)
- Yards per Attempt: 15% (Efficiency)
- Pass TDs: 20% (Scoring)
- Rushing Yards: 15% (Rushing upside)
- Rushing TDs: 10% (Rushing scoring)
- Fantasy PPG: 15% (Overall production)

#### RB Scoring Weights
- Rush Attempts: 20% (Volume)
- Yards per Rush: 15% (Efficiency)
- Rush TDs: 20% (Scoring)
- Targets: 15% (Receiving volume)
- Catch Rate: 10% (Receiving efficiency)
- Fantasy PPG: 20% (Overall production)

#### WR Scoring Weights
- Targets: 20% (Volume)
- Receptions: 15% (Volume)
- Yards per Reception: 15% (Efficiency)
- Receiving TDs: 20% (Scoring)
- Catch Rate: 10% (Efficiency)
- Fantasy PPG: 20% (Overall production)

#### TE Scoring Weights
- Targets: 20% (Volume)
- Receptions: 15% (Volume)
- Yards per Reception: 15% (Efficiency)
- Receiving TDs: 20% (Scoring)
- Catch Rate: 10% (Efficiency)
- Fantasy PPG: 20% (Overall production)

## 🔧 Development

### Data Fetching
The application automatically fetches real 2024 season data on first run and caches it locally. To refresh the data:

1. Delete the cache file: `backend/data/cache/2024_season_data.json`
2. Restart the backend server

### Adding New Metrics
1. Update the data fetcher in `backend/services/dataFetcher.js`
2. Add the metric to the ranking algorithm in `backend/utils/rankingEngine.js`
3. Update the frontend table configuration in `frontend/src/components/RankingsTable.js`

### Customizing Rankings
Modify the scoring weights in `backend/utils/rankingEngine.js` to adjust the importance of different metrics.

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start**
   - Check Node.js version (requires 12+)
   - Ensure all dependencies are installed: `npm install`
   - Check port 5000 is available

2. **Frontend won't start**
   - Check Node.js version (requires 12+)
   - Ensure all dependencies are installed: `npm install`
   - Check port 3000 is available

3. **No data displayed**
   - Check backend is running on port 5000
   - Check browser console for CORS errors
   - Verify API endpoints are responding

4. **Data fetching errors**
   - Check internet connection
   - Verify data source websites are accessible
   - Check for rate limiting from data sources

### Debug Mode
Enable detailed logging by setting environment variables:
```bash
DEBUG=true npm start
```

## 📝 API Documentation

### Response Format
All API endpoints return JSON in the following format:
```json
{
  "success": true,
  "data": [...],
  "message": "Description of response"
}
```

### Error Format
```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Pro Football Reference**: For comprehensive NFL statistics
- **FantasyPros**: For fantasy football data
- **NFLfastR**: For advanced analytics
- **React Table**: For the interactive table component

---

**Note**: This application uses real 2024 NFL season data for ranking purposes. All statistics are from the 2024 regular season (Weeks 1-18) and are used to generate predictive rankings for the 2025 fantasy football season. 
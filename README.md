# Railway AI Dashboard - Decision Support System

A production-ready, AI-powered railway decision-support dashboard built with Next.js 14, TypeScript, and modern web technologies. This system provides real-time monitoring, intelligent recommendations, what-if scenario analysis, and comprehensive audit trails for railway operations.

![Railway Dashboard](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)

## 🚀 Features

### 📊 Dashboard & Monitoring
- **Real-time KPI tracking** - Throughput, delays, utilization, AI acceptance rates
- **Interactive charts** - Performance trends, comparisons, and analytics
- **System health monitoring** - Network status, model performance, alerts
- **Train status overview** - Live tracking of all active trains

### 🤖 AI-Powered Recommendations
- **Intelligent optimization** - ML-driven suggestions for network improvements
- **Alternative options** - Multiple solutions with risk/benefit analysis
- **Confidence scoring** - AI prediction reliability indicators
- **Impact assessment** - Projected outcomes for each recommendation

### 🔬 What-If Analysis
- **Scenario simulation** - Test impact of delays, rerouting, and other changes
- **Interactive modeling** - Visual before/after comparisons
- **Timeline projections** - See how scenarios unfold over time
- **Risk assessment** - Safety and performance impact analysis

### 📋 Audit & Compliance
- **Complete audit trail** - Every decision and action logged
- **Decision tracking** - Who, what, when, why for all recommendations
- **Impact metrics** - Actual vs predicted outcomes
- **Compliance reporting** - Regulatory and safety documentation

### 💬 AI Chat Assistant
- **Natural language interface** - Ask questions about system status
- **Contextual responses** - Understands current system state
- **Action suggestions** - Recommends next steps (no direct control)
- **Floating widget** - Available on every page

### 📈 Analytics & Insights
- **Performance analytics** - Historical trends and patterns
- **Model monitoring** - AI accuracy and effectiveness tracking
- **Comparative analysis** - Human vs AI decision outcomes
- **Predictive insights** - Early warning systems

## 🏗️ Architecture

### Frontend Stack
- **Next.js 14** with App Router for modern React development
- **TypeScript** for type safety and developer experience
- **TailwindCSS + shadcn/ui** for consistent, accessible design
- **Framer Motion** for smooth animations and transitions
- **Zustand** for lightweight, reactive state management
- **Recharts** for interactive data visualizations

### Backend Integration Points
- **Modular service adapters** for easy ML service integration
- **RESTful API design** with comprehensive error handling
- **Mock data services** for development and demonstration
- **Environment-based configuration** for dev/staging/production

### Key Directories
```
railway-dashboard/
├── app/                    # Next.js 14 App Router pages
├── components/             # Reusable UI components
├── services/              # API adapters and mock data
├── stores/                # Zustand state management
├── lib/                   # Utilities and type definitions
└── public/                # Static assets
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd railway-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Mock Data & APIs

The application includes comprehensive mock data for development and demonstration:

### Mock Data Location
All mock data is centralized in `services/mockData.ts`:

- **4 sample trains** with different statuses (on-time, delayed, stopped, at-platform)
- **1 active recommendation** with 2 alternatives demonstrating the decision flow
- **Complete KPI set** (throughput, delay, utilization, acceptance rate) with trends
- **3 audit log entries** showing decision history and outcomes
- **Chat conversation examples** with various intents and responses
- **Simulation results** with timeline data and impact projections

### API Endpoints

All mock APIs follow RESTful conventions and return typed JSON responses:

#### GET `/api/trains`
Returns list of active trains with status, delays, and passenger information.

**Response Example:**
```json
{
  "data": [
    {
      "id": "train-001",
      "number": "IC-2847",
      "origin": "London Paddington",
      "destination": "Cardiff Central",
      "delayMinutes": 12,
      "status": "delayed",
      "passengers": 287
    }
  ],
  "success": true,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### GET `/api/recommendations`
Returns AI-generated optimization recommendations.

#### POST `/api/recommendations`
Generates new recommendations based on current system state.

**Request Example:**
```json
{
  "systemState": {
    "trains": [...],
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

#### POST `/api/predictions`
Generates delay predictions for specified trains.

**Request Example:**
```json
{
  "trainIds": ["train-001", "train-002"],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### POST `/api/simulate`
Runs what-if scenario simulations.

**Request Example:**
```json
{
  "trainId": "train-001",
  "delayMinutes": 15,
  "rerouteTo": "Oxford",
  "scenarioName": "Signal failure simulation"
}
```

**Response Example:**
```json
{
  "data": {
    "scenarioId": "sim-12345",
    "projectedKPIs": {
      "delay": 6.2,
      "throughput": 148,
      "safety": "high"
    },
    "chartData": [
      {"time": "09:00", "delay": 8.4, "throughput": 142},
      {"time": "09:15", "delay": 7.8, "throughput": 144}
    ],
    "recommendations": [
      "Implement rerouting for IC-2847 immediately",
      "Monitor REG-4401 for potential cascading delays"
    ]
  }
}
```

#### GET/POST `/api/audit`
Manages audit trail entries for compliance and decision tracking.

#### GET/POST `/api/chat`
Handles chatbot interactions with context-aware responses.

## 🔧 Production Integration

### Switching from Mock to Production APIs

The application is designed for seamless transition from mock to production services:

1. **Set environment variable**
   ```bash
   NEXT_PUBLIC_API_BASE=https://your-production-api.com/api
   ```

2. **Update service adapters**
   Each service adapter in `services/` has TODO comments indicating where to integrate production endpoints:

   ```typescript
   // services/predictionAdapter.ts
   export const getPredictionsForTrains = async (trains: Train[]): Promise<Prediction[]> => {
     // TODO: Replace with actual ML prediction endpoint
     // const predictions = await mlPredictionService.getPredictions({
     //   trainIds: trains.map(t => t.id),
     //   currentTime: new Date().toISOString(),
     //   modelVersion: 'v2.1.3'
     // });
     
     const response = await apiPost<ApiResponse<Prediction[]>>('/predictions', {
       trainIds: trains.map(train => train.id),
       timestamp: new Date().toISOString()
     });
     
     return response.data;
   };
   ```

### Required Production Services

To fully integrate with production ML systems, implement these endpoints:

#### ML Prediction Service
- **Endpoint**: `/predictions`
- **Purpose**: Generate delay predictions using trained ML models
- **Input**: Train data, current conditions, network state
- **Output**: Delay forecasts with confidence scores

#### Optimization Service (GA/NSGA-II)
- **Endpoint**: `/recommendations`  
- **Purpose**: Multi-objective optimization for network efficiency
- **Input**: System state, objectives, constraints
- **Output**: Pareto-optimal recommendations with alternatives

#### Simulation Engine
- **Endpoint**: `/simulate`
- **Purpose**: Discrete event simulation for what-if analysis
- **Input**: Scenario parameters, network model, time horizon
- **Output**: Projected impacts with timeline data

#### Audit Database
- **Purpose**: Immutable audit trail with cryptographic integrity
- **Features**: Hash chains, digital signatures, compliance reporting
- **Storage**: Append-only with retention policies

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   - Push your code to GitHub/GitLab/Bitbucket
   - Import the project in Vercel dashboard
   - Vercel will auto-detect Next.js configuration

2. **Configure Environment Variables**
   In Vercel dashboard, add these environment variables:
   ```
   NEXT_PUBLIC_API_BASE=https://your-production-api.com/api
   ```

3. **Deploy**
   - Vercel automatically deploys on every push to main branch
   - Preview deployments created for pull requests
   - Production deployment available at your custom domain

### Alternative Deployment Options

#### Docker Deployment
```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder  
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

#### AWS/Azure/GCP Deployment
- Use platform-specific Next.js deployment guides
- Configure environment variables in platform dashboard
- Set up CI/CD pipelines for automated deployments
- Configure CDN for static assets

## 🔒 Security & Compliance

### Security Features
- **Input validation** on all API endpoints
- **CORS configuration** for cross-origin requests
- **Rate limiting** to prevent abuse
- **Error handling** without information leakage

### Audit & Compliance
- **Immutable audit logs** for all decisions and actions
- **Decision traceability** with actor, timestamp, and rationale
- **Impact tracking** comparing predicted vs actual outcomes
- **Compliance reporting** for regulatory requirements

### Production Security Checklist
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure authentication (NextAuth.js recommended)
- [ ] Set up role-based access control
- [ ] Implement API rate limiting
- [ ] Configure logging and monitoring
- [ ] Set up backup and disaster recovery
- [ ] Perform security audits

## 📚 API Documentation

### Request/Response Format
All APIs follow consistent patterns:

**Successful Response:**
```json
{
  "data": { /* response payload */ },
  "success": true,
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00Z",
  "metadata": {
    "total": 10,
    "page": 1,
    "processingTime": "0.3s"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Detailed error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T10:30:00Z",
  "details": { /* additional error context */ }
}
```

### Authentication (Production)
When implementing authentication, use these patterns:

```typescript
// Add to API routes
const session = await getServerSession(authOptions);
if (!session) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

## 🧪 Testing

### Running Tests
```bash
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests  
npm run test:coverage # Generate coverage report
```

### Testing Strategy
- **Unit tests** for utility functions and components
- **Integration tests** for API routes and data flows
- **E2E tests** for critical user workflows
- **Mock service tests** to ensure API compatibility

## 🛠️ Development

### Code Structure
- **Modular design** with clear separation of concerns
- **Type safety** throughout with comprehensive TypeScript definitions
- **Reusable components** following atomic design principles
- **Consistent styling** with Tailwind CSS and shadcn/ui

### Development Workflow
1. Create feature branch from main
2. Implement changes with tests
3. Run linting and type checking
4. Create pull request with description
5. Review and merge after CI passes

### Adding New Features
1. **Define types** in `lib/types.ts`
2. **Add mock data** in `services/mockData.ts`  
3. **Create service adapter** in `services/`
4. **Build UI components** in `components/`
5. **Create page** in `app/`
6. **Add navigation** in `components/layout/Sidebar.tsx`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js team** for the excellent React framework
- **Tailwind CSS** for the utility-first CSS framework
- **shadcn/ui** for beautiful, accessible components
- **Railway industry experts** for domain knowledge and requirements

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation and examples
- Review the TODO comments in service adapters for integration guidance

---

**Built with ❤️ for the railway industry**

*This dashboard provides the foundation for AI-powered railway operations. Integrate with your ML services and optimization engines to unlock the full potential of intelligent transportation management.*
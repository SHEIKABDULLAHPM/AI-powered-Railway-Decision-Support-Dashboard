// app/api/chat/route.ts - API route for chatbot interactions
import { NextRequest, NextResponse } from 'next/server';
import { mockChatMessages, mockChatSession, mockSimulationResult } from '@/services/mockData';
import { ChatbotMessage, ChatbotResponse, ApiResponse } from '@/lib/types';

// In-memory storage for demo purposes
// TODO: Replace with actual chat database and AI service in production
let chatSessions: Record<string, ChatbotMessage[]> = {
  [mockChatSession.sessionId]: mockChatMessages
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Session ID is required',
          code: 'MISSING_SESSION_ID',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }
    
    // TODO: In production, retrieve chat history from database
    // const messages = await chatDatabase.getMessages(sessionId, {
    //   orderBy: 'timestamp',
    //   order: 'ASC',
    //   includeContext: true
    // });
    
    const messages = chatSessions[sessionId] || [];

    const response: ApiResponse<ChatbotMessage[]> = {
      data: messages,
      success: true,
      message: 'Chat history retrieved successfully',
      timestamp: new Date().toISOString(),
      metadata: {
        sessionId,
        messageCount: messages.length,
        lastMessage: messages[messages.length - 1]?.timestamp
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    
    const errorResponse = {
      success: false,
      error: 'Failed to fetch chat history',
      code: 'CHAT_FETCH_ERROR',
      timestamp: new Date().toISOString(),
      details: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, message, context } = body;
    
    if (!sessionId || !message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Session ID and message are required',
          code: 'MISSING_REQUIRED_FIELDS',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }
    
    // Initialize session if it doesn't exist
    if (!chatSessions[sessionId]) {
      chatSessions[sessionId] = [];
    }
    
    // Add user message to session
    const userMessage: ChatbotMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      text: message,
      timestamp: new Date().toISOString()
    };
    
    chatSessions[sessionId].push(userMessage);
    
    // TODO: In production, call actual AI chatbot service
    // const aiResponse = await aiChatService.generateResponse({
    //   message,
    //   sessionId,
    //   context,
    //   systemContext: {
    //     currentTrains: await getActiveTrains(),
    //     activeRecommendations: await getActiveRecommendations(),
    //     currentKPIs: await getCurrentKPIs(),
    //     userRole: await getUserRole(sessionId)
    //   },
    //   aiConfig: {
    //     model: 'gpt-4',
    //     temperature: 0.7,
    //     maxTokens: 500,
    //     safetyMode: 'strict'
    //   }
    // });
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate AI response based on message content and intent
    const aiResponses = await generateAIResponse(message, sessionId, context);
    
    // Add AI responses to session
    chatSessions[sessionId].push(...aiResponses);

    const response: ApiResponse<ChatbotResponse[]> = {
      data: aiResponses,
      success: true,
      message: 'Chat response generated successfully',
      timestamp: new Date().toISOString(),
      metadata: {
        sessionId,
        responseCount: aiResponses.length,
        processingTime: '0.8s',
        intent: aiResponses[0]?.intent || 'general'
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing chat message:', error);
    
    const errorResponse = {
      success: false,
      error: 'Failed to process chat message',
      code: 'CHAT_PROCESSING_ERROR',
      timestamp: new Date().toISOString(),
      details: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Helper function to generate AI responses based on message intent
async function generateAIResponse(
  message: string, 
  sessionId: string, 
  context?: any
): Promise<ChatbotResponse[]> {
  const lowerMessage = message.toLowerCase();
  
  // Intent detection and response generation
  if (lowerMessage.includes('why') && (lowerMessage.includes('recommend') || lowerMessage.includes('suggestion'))) {
    return generateExplanationResponse(message);
  }
  
  if (lowerMessage.includes('simulate') || lowerMessage.includes('what if')) {
    return generateSimulationResponse(message);
  }
  
  if (lowerMessage.includes('kpi') || lowerMessage.includes('performance') || lowerMessage.includes('metric')) {
    return generateKPIAnalysisResponse(message);
  }
  
  if (lowerMessage.includes('train') && (lowerMessage.includes('status') || lowerMessage.includes('delay'))) {
    return generateTrainStatusResponse(message);
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('?')) {
    return generateHelpResponse(message);
  }
  
  // Default general response
  return generateGeneralResponse(message);
}

async function generateExplanationResponse(message: string): Promise<ChatbotResponse[]> {
  return [{
    id: `msg-${Date.now()}-ai`,
    role: 'assistant',
    text: `I can explain the reasoning behind our recommendations. The current recommendation for train IC-2847 is based on several factors:

1. **Current Delay**: The train is experiencing a 12-minute delay due to signal failure at Reading
2. **Network Impact**: This delay could cascade to affect 3 other trains on the same route
3. **Optimization Opportunity**: Rerouting via Oxford would reduce the delay by 8 minutes
4. **Confidence**: Our AI model has 87% confidence in this recommendation based on historical patterns

The recommendation prioritizes passenger experience while maintaining network efficiency. Would you like me to explain any specific aspect in more detail?`,
    timestamp: new Date().toISOString(),
    intent: 'explain_recommendation',
    confidence: 0.92,
    references: [
      {
        source: 'recommendation',
        id: 'rec-001',
        title: 'Dynamic Rerouting Recommendation',
        url: '/recommendations'
      }
    ]
  }];
}

async function generateSimulationResponse(message: string): Promise<ChatbotResponse[]> {
  // Extract simulation parameters from message
  const delayMatch = message.match(/(\d+)\s*min/);
  const trainMatch = message.match(/(IC-\d+|HST-\d+|REG-\d+|EXP-\d+)/i);
  
  const delay = delayMatch ? parseInt(delayMatch[1]) : 15;
  const trainId = trainMatch ? trainMatch[1].toUpperCase() : 'HST-1205';
  
  return [{
    id: `msg-${Date.now()}-ai`,
    role: 'assistant',
    text: `I'll run a simulation for ${trainId} with a ${delay}-minute delay scenario.

**Simulation Results:**
- **Projected Total Delay**: ${delay + 3} minutes (including cascading effects)
- **Throughput Impact**: -8% (from 142 to 131 trains/hour)
- **Network Utilization**: 82% (up from 78% due to congestion)
- **Safety Status**: Medium (increased monitoring recommended)

**Key Insights:**
- The delay would create a bottleneck affecting 2 other trains
- Recovery time estimated at 45 minutes
- Alternative routing could reduce impact by 40%

**Recommendations:**
1. Implement priority scheduling for ${trainId}
2. Prepare contingency routing for affected trains
3. Notify passengers of potential delays

Would you like me to run additional scenarios or provide more detailed analysis?`,
    timestamp: new Date().toISOString(),
    intent: 'run_simulation',
    confidence: 0.89,
    references: [
      {
        source: 'simulation',
        title: `${trainId} Delay Simulation`,
        url: '/what-if'
      }
    ],
    actionable: true
  }];
}

async function generateKPIAnalysisResponse(message: string): Promise<ChatbotResponse[]> {
  return [{
    id: `msg-${Date.now()}-ai`,
    role: 'assistant',
    text: `Here's the current KPI analysis:

**Network Performance Overview:**
- **Throughput**: 142 trains/hour (↑3.6% vs target of 150)
- **Average Delay**: 8.4 minutes (⚠️ above target of 5.0)
- **Utilization**: 78.3% (✅ good, target 85%)
- **AI Acceptance**: 89.2% (↑2.6% this hour)

**Trends & Insights:**
- Throughput is improving but still below target
- Delay reduction efforts showing positive results (-12.5% improvement)
- Network utilization is healthy with room for growth
- High AI recommendation acceptance indicates good model performance

**Areas for Attention:**
1. **Delay Management**: Focus on reducing average delay by 3.4 minutes
2. **Capacity Optimization**: Opportunity to increase utilization by 7%
3. **Predictive Accuracy**: Continue monitoring model performance

Would you like me to dive deeper into any specific metric or show historical trends?`,
    timestamp: new Date().toISOString(),
    intent: 'analyze_kpis',
    confidence: 0.94,
    references: [
      {
        source: 'dashboard',
        title: 'KPI Dashboard',
        url: '/dashboard'
      },
      {
        source: 'analytics',
        title: 'Performance Analytics',
        url: '/analytics'
      }
    ]
  }];
}

async function generateTrainStatusResponse(message: string): Promise<ChatbotResponse[]> {
  return [{
    id: `msg-${Date.now()}-ai`,
    role: 'assistant',
    text: `Current train status overview:

**Active Trains (4 total):**

🔴 **IC-2847** (London → Cardiff)
- Status: Delayed by 12 minutes
- Location: Reading
- Issue: Signal failure
- Passengers: 287/400

🟢 **HST-1205** (Edinburgh → London)  
- Status: On time
- Location: York
- Passengers: 423/550

🔴 **REG-4401** (Manchester → Liverpool)
- Status: Delayed by 25 minutes  
- Location: Warrington
- Issue: Weather conditions
- Passengers: 145/200

🟡 **EXP-7739** (Bristol → London)
- Status: At platform
- Location: Bristol Temple Meads
- Passengers: 298/350

**Summary:**
- 2 trains delayed (50%)
- 1 train on time (25%)  
- 1 train at platform (25%)
- Total passengers: 1,153

Would you like detailed information about any specific train or recommendations for the delayed services?`,
    timestamp: new Date().toISOString(),
    intent: 'get_train_status',
    confidence: 0.96,
    references: [
      {
        source: 'trains',
        title: 'Live Train Status',
        url: '/dashboard'
      }
    ]
  }];
}

async function generateHelpResponse(message: string): Promise<ChatbotResponse[]> {
  return [{
    id: `msg-${Date.now()}-ai`,
    role: 'assistant',
    text: `I'm here to help you with the Railway Decision-Support Dashboard! Here's what I can assist you with:

**🔍 Analysis & Insights**
- "Why is train IC-2847 recommended for rerouting?"
- "Show me current KPI trends"
- "Analyze network performance"

**🎯 Simulations**  
- "What if HST-1205 is delayed by 15 minutes?"
- "Simulate rerouting REG-4401 via alternative route"
- "Run scenario analysis for network congestion"

**📊 Status & Information**
- "Which trains are currently delayed?"
- "Show me today's performance metrics"
- "What are the current recommendations?"

**⚙️ Recommendations**
- "Explain the current recommendation"
- "What are the alternatives for this suggestion?"
- "Compare recommendation options"

**Important Note:** I can provide insights and suggestions, but I cannot directly control train operations or implement changes. All actions must be approved and executed through the main dashboard interface.

What would you like to explore first?`,
    timestamp: new Date().toISOString(),
    intent: 'general_help',
    confidence: 1.0,
    actionable: false
  }];
}

async function generateGeneralResponse(message: string): Promise<ChatbotResponse[]> {
  const responses = [
    "I understand you're asking about railway operations. Could you be more specific about what you'd like to know? I can help with train status, KPI analysis, simulations, or explain recommendations.",
    "I'm here to help with railway network analysis. You can ask me about current train delays, performance metrics, what-if scenarios, or recommendation explanations.",
    "That's an interesting question about our railway system. I can provide insights on train operations, network performance, delay predictions, or recommendation analysis. What specific area interests you?"
  ];
  
  return [{
    id: `msg-${Date.now()}-ai`,
    role: 'assistant',
    text: responses[Math.floor(Math.random() * responses.length)],
    timestamp: new Date().toISOString(),
    intent: 'general',
    confidence: 0.7
  }];
}
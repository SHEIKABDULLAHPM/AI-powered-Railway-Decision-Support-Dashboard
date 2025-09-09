// app/training/page.tsx - Model training and data management page
'use client';

import { motion } from 'framer-motion';
import { Database, Brain, Upload, Download } from 'lucide-react';
import { ChartCard } from '@/components/ChartCard';
import { Button } from '@/components/ui/button';

export default function TrainingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Training Data & Models</h1>
            <p className="text-muted-foreground mt-1">
              Manage training datasets and monitor model performance
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload Data
            </Button>
            <Button>
              <Brain className="w-4 h-4 mr-2" />
              Train Model
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Model Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold">v2.1.3</div>
              <div className="text-sm text-muted-foreground">Current Model</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Database className="h-8 w-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold">2.4M</div>
              <div className="text-sm text-muted-foreground">Training Records</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Download className="h-8 w-8 text-purple-500" />
            <div>
              <div className="text-2xl font-bold">87.5%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Training Data Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ChartCard title="Training Data Overview" subtitle="Available datasets for model training">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium mb-2">Historical Train Data</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  2+ years of train movement, delay, and performance data
                </p>
                <div className="text-2xl font-bold text-blue-600">1.8M records</div>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium mb-2">Weather Data</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Meteorological data correlated with train performance
                </p>
                <div className="text-2xl font-bold text-green-600">450K records</div>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium mb-2">Network Events</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Signal failures, maintenance, and infrastructure events
                </p>
                <div className="text-2xl font-bold text-orange-600">125K records</div>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium mb-2">Decision Outcomes</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Historical recommendation outcomes and effectiveness
                </p>
                <div className="text-2xl font-bold text-purple-600">32K records</div>
              </div>
            </div>
          </div>
        </ChartCard>
      </motion.div>

      {/* Model Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ChartCard title="Model Performance Metrics" subtitle="Current model accuracy and performance indicators">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-4">Prediction Accuracy</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Delay Prediction</span>
                  <span className="font-medium">89.2%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '89.2%' }}></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Throughput Forecast</span>
                  <span className="font-medium">91.7%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '91.7%' }}></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Safety Assessment</span>
                  <span className="font-medium">95.1%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '95.1%' }}></div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">Training Progress</h4>
              <div className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Current Training</span>
                    <span className="text-xs text-muted-foreground">In Progress</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">67% complete</div>
                </div>

                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Last Training:</span>
                    <span className="text-muted-foreground">2 days ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Scheduled:</span>
                    <span className="text-muted-foreground">In 5 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Training Time:</span>
                    <span className="text-muted-foreground">~4 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ChartCard>
      </motion.div>

      {/* TODO Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <Brain className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                Production Integration Required
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
                This training interface currently displays mock data. In production, integrate with your ML training pipeline:
              </p>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>• Connect to your data warehouse or training data sources</li>
                <li>• Integrate with ML training frameworks (TensorFlow, PyTorch, etc.)</li>
                <li>• Implement model versioning and deployment pipelines</li>
                <li>• Add real-time model performance monitoring</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
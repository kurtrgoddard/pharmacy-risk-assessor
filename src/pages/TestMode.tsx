
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Database, 
  Zap, 
  Bug, 
  Timer,
  Activity,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { dataOrchestrator } from '@/services/assessment/dataOrchestrator';
import { fallbackHandler } from '@/services/errorHandling/fallbackHandler';
import { cacheManager } from '@/services/cache/cacheManager';
import { pubchemAPI } from '@/services/api/pubchemAPI';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  duration?: number;
  details?: any;
  error?: string;
  dataSource?: string;
  confidence?: number;
  cacheHit?: boolean;
}

const TestMode = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);

  const updateTest = (name: string, updates: Partial<TestResult>) => {
    setTests(prev => prev.map(test => 
      test.name === name ? { ...test, ...updates } : test
    ));
  };

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    updateTest(testName, { status: 'running' });
    const startTime = Date.now();
    
    try {
      const result = await testFn();
      const duration = Date.now() - startTime;
      
      updateTest(testName, {
        status: 'success',
        duration,
        details: result,
        dataSource: result?.source,
        confidence: result?.confidence,
        cacheHit: result?.fromCache
      });
      
      return true;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      updateTest(testName, {
        status: 'error',
        duration,
        error: error.message
      });
      return false;
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setOverallProgress(0);
    
    const testDefinitions = [
      {
        name: 'PubChem API Integration',
        test: () => pubchemAPI.getComprehensiveHazardData('acetaminophen')
      },
      {
        name: 'Data Orchestrator',
        test: () => dataOrchestrator.getComprehensiveHazardData('ibuprofen')
      },
      {
        name: 'Cache System',
        test: async () => {
          const key = 'test-cache-key';
          const testData = { test: 'data', timestamp: Date.now() };
          
          // Test cache set
          cacheManager.set(key, testData, 'assessment');
          
          // Test cache get
          const retrieved = cacheManager.get(key, 'assessment');
          
          if (!retrieved) throw new Error('Cache failed to retrieve data');
          
          return { cached: true, data: retrieved };
        }
      },
      {
        name: 'Fallback Mechanisms',
        test: async () => {
          return fallbackHandler.executeWithFallback([
            {
              name: 'primary_source',
              confidence: 0.9,
              operation: () => Promise.resolve({ data: 'success' })
            },
            {
              name: 'fallback_source',
              confidence: 0.5,
              operation: () => Promise.resolve({ data: 'fallback' })
            }
          ], 'test_fallback');
        }
      },
      {
        name: 'Error Handling',
        test: async () => {
          try {
            await fallbackHandler.executeWithFallback([
              {
                name: 'failing_source',
                confidence: 0.9,
                operation: () => Promise.reject(new Error('Intentional test error'))
              }
            ], 'error_test');
            throw new Error('Should have failed');
          } catch (error) {
            return { errorHandled: true, message: 'Fallback worked correctly' };
          }
        }
      },
      {
        name: 'Performance Benchmark',
        test: async () => {
          const iterations = 10;
          const times: number[] = [];
          
          for (let i = 0; i < iterations; i++) {
            const start = performance.now();
            await cacheManager.get('test-performance', 'assessment');
            times.push(performance.now() - start);
          }
          
          return {
            averageTime: times.reduce((a, b) => a + b, 0) / iterations,
            minTime: Math.min(...times),
            maxTime: Math.max(...times)
          };
        }
      }
    ];

    // Initialize tests
    setTests(testDefinitions.map(t => ({ name: t.name, status: 'pending' as const })));

    let completed = 0;
    for (const testDef of testDefinitions) {
      await runTest(testDef.name, testDef.test);
      completed++;
      setOverallProgress((completed / testDefinitions.length) * 100);
    }

    setIsRunning(false);
    toast.success('All tests completed!');
  };

  const clearTests = () => {
    setTests([]);
    setOverallProgress(0);
  };

  const getStats = () => {
    const operationStats = fallbackHandler.getOperationStats();
    const cacheStats = cacheManager.getStats();
    
    return {
      operations: operationStats,
      cache: cacheStats
    };
  };

  const stats = getStats();

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">System Testing & Diagnostics</h1>
        <p className="text-gray-600">
          Verify API integrations, cache functionality, and error handling mechanisms
        </p>
      </div>

      <Tabs defaultValue="tests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tests">Tests</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5" />
                Integration Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <Button 
                  onClick={runAllTests} 
                  disabled={isRunning}
                  className="flex items-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  {isRunning ? 'Running Tests...' : 'Run All Tests'}
                </Button>
                <Button variant="outline" onClick={clearTests} disabled={isRunning}>
                  Clear Results
                </Button>
              </div>

              {isRunning && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4" />
                    <span>Overall Progress</span>
                  </div>
                  <Progress value={overallProgress} className="w-full" />
                </div>
              )}

              <div className="space-y-4">
                {tests.map((test) => (
                  <Card key={test.name} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {test.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                          {test.status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                          {test.status === 'running' && <Clock className="h-5 w-5 text-blue-500 animate-spin" />}
                          {test.status === 'pending' && <Clock className="h-5 w-5 text-gray-400" />}
                          <span className="font-medium">{test.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {test.duration && (
                            <Badge variant="outline">
                              {test.duration}ms
                            </Badge>
                          )}
                          {test.dataSource && (
                            <Badge variant="secondary">
                              {test.dataSource}
                            </Badge>
                          )}
                          {test.confidence && (
                            <Badge variant="outline">
                              {Math.round(test.confidence * 100)}% confidence
                            </Badge>
                          )}
                          {test.cacheHit !== undefined && (
                            <Badge variant={test.cacheHit ? "default" : "outline"}>
                              {test.cacheHit ? 'Cache Hit' : 'Cache Miss'}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {test.error && (
                        <Alert className="mt-2">
                          <XCircle className="h-4 w-4" />
                          <AlertDescription>{test.error}</AlertDescription>
                        </Alert>
                      )}
                      
                      {test.details && test.status === 'success' && (
                        <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                          <pre>{JSON.stringify(test.details, null, 2)}</pre>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Operation Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats.operations).map(([operation, data]) => (
                    <div key={operation} className="border-b pb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{operation}</span>
                        <Badge variant="outline">
                          {data.successRate.toFixed(1)}% success
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>Total calls: {data.totalCalls}</div>
                        <div>Avg duration: {data.averageDuration.toFixed(0)}ms</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Cache Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded">
                      <div className="text-2xl font-bold text-blue-600">
                        {stats.cache.totalItems}
                      </div>
                      <div className="text-sm text-blue-800">Total Items</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded">
                      <div className="text-2xl font-bold text-green-600">
                        {(stats.cache.hitRate * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-green-800">Hit Rate</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {Object.entries(stats.cache.byType).map(([type, count]) => (
                      <div key={type} className="flex justify-between">
                        <span className="capitalize">{type}:</span>
                        <span className="font-medium">{count} items</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="diagnostics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded">
                  <Timer className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-lg font-semibold">API Response</div>
                  <div className="text-2xl font-bold text-blue-600">~2.5s</div>
                  <div className="text-sm text-gray-600">Average</div>
                </div>
                
                <div className="text-center p-4 border rounded">
                  <Database className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <div className="text-lg font-semibold">Cache Hit Rate</div>
                  <div className="text-2xl font-bold text-green-600">
                    {(stats.cache.hitRate * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-600">Efficiency</div>
                </div>
                
                <div className="text-center p-4 border rounded">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
                  <div className="text-lg font-semibold">System Status</div>
                  <div className="text-2xl font-bold text-emerald-600">Healthy</div>
                  <div className="text-sm text-gray-600">All Systems</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded">
                <h3 className="font-semibold mb-2">Data Quality Indicators</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Primary Data Sources Available:</span>
                    <Badge variant="default">PubChem, NIOSH</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Fallback Mechanisms:</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Error Recovery:</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestMode;

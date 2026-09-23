'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Play,
  Terminal,
  Send,
  RotateCcw,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  Maximize2,
  Minimize2,
  Code2,
  Copy,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CodeExecutionResult } from '@/app/api/code/execute/route';

// Dynamic import of Monaco Editor to prevent SSR issues
const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#0D111A] text-xs font-mono text-slate-400">
      <span className="h-4 w-4 mr-2 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin" />
      Initializing Monaco IDE Environment...
    </div>
  ),
});

export interface MonacoCodeWorkspaceProps {
  initialCode?: string;
  initialLanguage?: string;
  onCodeChange?: (code: string) => void;
  onSendToAI: (payload: string) => void;
  isLoadingAi?: boolean;
  sessionId?: string;
  className?: string;
}

const STARTER_SNIPPETS: Record<string, string> = {
  typescript: `// TypeScript Technical Solution
interface NodeItem<T> {
  value: T;
  next?: NodeItem<T>;
}

export function solveInterviewProblem(input: number[]): { result: number; executionTimeMs: number } {
  const start = Date.now();
  console.log("Analyzing input stream:", input);

  // Implement your algorithm here...
  const sum = input.reduce((acc, curr) => acc + curr, 0);

  return {
    result: sum,
    executionTimeMs: Date.now() - start
  };
}

// Test case execution
const output = solveInterviewProblem([10, 25, 30, 45, 50]);
console.log("Execution Output:", JSON.stringify(output, null, 2));
`,
  javascript: `// JavaScript Solution
function solveInterviewProblem(data) {
  console.log("Processing input payload:", data);
  
  // Implement optimal O(N) solution
  const seen = new Set();
  const duplicates = [];
  
  for (const item of data) {
    if (seen.has(item)) {
      duplicates.push(item);
    } else {
      seen.add(item);
    }
  }
  
  return duplicates;
}

// Test Run
const result = solveInterviewProblem([1, 2, 3, 2, 4, 5, 1, 6]);
console.log("Result:", result);
`,
  python: `# Python Technical Solution
import time

def solve_interview_problem(nums: list[int], target: int) -> list[int]:
    """Find two numbers that add up to target in O(N) time."""
    print(f"Searching for target {target} in array of length {len(nums)}")
    
    lookup = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in lookup:
            return [lookup[diff], i]
        lookup[num] = i
        
    return []

# Test execution
test_nums = [2, 7, 11, 15]
test_target = 9
res = solve_interview_problem(test_nums, test_target)
print("Found indices:", res)
`,
  cpp: `// C++ Solution
#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> numMap;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (numMap.count(complement)) {
            return {numMap[complement], i};
        }
        numMap[nums[i]] = i;
    }
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> result = twoSum(nums, target);
    
    cout << "Indices: [" << result[0] << ", " << result[1] << "]" << endl;
    return 0;
}
`,
  java: `// Java Solution
import java.util.*;

public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }

    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        int[] result = twoSum(nums, target);
        System.out.println("Result: " + Arrays.toString(result));
    }
}
`,
  go: `// Go Technical Solution
package main

import "fmt"

func solve(nums []int, target int) []int {
    seen := make(map[int]int)
    for i, num := range nums {
        diff := target - num
        if idx, found := seen[diff]; found {
            return []int{idx, i}
        }
        seen[num] = i
    }
    return []int{}
}

func main() {
    nums := []int{2, 7, 11, 15}
    target := 9
    result := solve(nums, target)
    fmt.Printf("Solution indices: %v\\n", result)
}
`,
  rust: `// Rust Technical Solution
use std::collections::HashMap;

fn two_sum(nums: &[i32], target: i32) -> Option<(usize, usize)> {
    let mut map = HashMap::new();
    for (i, &num) in nums.iter().enumerate() {
        let complement = target - num;
        if let Some(&prev_idx) = map.get(&complement) {
            return Some((prev_idx, i));
        }
        map.insert(num, i);
    }
    None
}

fn main() {
    let nums = vec![2, 7, 11, 15];
    let target = 9;
    match two_sum(&nums, target) {
        Some((i, j)) => println!("Found indices: ({}, {})", i, j),
        None => println!("No matching pair found"),
    }
}
`,
};

const LANGUAGES = [
  { id: 'typescript', label: 'TypeScript' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python 3' },
  { id: 'cpp', label: 'C++ (g++)' },
  { id: 'java', label: 'Java' },
  { id: 'go', label: 'Go (Golang)' },
  { id: 'rust', label: 'Rust' },
];

export function MonacoCodeWorkspace({
  initialCode,
  initialLanguage = 'typescript',
  onCodeChange,
  onSendToAI,
  isLoadingAi = false,
  sessionId,
  className,
}: MonacoCodeWorkspaceProps) {
  const [language, setLanguage] = useState<string>(initialLanguage);
  const [code, setCode] = useState<string>(() => {
    return initialCode || STARTER_SNIPPETS[initialLanguage] || STARTER_SNIPPETS.typescript;
  });
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);
  const [showConsole, setShowConsole] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const editorRef = useRef<any>(null);

  // Sync code changes
  const handleEditorChange = (value: string | undefined) => {
    const updated = value || '';
    setCode(updated);
    if (onCodeChange) {
      onCodeChange(updated);
    }
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    // If the editor still has default or blank snippet, replace with new starter
    if (!code || Object.values(STARTER_SNIPPETS).includes(code)) {
      const starter = STARTER_SNIPPETS[newLang] || '// Write your code solution here\n';
      setCode(starter);
      if (onCodeChange) onCodeChange(starter);
    }
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  // Remote Code Execution Trigger
  const handleRunCode = async () => {
    if (isExecuting || !code.trim()) return;

    setIsExecuting(true);
    setShowConsole(true);
    setExecutionResult(null);

    try {
      const response = await fetch('/api/code/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
        }),
      });

      const data: CodeExecutionResult = await response.json();
      setExecutionResult(data);
    } catch (err: any) {
      setExecutionResult({
        stdout: '',
        stderr: err?.message || 'Failed to reach code execution sandbox.',
        output: err?.message || 'Execution error',
        exitCode: 1,
        executionTimeMs: 0,
        language,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // Synchronize Code & Execution Output with AI Interviewer
  const handleSendToAI = () => {
    if (!code.trim() || isLoadingAi) return;

    let payload = `\`\`\`${language}\n${code}\n\`\`\``;

    if (executionResult) {
      payload += `\n\n**Live Execution Results (${language.toUpperCase()}):**\n`;
      payload += `- Status: ${executionResult.exitCode === 0 ? 'Passed (Exit Code 0)' : `Failed (Exit Code ${executionResult.exitCode})`}\n`;
      payload += `- Execution Time: ${executionResult.executionTimeMs}ms\n`;
      if (executionResult.stdout) {
        payload += `\n*Standard Output (stdout):*\n\`\`\`\n${executionResult.stdout.trim()}\n\`\`\``;
      }
      if (executionResult.stderr) {
        payload += `\n*Standard Error (stderr):*\n\`\`\`\n${executionResult.stderr.trim()}\n\`\`\``;
      }
    } else {
      payload += `\n\n*(Candidate submitted code solution for architectural and algorithmic review.)*`;
    }

    onSendToAI(payload);
  };

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleResetStarter = () => {
    const starter = STARTER_SNIPPETS[language] || '// Write code here\n';
    setCode(starter);
    if (onCodeChange) onCodeChange(starter);
    setExecutionResult(null);
  };

  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl bg-[#161B26] border border-[#242D3E] shadow-xl overflow-hidden transition-all',
        isFullScreen ? 'fixed inset-4 z-50 bg-[#0E121B]' : 'h-full',
        className
      )}
    >
      {/* ── Header & Action Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-[#121622] border-b border-[#212A3B]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#18202E] border border-[#263246] text-xs font-semibold text-slate-200">
            <Code2 className="h-3.5 w-3.5 text-[#E8602E]" />
            <span>Monaco IDE</span>
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative inline-block">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="appearance-none bg-[#1A2232] hover:bg-[#222C40] border border-[#2B3850] rounded-lg px-2.5 py-1 pr-6 text-xs font-mono font-medium text-amber-300 focus:outline-none focus:ring-1 focus:ring-[#E8602E] cursor-pointer transition-colors"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id} className="bg-[#121622] text-slate-200">
                  {lang.label}
                </option>
              ))}
            </select>
            <ChevronDown className="h-3 w-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Toolbar Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopyCode}
            title="Copy code"
            className="p-1.5 rounded-lg bg-[#18202E] hover:bg-[#202B3D] text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-pointer border border-[#263246]"
          >
            {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>

          <button
            type="button"
            onClick={handleResetStarter}
            title="Reset code to template"
            className="p-1.5 rounded-lg bg-[#18202E] hover:bg-[#202B3D] text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-pointer border border-[#263246]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsFullScreen(!isFullScreen)}
            title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
            className="p-1.5 rounded-lg bg-[#18202E] hover:bg-[#202B3D] text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-pointer border border-[#263246]"
          >
            {isFullScreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>

          {/* Run Code Button */}
          <Button
            type="button"
            size="sm"
            onClick={handleRunCode}
            disabled={isExecuting || !code.trim()}
            className="gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isExecuting ? (
              <>
                <span className="h-3 w-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 fill-white" />
                <span>Run Code</span>
              </>
            )}
          </Button>

          {/* Send to AI Interviewer */}
          <Button
            type="button"
            size="sm"
            onClick={handleSendToAI}
            disabled={isLoadingAi || !code.trim()}
            className="gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#E8602E] to-[#F27740] hover:from-[#DC5420] hover:to-[#E8602E] text-white font-semibold text-xs shadow-md shadow-orange-950/40 cursor-pointer disabled:opacity-40"
          >
            {isLoadingAi ? (
              <>
                <span className="h-3 w-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3 text-amber-200" />
                <span>Submit to AI</span>
                <Send className="h-3 w-3 ml-0.5" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ── Monaco Editor Workspace ── */}
      <div className={cn('relative w-full flex-1 min-h-[260px]', isFullScreen ? 'h-[65vh]' : 'h-[320px]')}>
        <Editor
          height="100%"
          language={language === 'c++' ? 'cpp' : language}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
            minimap: { enabled: false },
            lineNumbers: 'on',
            roundedSelection: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            padding: { top: 12, bottom: 12 },
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            renderLineHighlight: 'all',
          }}
        />
      </div>

      {/* ── Console / Output Tray ── */}
      {showConsole && (
        <div className="border-t border-[#222B3D] bg-[#0A0D14] flex flex-col">
          {/* Console Header */}
          <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#0F131D] border-b border-[#1D2536] text-xs">
            <div className="flex items-center gap-2 font-mono text-slate-300">
              <Terminal className="h-3.5 w-3.5 text-[#E8602E]" />
              <span className="font-semibold">Execution Output</span>
              {executionResult && (
                <span
                  className={cn(
                    'px-1.5 py-0.5 rounded text-[10px] font-bold',
                    executionResult.exitCode === 0
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  )}
                >
                  {executionResult.exitCode === 0 ? 'Success (0)' : `Exit Code ${executionResult.exitCode}`}
                </span>
              )}
            </div>

            {executionResult && (
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-amber-400" />
                  {executionResult.executionTimeMs}ms
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-400">{executionResult.language}</span>
              </div>
            )}
          </div>

          {/* Console Body */}
          <div className="p-3 font-mono text-xs max-h-48 overflow-y-auto space-y-1.5">
            {isExecuting && (
              <div className="flex items-center gap-2 text-amber-400 py-1 animate-pulse">
                <span className="h-3 w-3 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
                <span>Executing code in isolated compilation sandbox...</span>
              </div>
            )}

            {!isExecuting && !executionResult && (
              <div className="text-slate-600 italic py-1">
                Click &quot;Run Code&quot; to execute your solution in the compiler sandbox.
              </div>
            )}

            {!isExecuting && executionResult && (
              <>
                {executionResult.stdout && (
                  <div className="whitespace-pre-wrap text-emerald-300 bg-[#06120D] p-2 rounded-lg border border-emerald-900/40">
                    {executionResult.stdout}
                  </div>
                )}
                {executionResult.stderr && (
                  <div className="whitespace-pre-wrap text-rose-300 bg-[#17090C] p-2 rounded-lg border border-rose-900/40 flex items-start gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{executionResult.stderr}</span>
                  </div>
                )}
                {!executionResult.stdout && !executionResult.stderr && (
                  <div className="text-slate-400 italic">
                    {executionResult.output || 'Execution completed with 0 output.'}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

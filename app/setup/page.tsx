'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Step = 'welcome' | 'model' | 'channel' | 'connect' | 'done';

export default function SetupPage() {
  const [step, setStep] = useState<Step>('welcome');
  const [selectedModel, setSelectedModel] = useState('claude-sonnet');
  const [linkCode, setLinkCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Generate link code on mount
  useState(() => {
    setLinkCode(`ALLY-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
  });

  const models = [
    { id: 'claude-sonnet', name: 'Claude Sonnet 4', desc: 'Fast & smart (recommended)', icon: '⚡' },
    { id: 'claude-opus', name: 'Claude Opus 4.5', desc: 'Most capable', icon: '🧠', badge: 'Pro' },
    { id: 'gpt-4', name: 'GPT-4o', desc: 'OpenAI alternative', icon: '🤖', soon: true },
  ];

  const channels = [
    { id: 'telegram', name: 'Telegram', icon: '📱', available: true },
    { id: 'discord', name: 'Discord', icon: '🎮', soon: true },
    { id: 'whatsapp', name: 'WhatsApp', icon: '💬', soon: true },
    { id: 'web', name: 'Web Chat', icon: '🌐', available: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-2xl">
              🤖
            </div>
            <span className="text-2xl font-bold text-white">Ally</span>
          </div>
        </motion.div>

        {/* Card */}
        <motion.div 
          layout
          className="bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {/* Welcome Step */}
            {step === 'welcome' && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <h1 className="text-3xl font-bold text-white mb-3">
                  Deploy your AI assistant
                </h1>
                <p className="text-gray-400 mb-8">
                  Get your own AI that actually does things. Ready in under 1 minute.
                </p>
                
                <button
                  onClick={() => setStep('model')}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
                >
                  Get Started →
                </button>

                <p className="text-gray-500 text-sm mt-6">
                  Already have an account?{' '}
                  <a href="/login" className="text-purple-400 hover:text-purple-300">Sign in</a>
                </p>
              </motion.div>
            )}

            {/* Model Selection */}
            {step === 'model' && (
              <motion.div
                key="model"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-white mb-2">Choose your AI model</h2>
                <p className="text-gray-400 mb-6">You can change this later</p>

                <div className="space-y-3 mb-8">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => !model.soon && setSelectedModel(model.id)}
                      disabled={model.soon}
                      className={`w-full p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 ${
                        model.soon 
                          ? 'border-gray-700/50 bg-gray-800/30 opacity-50 cursor-not-allowed'
                          : selectedModel === model.id
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600'
                      }`}
                    >
                      <span className="text-2xl">{model.icon}</span>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{model.name}</span>
                          {model.badge && (
                            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                              {model.badge}
                            </span>
                          )}
                          {model.soon && (
                            <span className="px-2 py-0.5 bg-gray-700 text-gray-400 text-xs rounded-full">
                              Coming soon
                            </span>
                          )}
                        </div>
                        <span className="text-gray-400 text-sm">{model.desc}</span>
                      </div>
                      {!model.soon && selectedModel === model.id && (
                        <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('welcome')}
                    className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep('channel')}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-xl transition-all"
                  >
                    Continue →
                  </button>
                </div>
              </motion.div>
            )}

            {/* Channel Selection */}
            {step === 'channel' && (
              <motion.div
                key="channel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-white mb-2">Connect your channel</h2>
                <p className="text-gray-400 mb-6">Where do you want to chat with Ally?</p>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {channels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => channel.available && setStep('connect')}
                      disabled={channel.soon}
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        channel.soon 
                          ? 'border-gray-700/50 bg-gray-800/30 opacity-50 cursor-not-allowed'
                          : 'border-gray-700/50 bg-gray-800/30 hover:border-purple-500 hover:bg-purple-500/10'
                      }`}
                    >
                      <span className="text-3xl block mb-2">{channel.icon}</span>
                      <span className="text-white font-medium block">{channel.name}</span>
                      {channel.soon && (
                        <span className="text-gray-500 text-xs">Coming soon</span>
                      )}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setStep('model')}
                  className="w-full py-3 text-gray-400 hover:text-white transition-colors"
                >
                  ← Back
                </button>
              </motion.div>
            )}

            {/* Connect Step */}
            {step === 'connect' && (
              <motion.div
                key="connect"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">📱</span>
                  <h2 className="text-2xl font-bold text-white">Connect Telegram</h2>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-6 mb-6">
                  <ol className="space-y-4 text-gray-300">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-sm flex items-center justify-center">1</span>
                      <span>Open Telegram and search for <strong className="text-white">@AllyAIBot</strong></span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-sm flex items-center justify-center">2</span>
                      <span>Start a chat and send this code:</span>
                    </li>
                  </ol>

                  <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-between">
                    <code className="text-xl font-mono text-purple-300">{linkCode}</code>
                    <button 
                      onClick={() => navigator.clipboard.writeText(linkCode)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>

                  <p className="text-gray-500 text-sm mt-4">
                    Or click: <a href={`https://t.me/AllyAIBot?start=${linkCode}`} target="_blank" className="text-purple-400 hover:text-purple-300">Open @AllyAIBot →</a>
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('channel')}
                    className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep('done')}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-xl transition-all"
                  >
                    I've connected →
                  </button>
                </div>
              </motion.div>
            )}

            {/* Done Step */}
            {step === 'done' && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-white mb-2">You're all set!</h2>
                <p className="text-gray-400 mb-8">
                  Ally is ready. Start chatting on Telegram or use the web interface.
                </p>

                <div className="space-y-3">
                  <a
                    href="https://t.me/AllyAIBot"
                    target="_blank"
                    className="block w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-xl transition-all"
                  >
                    Open Telegram →
                  </a>
                  <a
                    href="/chat"
                    className="block w-full py-4 border border-gray-700 hover:border-gray-600 text-white font-semibold rounded-xl transition-all"
                  >
                    Use Web Chat
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-6">
          {['welcome', 'model', 'channel', 'connect', 'done'].map((s, i) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-all ${
                s === step ? 'bg-purple-500 w-6' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Languages, 
  Eye, 
  EyeOff,
  Shuffle,
  BookOpen
} from 'lucide-react';
import { vocabulary, VocabularyItem } from './data/vocabulary';

type Mode = 'JP_TO_CN' | 'CN_TO_JP';

export default function App() {
  const [mode, setMode] = useState<Mode>('JP_TO_CN');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffledList, setShuffledList] = useState<VocabularyItem[]>([...vocabulary]);

  const currentItem = shuffledList[currentIndex];

  const handleShuffle = () => {
    const newList = [...vocabulary].sort(() => Math.random() - 0.5);
    setShuffledList(newList);
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  const handleNext = () => {
    if (currentIndex < shuffledList.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === 'JP_TO_CN' ? 'CN_TO_JP' : 'JP_TO_CN');
    setShowAnswer(false);
  };

  const reset = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setShowAnswer(prev => !prev);
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, shuffledList.length]); // Re-bind when index or list changes to ensure handlers have fresh state

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#2D2D2D] font-sans selection:bg-orange-100">
      {/* Header */}
      <header className="max-w-2xl mx-auto px-6 py-8 flex items-center justify-between border-b border-black/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
            <BookOpen size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">日文單字練習 N5</h1>
            <p className="text-xs text-black/40 font-medium uppercase tracking-widest">Japanese Vocab</p>
          </div>
        </div>
        
        <button 
          onClick={toggleMode}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-black/5 rounded-full text-sm font-medium hover:bg-black/5 transition-colors shadow-sm"
        >
          <Languages size={16} className="text-orange-500" />
          {mode === 'JP_TO_CN' ? '日 ➔ 中' : '中 ➔ 日'}
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Progress */}
        <div className="mb-8 flex items-center justify-between">
          <span className="text-xs font-mono text-black/40">
            {currentIndex + 1} / {shuffledList.length}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={handleShuffle}
              className="p-2 hover:bg-black/5 rounded-lg transition-colors text-black/60"
              title="隨機排序"
            >
              <Shuffle size={18} />
            </button>
            <button 
              onClick={reset}
              className="p-2 hover:bg-black/5 rounded-lg transition-colors text-black/60"
              title="重新開始"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        {/* Card Container */}
        <div className="relative perspective-1000 h-80 w-full mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex + mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full h-full"
            >
              <div 
                className="w-full h-full bg-white rounded-3xl border border-black/5 shadow-xl shadow-black/5 flex flex-col items-center justify-center p-8 text-center cursor-pointer group relative overflow-hidden"
                onClick={() => setShowAnswer(!showAnswer)}
              >
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500" />
                
                <div className="relative z-10">
                  {mode === 'JP_TO_CN' ? (
                    <>
                      <h2 className="text-5xl font-bold mb-4 tracking-tight">
                        {currentItem.japanese}
                      </h2>
                      <p className="text-lg text-black/30 font-medium mb-8">
                        {currentItem.reading !== currentItem.japanese ? currentItem.reading : ''}
                      </p>
                    </>
                  ) : (
                    <h2 className="text-4xl font-bold mb-12 tracking-tight">
                      {currentItem.chinese}
                    </h2>
                  )}

                  <div className="h-20 flex items-center justify-center">
                    {showAnswer ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-2xl font-medium text-orange-600"
                      >
                        {mode === 'JP_TO_CN' ? currentItem.chinese : (
                          <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold">{currentItem.japanese}</span>
                            <span className="text-sm text-black/40 mt-1">{currentItem.reading}</span>
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <div className="flex items-center gap-2 text-black/20 font-medium animate-pulse">
                        <Eye size={20} />
                        點擊顯示答案
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-14 h-14 rounded-full border border-black/5 bg-white flex items-center justify-center text-black/60 hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className={`px-10 py-4 rounded-full font-semibold transition-all shadow-lg ${
              showAnswer 
                ? 'bg-black text-white shadow-black/20' 
                : 'bg-orange-500 text-white shadow-orange-200'
            }`}
          >
            {showAnswer ? '隱藏答案' : '查看答案'}
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === shuffledList.length - 1}
            className="w-14 h-14 rounded-full border border-black/5 bg-white flex items-center justify-center text-black/60 hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </main>

      {/* Footer / Info */}
      <footer className="max-w-2xl mx-auto px-6 py-12 text-center">
        <p className="text-xs text-black/30 font-medium uppercase tracking-widest">
          使用空白鍵或點擊卡片來切換答案
        </p>
      </footer>
    </div>
  );
}

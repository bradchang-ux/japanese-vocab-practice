import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Languages,
  Eye,
  Shuffle,
  BookOpen,
  EyeOff
} from 'lucide-react';
import { n5Vocabulary, n4Vocabulary } from './data/words';
import { VocabularyItem } from './types';

type Mode = 'JP_TO_CN' | 'CN_TO_JP';
type Level = 'N5' | 'N4' | 'ALL';

export default function App() {
  const [mode, setMode] = useState<Mode>('JP_TO_CN');
  const [level, setLevel] = useState<Level>('N5');
  const [category, setCategory] = useState<string>('all');
  const [pos, setPos] = useState<string>('all');
  const [showReading, setShowReading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffledList, setShuffledList] = useState<VocabularyItem[]>([]);

  // ... (keep useMemo and other logic same as original)

  // Get combined or specific vocabulary based on selected level
  const currentLevelVocab = useMemo(() => {
    if (level === 'N5') return n5Vocabulary;
    if (level === 'N4') return n4Vocabulary;
    return [...n5Vocabulary, ...n4Vocabulary];
  }, [level]);

  // Extract unique categories and POS for dropdowns based on current level vocab
  const { availableCategories, availablePos } = useMemo(() => {
    const categories = new Set<string>();
    const poses = new Set<string>();

    currentLevelVocab.forEach(word => {
      categories.add(word.category);
      poses.add(word.pos);
    });

    return {
      availableCategories: Array.from(categories).sort(),
      availablePos: Array.from(poses).sort()
    };
  }, [currentLevelVocab]);

  // Filter vocabulary based on selected category and pos
  const filteredVocab = useMemo(() => {
    return currentLevelVocab.filter(word => {
      const matchCategory = category === 'all' || word.category === category;
      const matchPos = pos === 'all' || word.pos === pos;
      return matchCategory && matchPos;
    });
  }, [currentLevelVocab, category, pos]);

  useEffect(() => {
    handleShuffle();
  }, [filteredVocab]);

  const currentItem = shuffledList[currentIndex];

  const handleShuffle = () => {
    if (filteredVocab.length === 0) {
      setShuffledList([]);
      return;
    }
    const newList = [...filteredVocab].sort(() => Math.random() - 0.5);
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

  const toggleReading = () => {
    setShowReading(prev => !prev);
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
  }, [currentIndex, shuffledList.length]);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#2D2D2D] font-sans selection:bg-orange-100 pb-12">
      {/* Header */}
      <header className="max-w-2xl mx-auto px-6 py-8 flex items-center justify-between border-b border-black/5 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
            <BookOpen size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">日文單字練習</h1>
            <p className="text-xs text-black/40 font-medium uppercase tracking-widest">Japanese Vocab</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleReading}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors shadow-sm cursor-pointer ${showReading ? 'bg-orange-100 text-orange-600 border border-orange-200' : 'bg-white text-black/40 border border-black/10 hover:bg-black/5'}`}
            title={showReading ? '隱藏拼音' : '顯示拼音'}
          >
            {showReading ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
          <button
            onClick={toggleMode}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-black/5 rounded-full text-sm font-medium hover:bg-black/5 transition-colors shadow-sm"
          >
            <Languages size={16} className="text-orange-500" />
            {mode === 'JP_TO_CN' ? '日 ➔ 中' : '中 ➔ 日'}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
          {/* Level Selection */}
          <div>
            <label className="block text-xs font-semibold text-black/40 mb-2 uppercase tracking-wider">級別 Level</label>
            <div className="flex gap-2">
              <button
                onClick={() => { setLevel('N5'); setCategory('all'); setPos('all'); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${level === 'N5' ? 'bg-orange-500 text-white' : 'bg-black/5 text-black/60 hover:bg-black/10'}`}
              >
                N5 基礎
              </button>
              <button
                onClick={() => { setLevel('N4'); setCategory('all'); setPos('all'); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${level === 'N4' ? 'bg-orange-500 text-white' : 'bg-black/5 text-black/60 hover:bg-black/10'}`}
              >
                N4 進階
              </button>
              <button
                onClick={() => { setLevel('ALL'); setCategory('all'); setPos('all'); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${level === 'ALL' ? 'bg-orange-500 text-white' : 'bg-black/5 text-black/60 hover:bg-black/10'}`}
              >
                全部級別
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* POS Selection */}
            <div className="flex-1">
              <label className="block text-xs font-semibold text-black/40 mb-2 uppercase tracking-wider">詞性 POS</label>
              <div className="relative">
                <select
                  value={pos}
                  onChange={(e) => setPos(e.target.value)}
                  className="w-full appearance-none bg-black/5 border-none rounded-lg py-2 pl-4 pr-10 text-sm font-medium text-black/70 outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer"
                >
                  <option value="all">所有的詞性</option>
                  {availablePos.map(p => {
                    const count = currentLevelVocab.filter(w => w.pos === p && (category === 'all' || w.category === category)).length;
                    return <option key={p} value={p}>{p} ({count})</option>
                  })}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black/40">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
              </div>
            </div>

            {/* Category Selection */}
            <div className="flex-1">
              <label className="block text-xs font-semibold text-black/40 mb-2 uppercase tracking-wider">主題 Category</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none bg-black/5 border-none rounded-lg py-2 pl-4 pr-10 text-sm font-medium text-black/70 outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer"
                >
                  <option value="all">所有的主題</option>
                  {availableCategories.map(cat => {
                    const count = currentLevelVocab.filter(w => w.category === cat && (pos === 'all' || w.pos === pos)).length;
                    return <option key={cat} value={cat}>{cat} ({count})</option>
                  })}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black/40">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress & Controls */}
        <div className="mb-8 flex items-center justify-between px-2">
          <span className="text-xs font-semibold tracking-wider text-black/40">
            {filteredVocab.length > 0 ? `${currentIndex + 1} / ${shuffledList.length}` : '0 / 0'}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleShuffle}
              className="p-2 hover:bg-black/5 rounded-lg transition-colors text-black/60"
              title="隨機排序"
              disabled={filteredVocab.length === 0}
            >
              <Shuffle size={18} />
            </button>
            <button
              onClick={reset}
              className="p-2 hover:bg-black/5 rounded-lg transition-colors text-black/60"
              title="重新開始"
              disabled={filteredVocab.length === 0}
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        {/* Card Container */}
        {filteredVocab.length > 0 && currentItem ? (
          <div className="relative perspective-1000 h-80 w-full mb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex + mode + level + category + pos}
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
                  <div className="absolute top-4 left-4 flex gap-2 flex-wrap justify-start max-w-[80%]">
                    <span className="bg-orange-50 text-orange-600/80 text-[10px] font-bold px-2 py-1 rounded-md tracking-wider">
                      {currentItem.level}
                    </span>
                    <span className="bg-stone-100 text-stone-600/80 text-[10px] font-bold px-2 py-1 rounded-md tracking-wider">
                      {currentItem.pos}
                    </span>
                    <span className="bg-stone-100 text-stone-600/80 text-[10px] font-bold px-2 py-1 rounded-md tracking-wider">
                      {currentItem.category}
                    </span>
                  </div>

                  {/* Decorative background element */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500" />

                  <div className="relative z-10 w-full px-4">
                    {mode === 'JP_TO_CN' ? (
                      <>
                        <h2 className="text-5xl sm:text-6xl font-bold mb-4 tracking-tight break-words">
                          {currentItem.japanese}
                        </h2>
                        <p className={`text-lg text-black/50 font-medium mb-8 min-h-[1.75rem] transition-all duration-300 ${!showReading && currentItem.reading !== currentItem.japanese ? 'opacity-0 blur-sm' : 'opacity-100 blur-0'}`}>
                          {currentItem.reading !== currentItem.japanese ? currentItem.reading : ''}
                        </p>
                      </>
                    ) : (
                      <h2 className="text-3xl sm:text-4xl font-bold mb-12 tracking-tight break-words">
                        {currentItem.chinese}
                      </h2>
                    )}

                    <div className="h-24 flex items-center justify-center">
                      {showAnswer ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-2xl font-medium text-orange-600 w-full"
                        >
                          {mode === 'JP_TO_CN' ? (
                            <div className="break-words">{currentItem.chinese}</div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <span className="text-4xl font-bold break-words">{currentItem.japanese}</span>
                              <span className={`text-base text-black/50 mt-2 transition-all duration-300 ${!showReading ? 'opacity-0 blur-sm' : 'opacity-100 blur-0'}`}>{currentItem.reading}</span>
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
        ) : (
          <div className="h-80 w-full mb-12 flex items-center justify-center bg-black/5 rounded-3xl border border-black/[0.03]">
            <p className="text-black/40 font-medium">這個分類目前沒有單字哦</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0 || filteredVocab.length === 0}
            className="w-14 h-14 rounded-full border border-black/5 bg-white flex items-center justify-center text-black/60 hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm flex-shrink-0"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={() => setShowAnswer(!showAnswer)}
            disabled={filteredVocab.length === 0}
            className={`px-10 py-4 rounded-full font-semibold transition-all shadow-lg disabled:opacity-50 disabled:shadow-none ${showAnswer
              ? 'bg-black text-white shadow-black/20'
              : 'bg-orange-500 text-white shadow-orange-200'
              }`}
          >
            {showAnswer ? '隱藏答案' : '查看答案'}
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === shuffledList.length - 1 || filteredVocab.length === 0}
            className="w-14 h-14 rounded-full border border-black/5 bg-white flex items-center justify-center text-black/60 hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm flex-shrink-0"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </main>

      {/* Footer / Info */}
      <footer className="max-w-2xl mx-auto px-6 mt-8 text-center pb-8">
        <p className="text-xs text-black/30 font-medium uppercase tracking-widest leading-relaxed">
          使用空白鍵或點擊卡片來切換答案 <br className="sm:hidden" />
          <span className="hidden sm:inline">・</span>
          使用左右方向鍵切換前後單字
        </p>
      </footer>
    </div>
  );
}
